import {gql, PubSub} from 'apollo-server-express'
import sequelize, {FindOptions, Sequelize, fn} from "sequelize";
import {GraphQLResolverMap} from "@apollographql/apollo-tools/src/schema/resolverMap";

export function defineGraphQLEvents(database: Sequelize, eventSubscription: PubSub) {

    const typeDefs = gql`
        extend type Query {
            events(limit: Int, order: String, reverse: Boolean): [Event]
            event(event_id: ID!): Event
            eventAggregationOverTime(from: String!, to: String!, period: AggregationPeriod!, split: AggregationSubField!): EventAggregationOverTime
            eventMetrics: EventMetrics
        }
        enum AggregationPeriod {
            minutely
            hourly
            daily
            weekly
            monthly
            yearly
        }
        enum AggregationSubField {
            event_severity
        }
        type Event {
            event_id: ID!
            event_name: String!
            event_detail: String!
            event_time: String!
            event_severity: String!
            object_type: String!
            object_name: String!
        }
        type EventAggregationOverTime {
            buckets: [EventAggregationResultBucket]
        }
        type EventAggregationResultBucket {
            key: String!
            buckets: [EventAggregationResultSubBucket]
        }
        type EventAggregationResultSubBucket {
            key: String!
            count: Int!
        }
        type EventMetrics {
            total: Int!
            bySeverity: SeverityTotals!
        }
        type SeverityTotals {
            critical: Int!
            error: Int!
            warning: Int!
            information: Int!
        }
        type Subscription {
            eventReceived: Event    
        }
    `
    const resolvers: GraphQLResolverMap<any> = {
        Query: {
            events: async (obj: any, args: any) => {
                const options: FindOptions<any> = {}
                if (args.limit) {
                    options.limit = args.limit
                }
                if (args.order) {
                    let dir = 'ASC';
                    if (args.reverse) {
                        dir = 'DESC'
                    }
                    options.order = [[args.order, dir]]
                }

                return (await database.models.Event.findAll(options))
            },
            event: async (obj: any, args: any, context: any, info: any) => (await database.models.Event.findByPk(args.event_id)),
            eventMetrics: async () => {
                const result = await database.models.Event.findAll({
                    attributes: [
                        'event_severity',
                        [fn('count', Sequelize.col('event_id')), 'total'],
                    ],
                    group: ["event_severity"]
                })

                const totals: { [key: string]: number } = {}

                result.forEach((row) => totals[row.get().event_severity] = row.get().total)

                return {
                    total: Object.keys(totals).reduce((p, c) => p + totals[c], 0),
                    bySeverity: totals
                }
            },
            eventAggregationOverTime: async (parent: any, args: any) => {
                const fromDate = new Date(args.from)
                const toDate = new Date(args.to)

                const periods: any = {
                    minutely: 60,
                    hourly: 60 * 60,
                    daily: 60 * 60 * 24,
                    weekly: 60 * 60 * 24 * 7,
                    monthly: 60 * 60 * 24 * 30, // TODO: Ew
                    yearly: 60 * 60 * 24 * 365
                }

                const result = await database.query(
                    "SELECT COUNT(*) AS total," +
                    ` ${args.split} AS split_field,` +
                    ` (FLOOR(event_time /  (${periods[args.period]}) ) ) AS bucket` +
                    " FROM events" +
                    " WHERE event_time BETWEEN ? AND ?" +
                    ` GROUP BY bucket, ${args.split}` +
                    " ORDER BY bucket DESC",
                    {
                        replacements: [Math.floor(fromDate.getTime() / 1000), Math.floor(toDate.getTime() / 1000)]
                    }
                )

                const buckets: any = {}

                result.forEach(
                    (results: any) => {
                        results.forEach((row: any) => {
                            const bucketDate = new Date()
                            bucketDate.setTime(periods[args.period] * row.bucket * 1000)
                            const bucket_key = bucketDate.toISOString()
                            if (!(bucket_key in buckets)) {
                                buckets[bucket_key] = {
                                    key: bucket_key,
                                    buckets: []
                                }
                            }
                            buckets[bucket_key].buckets.push({
                                key: row.split_field,
                                count: row.total
                            })
                        })
                    }
                )

                return {
                    buckets: Object.values(buckets)
                }
            }
        },
        Subscription: {
            eventReceived: {
                subscribe: () => eventSubscription.asyncIterator(['EVENT_RECEIVED'])
            }
        }
    }

    return {
        typeDefs,
        resolvers
    }

}

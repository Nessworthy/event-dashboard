import {gql, PubSub} from 'apollo-server-express'
import {FindOptions, Sequelize, fn} from "sequelize";
import {GraphQLResolverMap} from "@apollographql/apollo-tools/src/schema/resolverMap";

export function defineGraphQLEvents(database: Sequelize, eventSubscription: PubSub) {

    const typeDefs = gql`
        extend type Query {
            events(limit: Int, order: String, reverse: Boolean): [Event]
            event(event_id: ID!): Event
            eventAggregationOverTime(from: Int!, to: Int!, period: AggregationPeriod!): EventAggregationOverTime
            eventMetrics: EventMetrics
        }
        enum AggregationPeriod {
            minutely
            hourly
            daily
            weekly
            yearly
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
            minutely: EventAggregationResult,
            hourly: EventAggregationResult,
            daily: EventAggregationResult,
            weekly: EventAggregationResult,
            yearly: EventAggregationResult
        }
        type EventAggregationResult {
            buckets: [EventAggregationResultBucket]
        }
        type EventAggregationResultBucket {
            key: String!
            events: [Event]
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
            eventAggregationOverTime: async (parent: any, args: any, context: any, info: any) => {
                console.log(info)
                return {
                    minutely: {
                        buckets: [
                            {
                                key: "2020-12-12",
                                events: {
                                    event_id: "test_id",
                                    event_name: "Test Name",
                                    event_detail: "Test detail.",
                                    event_time: "2021-12-12T01:00:25Z",
                                    event_severity: "critical",
                                    object_type: "Cluster",
                                    object_name: "cluster name"
                                }
                            }
                        ]
                    }
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

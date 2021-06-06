import {ApolloClient, gql} from "@apollo/client";

export class EventStorageSource {
    graphQLClient: ApolloClient<any>

    constructor(graphQLClient: ApolloClient<any>) {
        this.graphQLClient = graphQLClient
    }

    async getLatestEvents(limit: number) {
        return (await this.graphQLClient
            .query({
                query: gql`
                    query getEvents {
                      events(limit: ${limit}, order: "event_time", reverse: true) {
                        event_id,
                        event_time,
                        event_severity,
                        event_name,
                        object_type,
                        object_name,
                        event_detail
                      }
                    }
                `
            })
        ).data.events
    }
}

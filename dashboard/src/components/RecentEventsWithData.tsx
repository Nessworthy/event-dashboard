import {ObjectEvent} from "../types/ObjectEvent";
import {RecentEvents} from './RecentEvents'
import {gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table'

type RecentEventProps = {
    limit: number
}

const RECENT_EVENTS_QUERY = gql`
    query getEvents($limit: Int!) {
      events(limit: $limit, order: "event_time", reverse: true) {
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

const RECENT_EVENTS_SUBSCRIPTION_QUERY = gql`
    subscription OnEventReceived {
        eventReceived {
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

export default function RecentEventsWithData(props: RecentEventProps) {
    const {subscribeToMore, ...result} = useQuery(RECENT_EVENTS_QUERY, { variables: { limit: props.limit } })

    console.log('trigger')
    const limit = props.limit

    return (
        <div className="recent-events">
            <Table hover size="sm">
                <thead>
                    <tr>
                        <th>
                            Severity
                        </th>
                        <th>
                            Event
                        </th>
                        <th>
                            Service
                        </th>
                        <th>
                            Service Name
                        </th>
                        <th>
                            Details
                        </th>
                        <th>
                            Occurred
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <RecentEvents
                        {...result}
                        subscribeToNewEvents={() =>
                            subscribeToMore({
                                document: RECENT_EVENTS_SUBSCRIPTION_QUERY,
                                updateQuery: (prev, {subscriptionData }) => {
                                    if (!subscriptionData.data) { return prev }
                                    const newEvent: ObjectEvent = subscriptionData.data.eventReceived

                                    return {
                                        events: [newEvent, ...(prev.events.slice(0, limit - 1))]
                                    }
                                }
                            })
                        }
                    />
                </tbody>
            </Table>
        </div>
    );
}

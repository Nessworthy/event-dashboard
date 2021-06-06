import {ObjectEvent} from "../types/ObjectEvent";
import Badge from "react-bootstrap/Badge"
const moment = require('moment')

type RecentEventRowProps = {
    event: ObjectEvent
}

const badgeBackgroundMap: {
    [key: string]: string
} = {
    'critical': 'dark',
    'error': 'danger',
    'warning': 'warning',
    'information': 'info'
}

export function RecentEventRow(props: RecentEventRowProps) {
    const event = props.event
    const eventDate = new Date(event.event_time)
    const eventFormattedDate = moment(eventDate).format('YYYY-MM-DD HH:mm:SS')


    return (
        <tr>
            <td>
                <Badge variant={badgeBackgroundMap[event.event_severity]}>{event.event_severity}</Badge>
            </td>
            <td>
                <code>{event.event_name}</code>
            </td>
            <td>
                {event.object_type}
            </td>
            <td>
                {event.object_name}
            </td>
            <td>
                {event.event_detail}
            </td>
            <td>
                {eventFormattedDate}
            </td>
        </tr>
    )
}

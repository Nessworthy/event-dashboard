import { Component } from 'react';

import { ObservableQuery } from '@apollo/client';
import { ObjectEvent } from '../types/ObjectEvent';
import { RecentEventRow } from './RecentEventRow'

import Spinner from 'react-bootstrap/Spinner'


type RecentEventProps = {
    subscribeToNewEvents: ObservableQuery,
    data: any
}


export class RecentEvents extends Component<any, any> {

    unsubscribe: any = null

    constructor(props: RecentEventProps) {
        super(props)
    }

    componentDidMount() {
        this.unsubscribe = this.props.subscribeToNewEvents();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }

    render() {

        if (!this.props.data) {
            return (
                <tr>
                    <td colSpan={6}>
                        <Spinner animation="border" variant="primary" />
                    </td>
                </tr>
            )
        }

        const eventRows = this.props.data.events.map((event: ObjectEvent) =>
            <RecentEventRow key={event.event_id} event={event} />
        )

        return (
            [eventRows]
        );
    }


}

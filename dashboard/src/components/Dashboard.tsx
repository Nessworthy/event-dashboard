import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import React from "react";
import RecentEventsWithData from "./RecentEventsWithData";
import EventsOverTimeBarChart from "./EventsOverTimeBarChart";

import './EventsOverTimeBarChart.css'
import moment from "moment";

export default function Dashboard(props: any)
{
    const dailyFrom = moment().subtract(7, 'days').startOf('day')
    const dailyTo = moment().endOf('day')

    const weeklyFrom = moment().subtract(6, 'months').startOf('month')
    const weeklyTo = moment().endOf('day')


    return (
        <Container fluid>
            <Row>
                <Col className="events-over-time-chart">
                    <h3>Events by Severity, Monthly</h3>
                    <EventsOverTimeBarChart period="monthly" from={weeklyFrom} to={weeklyTo} by="event_severity"/>

                </Col>
                <Col className="events-over-time-chart">
                    <h3>Events by Severity, Daily</h3>
                    <EventsOverTimeBarChart period="daily" from={dailyFrom} to={dailyTo} by="event_severity"/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>Latest Events</h3>
                    <RecentEventsWithData limit={10}/>
                </Col>
            </Row>
        </Container>
    )
}

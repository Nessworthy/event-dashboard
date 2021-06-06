import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import React from "react";
import RecentEventsWithData from "./RecentEventsWithData";
import EventsOverTimeBarChart from "./EventsOverTimeBarChart";

import './EventsOverTimeBarChart.css'

export default function Dashboard(props: any)
{
    return (
        <Container fluid>
            <Row>
                <Col className="events-over-time-chart">
                    <EventsOverTimeBarChart/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <RecentEventsWithData limit={10}/>
                </Col>
            </Row>
        </Container>
    )
}

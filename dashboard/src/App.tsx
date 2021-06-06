import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Alert from 'react-bootstrap/Alert'
import Col from "react-bootstrap/Col";

function App() {

    return (
        <Container className="vh-100 vw-100" fluid>
            <Row>
                <Col>
                    <Alert variant="info">This is a test dashboard - the supporting data is generated from a fake data set.</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Dashboard/>
                </Col>
            </Row>
        </Container>
    );
}

export default App;

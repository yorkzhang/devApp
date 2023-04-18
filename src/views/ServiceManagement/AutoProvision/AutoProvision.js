import React from 'react'
// react-bootstrap components
import { Card, Nav, Container, Row, Col, Tab, } from "react-bootstrap";
// AutoProvision分頁
import OnBoardning from './OnBoardning';
import AutoBackup from './AutoBackup';
import AutoDatabase from './AutoDatabase';
import AutoStorage from './AutoStorage';

const AutoProvision = () =>{
    return(
        <>
        <Container>
            <Row>
                <Col className="ml-auto mr-auto" md="12">
                    <Card>
                        <Card.Body>
                            <Tab.Container
                            id="icons-tabs-example"
                            defaultActiveKey="info-icons"
                            >
                            <Nav role="tablist" variant="tabs">
                                <Nav.Item>
                                <Nav.Link eventKey="info-icons">
                                    <i className="fas fa-info-circle"></i> Lighthouse onboardning
                                </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                <Nav.Link eventKey="account-icons">
                                    <i className="fas fas fa-database"></i>Backup for Workload
                                </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                <Nav.Link eventKey="style-icons">
                                    <i className="fas fa-database"></i>SQL Server/Database
                                </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                <Nav.Link eventKey="settings-icons">
                                    <i className="fas fa-cog"></i>Standard Storage Account
                                </Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="info-icons">
                                    <OnBoardning/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="account-icons">
                                    <AutoBackup/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="style-icons">
                                    <AutoDatabase/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="settings-icons">
                                    <AutoStorage/>
                                </Tab.Pane>
                            </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default AutoProvision
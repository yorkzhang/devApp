import React from 'react'
// react-bootstrap components
import { Button, Card, Row, Col, } from "react-bootstrap";

const OnBoardning = () =>{
    return(
        <>
        <div>
            <Card.Header>
            <Card.Title as="h4">Azure Lighthouse onboardning</Card.Title>
            </Card.Header>
            <Card.Body>
                <Col className="m-auto d-flex flex-row justify-content-center">
                    <Col md="4" className="m-2">
                        <h5 style={{backgroundColor:'black', color:'white', paddingLeft:'1.5rem'}}>Role requirement</h5>
                        <blockquote>
                        <p>1. Contributor</p>
                        <p>2. Reader</p>
                        <p>3. Delete</p>
                        </blockquote>
                    </Col>
                    <Col md="8" className="m-2">
                        <h5 style={{backgroundColor:'black', color:'white', paddingLeft:'1.5rem'}}>Download and Submit</h5>
                        <blockquote>
                        <p>
                        Please download deployarmparap.json file and then click Submit button, after choosing the corresponding subscription click Edit Parameters, upload the deployarmpara.json manually.
                        </p>
                        <small>
                            {/* Someone famous in{" "} */}
                            <cite card-title="Source card-title">
                                This task will take about 20 mins.
                            </cite>
                        </small>
                        </blockquote>
                    </Col>
                </Col>
            </Card.Body>

            <Card.Footer>
                <Row md='12' className="d-flex justify-content-end mr-3" style={{backgroundColor:'white'}}>
                    <Button className="btn btn-success btn-l col-2 m-2">Download</Button>
                    <Button className="btn btn-success btn-l col-2 m-2">Submit</Button>
                </Row>
            </Card.Footer>
        </div>
        </>
    )
}

export default OnBoardning
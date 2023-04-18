import React from "react";
// react component used to create charts
import ChartistGraph from "react-chartist";
// react components used to create a SVG / Vector map
import { VectorMap } from "react-jvectormap";
// 將Dashboard拆成幾個部分呈現
import DASHHeader from "./Dashboard/DASHHeader";
import DASHChart from "./Dashboard/DASHChart";
import DASHPieChart from "./Dashboard/DASHPieChart";
import TicketList from "./Dashboard/TicketList";
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import DASHForecast from "./Dashboard/DASHForecast";

function Dashboard() {
  return (
    <>
      <Container fluid>
        <Row>
          <DASHHeader />
        </Row>
        <Row>
          <Col md="5">
            <Card>
              {/* <Card.Header>
                <Card.Title as="h4">服務類別</Card.Title>
                <p className="card-category">Last Campaign Performance</p>
              </Card.Header>
              <Card.Body>
                <ChartistGraph
                  className="ct-perfect-fourth"
                  data={{
                    labels: ["40%", "20%", "40%"],
                    series: [40, 20, 40]
                  }}
                  type="Pie"
                  height={450}
                />
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle mr-1 text-info"></i>
                  Open <i className="fas fa-circle mr-1 text-danger"></i>
                  Bounce <i className="fas fa-circle mr-1 text-warning"></i>
                  Unsubscribe
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o"></i>
                  Campaign sent 2 days ago
                </div>
              </Card.Footer> */}

              <Card.Header>
                <Card.Title as="h4">服務類別</Card.Title>
                {/* <p className="card-category">24 Hours performance</p> */}
              </Card.Header>

              <Card.Body>
                <DASHPieChart />
              </Card.Body>

              <Card.Footer></Card.Footer>
            </Card>
          </Col>

          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">本月費用趨勢圖</Card.Title>
                {/* <p className="card-category">24 Hours performance</p> */}
              </Card.Header>

              <Card.Body>
                <DASHChart />
              </Card.Body>

              <Card.Footer></Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">每月使用金額</Card.Title>
                {/* <p className="card-category">24 Hours performance</p> */}
              </Card.Header>

              <Card.Body>
                <DASHForecast />
              </Card.Body>

              <Card.Footer></Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">服務請求</Card.Title>
                {/* <p className="card-category">Backend development</p> */}
              </Card.Header>
              <Card.Body>
                <TicketList />
              </Card.Body>
              {/* <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  刷新
                </div>
              </Card.Footer> */}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;

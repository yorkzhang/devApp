import React, { useState } from "react";
import "./_clientmail.scss";
import {
  Badge,
  Button,
  Card,
  Form,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import image4 from "assets/img/full-screen-image-4.jpg";

export default function ClientMail() {
  const [info, setInfo] = useState({
    account: "metaage",
    password: "123",
  }); //預設通關帳號密碼
  const [account, setAccount] = useState("metaage"); //輸入的帳號
  const [password, setPassword] = useState("123"); //輸入的密碼
  const [clientMail, setClientMail] = useState(""); //要寄信的客戶信箱
  const [LoginStatus, setLoginStatus] = useState(false); //登入狀態
  const [SubmitStatus, setSubmitStatus] = useState(false); //表單送出狀態
  const [ErrorMsg, setErrorMsg] = useState(""); //錯誤訊息

  //PLM登入驗證
  const ConfirmPermission = () => {
    if (account == info.account && password == info.password) {
      setLoginStatus(true);
    } else {
      alert("認證錯誤");
    }
  };

  // 確認寄信
  const SendMailToClient = async () => {
    if(SubmitStatus) return null; //送出中就不送，避免重複發送
    if (!clientMail) {
      setErrorMsg("信箱為必填");
      return null;
    }
    // 信箱格式驗證
    let MailRegex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (MailRegex.test(clientMail)) {
      setErrorMsg(null);
      setSubmitStatus(true); //送出狀態改為送出中
      let res = await axios.post(
        `https://api.metaage.pro/api/BuildCustomerProcesses/V1/PlmSendMail`,
        {
          RandomCode: "1",
          CustomerMail: clientMail,
          Status: null,
          CreateDate: null,
          ModifyDate: null,
        }
      );
      setSubmitStatus(false); //送出狀態改為送出結束
      // console.log("res", res);
      if (res.status == 200) {
        alert("成功送出");
      }else{
        alert("發生錯誤");
      }
    } else {
      setErrorMsg("信箱格式錯誤");
      return null;
    }
  };

  const RenderLoginModal = () => (
    <div className="p-3">
      <Row className="justify-content-center">
        <Col md="5">
          <Card className="stacked-form">
            <Card.Header className="text-center mt-5 title">
              <img src={require("assets/img/MetaAgeLogo.png")} alt="..." />
              <h2>權限驗證</h2>
            </Card.Header>
            <Card.Body>
              <Form action="#" method="#">
                <Form.Group>
                  <label>帳號</label>
                  <Form.Control
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value);
                    }}
                    placeholder="輸入帳號"
                    type="text"
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <label>密碼</label>
                  <Form.Control
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="輸入密碼"
                    type="password"
                  ></Form.Control>
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Row className="justify-content-center">
                <Col sm={6}>
                  <Button
                    onClick={() => ConfirmPermission()}
                    className="btn-wd mr-1 w-100"
                    variant="primary"
                  >
                    送出
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const RenderMailModal = () => (
    <div className="p-3">
      <Row className="justify-content-center">
        <Col md="5">
          <Card className="stacked-form">
            <Card.Header className="text-center mt-5 title">
              <img src={require("assets/img/MetaAgeLogo.png")} alt="..." />
              <h2>寄發MSP客戶郵件</h2>
            </Card.Header>
            <Card.Body>
              <Form action="#" method="#">
                <Form.Group>
                  <label>客戶信箱</label>
                  <Form.Control
                    value={clientMail}
                    onChange={(e) => {
                      setClientMail(e.target.value);
                    }}
                    placeholder="輸入客戶信箱"
                    type="email"
                  ></Form.Control>
                  {ErrorMsg ? (
                    <label className="text-danger">{ErrorMsg}</label>
                  ) : null}
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Row className="justify-content-center">
                <Col sm={6}>
                  <Button
                    onClick={() => SendMailToClient()}
                    className="btn-wd mr-1 w-100"
                    variant={SubmitStatus ? 'default':'primary'}
                  >
                    送出
                  </Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <>
      <div>
        <div className="bg"></div>
        {LoginStatus ? RenderMailModal() : RenderLoginModal()}
      </div>
    </>
  );
}

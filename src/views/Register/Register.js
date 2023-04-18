import React, { useState, useEffect } from "react";
import "./_register.scss";
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
import image4 from "assets/img/full-screen-image-4.jpg";
import axios from "axios";
import {
  BrowserRouter as Rouer,
  useLocation,
  useHistory,
} from "react-router-dom";

export default function Register() {
  const location = useLocation(); //取網址用
  const history = useHistory(); //轉址用
  const [RandomCode, setRandomCode] = useState(
    location.pathname.split("/").pop()
  ); //隨機碼
  const [CompanyName, setCompanyName] = useState(""); //公司名稱
  const [CompanyPhone, setCompanyPhone] = useState(""); //公司電話
  const [CompanyCompilation, setCompanyCompilation] = useState(""); //公司統編
  const [ContactPerson, setContactPerson] = useState(""); //聯絡人
  const [CompanyMail, setCompanyMail] = useState(""); //信箱
  const [CompanyAddress, setCompanyAddress] = useState(""); //公司地址
  const [CompanyTelephone, setCompanyTelephone] = useState(""); //聯絡人電話

  const [SubmitStatus, setSubmitStatus] = useState(false); //表單送出狀態，避免重複送出

 

  useEffect(() => {
    if (!RandomCode) {
      alert("隨機碼取得錯誤");
    } else {
      console.log('RandomCode',RandomCode);
      CheckRandomcode();
    }
  }, [Rouer]);

  // 檢查隨機碼是否可用
  const CheckRandomcode = async () => {
    let res = await axios
      .get(
        `https://api.metaage.pro/api/BuildCustomerProcesses/V1/GetRandomCode?QureyRandomcode=${RandomCode}`
      )
      .catch((err) => {
        history.push("/");
      });
  };

  // 送出客戶資料
  const SubmitClientData = async (e) => {
    if(SubmitStatus) return null; //送出中就不送，避免重複發送
    if(
      !RandomCode || 
      !CompanyName || 
      !CompanyPhone || 
      !CompanyCompilation || 
      !ContactPerson || 
      !CompanyMail || 
      !CompanyAddress || 
      !CompanyTelephone 
    ){
      return null;
    }

    e.preventDefault();

    setSubmitStatus(true); //狀態改為送出中
    console.log( {
      RandomCode,
      CompanyName,
      CompanyPhone,
      CompanyCompilation,
      ContactPerson,
      CompanyMail,
      CompanyAddress,
      CompanyTelephone,
    });
    let res = await axios.post(
      `https://api.metaage.pro/api/BuildCustomerProcesses/V1/PlmCreateCompany`,
      {
        RandomCode,
        CompanyName,
        CompanyPhone,
        CompanyCompilation,
        ContactPerson,
        CompanyMail,
        CompanyAddress,
        CompanyTelephone,
      }
    );
    setSubmitStatus(false); //狀態改為送出結束
    console.log("res", res);
    if(res.status==200){
      alert('資料送出成功')
      history.push("/");
    }else{
      CheckRandomcode()
    }
  };

  return (
    <>
      <div className="bg"></div>
      <div className="p-3">
        <Row className="justify-content-center">
          <Col md="5">
            <Card className="stacked-form">
              <Card.Header className="text-center mt-5 title">
                <img src={require("assets/img/MetaAgeLogo.png")} alt="..." />
                <h2>客戶填寫資料</h2>
              </Card.Header>
              <Card.Body>
                <Form action="#" method="#">
                  <Form.Group>
                    <label>公司名稱</label>
                    <Form.Control
                      value={CompanyName}
                      required
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="輸入公司名稱"
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>公司電話</label>
                    <Form.Control
                      value={CompanyPhone}
                      required
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="輸入公司電話"
                      type="tel"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>公司統編</label>
                    <Form.Control
                      value={CompanyCompilation}
                      required
                      onChange={(e) => setCompanyCompilation(e.target.value)}
                      placeholder="輸入公司統編"
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>聯絡人</label>
                    <Form.Control
                      value={ContactPerson}
                      required
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="輸入聯絡人"
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>公司信箱</label>
                    <Form.Control
                      value={CompanyMail}
                      required
                      onChange={(e) => setCompanyMail(e.target.value)}
                      placeholder="輸入公司信箱"
                      type="email"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>公司地址</label>
                    <Form.Control
                      value={CompanyAddress}
                      required
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="輸入公司地址"
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>電話</label>
                    <Form.Control
                      value={CompanyTelephone}
                      required
                      onChange={(e) => setCompanyTelephone(e.target.value)}
                      placeholder="輸入電話"
                      type="tel"
                    ></Form.Control>
                  </Form.Group>
                  <Row className="justify-content-center">
                    <Col sm={6}>
                      <Button className="btn-wd mr-1 w-100" onClick={(e)=>SubmitClientData(e)}  type="submit" variant={SubmitStatus ? 'default':'primary'}>
                        送出
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

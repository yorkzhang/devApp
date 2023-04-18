import React, { useState, useEffect } from "react";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Col,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";
import axios from "axios";
import {
  BrowserRouter as Rouer,
  useLocation,
  useHistory,
} from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import { selectUser } from "ReduxStore/slice/userSlice";

import LineDemo from "../../../assets/img/LineDemo.PNG";

export default function LineSetting() {
  // 從登入後取得的User權限資訊--TenantID、Group
  const TenantID_Group = useSelector(selectUser);
  const [lineID, setLineID] = useState();
  const [initToggle, setInitToggle] = useState();
  const [inputID, setInputID] = useState();
  let tenantId = TenantID_Group.userInfo.CustomerTenantId;
  
  //LineID更新中 
  const [Updating, setUpdating] = useState(false);


  // 比對目前的使用者以及查詢line的狀態
  useEffect(() => {
    console.log("router變");

    if (tenantId) {
      CheckLineInfo();
    }
  }, [Rouer, tenantId]);

  // 檢查LineID
  const CheckLineInfo = async () => {
    let getInfoResponse = await axios
      // .get(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyCompany?QureyCustomerTenantId=1`)
      .get(
        `https://api.metaage.pro/api/LINENotify/V1/LineNotifyCompany?QureyCustomerTenantId=${tenantId}`
      )
      .catch((err) => {
        console.log(err.response.data);
        setInitToggle(false);
        return null;
      });

    if (!getInfoResponse || getInfoResponse.status !== 200) {
      return null;
    }
    console.log("getInfoResponse", getInfoResponse);
    if (getInfoResponse.data.length > 0) {
      // 取得的初始LineID
      setLineID(getInfoResponse.data[0].companyLineId);
      // 取得的初始接收通知(開啟:1 關閉:0)，並且對應checkbox傳入true、false
      if (getInfoResponse.data[0].status === "1") {
        setInitToggle(true);
      } else {
        setInitToggle(false);
      }
    }
  };

  // 新增使用者line ID
  const AddId = async () => {
    if (!inputID) {
      console.log("EMPTY");
      return null;
    }
    let data = {
      CompanyId: tenantId,
      CompanyLineId: inputID,
      Status: "1",
    };
    let AddLineIdRes = await axios
      .post(
        `https://api.metaage.pro/api/LINENotify/V1/LineNotifyCreateCompany`,
        data
      )
      .catch((err) => {
        console.log(err.response.data);
        alert("LineID新增發生錯誤");
      });
    console.log("AddLineIdRes", AddLineIdRes);
    if (AddLineIdRes && AddLineIdRes.status == 200) {
      CheckLineInfo();
      alert('LineID新增成功!')
    }
    console.log("ADD ID POST!");
  };

   // 修正使用者開啟狀態
   const ToggleNotify = async (value) => {
    let data = {
      "CompanyId":tenantId,  // 測試用: "CompanyId":'1', 
      "CompanyLineId":lineID, 
      "Status": value === true ? '1': '0' // 測試用: "Status": '0'
    }
    setUpdating(true)
    let NotifyUpdateResponse = await axios
    .put(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyUpdateCompany`, data)
    .catch((err)=>{
      setUpdating(false)
      console.log(err.response.data);
      alert("LineID狀態更新時發生錯誤");
    });
    setUpdating(false)
    
    console.log('NotifyUpdateResponse',NotifyUpdateResponse);
    
    if(NotifyUpdateResponse && NotifyUpdateResponse.status == 200){
      CheckLineInfo();
      alert('LineID狀態更新成功!')
    }
  }

  // 有LineID時顯示
  const ContainLineId = () => (
    <>
      <Card.Title as="h4">Line 設定</Card.Title>
      <hr />
      <Row className={`mt-4`}>
        <Col sm={12} md={6}>
          <p className="my-0">是否持續接收Line通知</p>
        </Col>
        <Col sm={12} md={6}>
          <div style={{ width: "fit-content", marginLeft: "auto" }}>
            <Form.Check
              disabled={Updating ? true : false}
              type="switch"
              id="custom-switch-12"
              onChange={(e) => {
                ToggleNotify(e.target.checked);
              }}
              checked={initToggle === true ? true : false}
            />
          </div>
        </Col>
      </Row>
    </>
  );

  // 沒LineID時顯示
  const NoContainLineId = () => (
    <>
      <Card.Title as="h4">Line 入群申請</Card.Title>
      <hr />
      <div className={`mt-4`}>
        <p className="my-0 mb-2">提供Line ID，確認後會立刻將您加入群組唷</p>
        <Row>
          <Col sm={12} md={10}>
            <Form.Control
              placeholder="輸入LineID"
              type="text"
              onChange={(event) => {
                setInputID(event.target.value);
              }}
              value={inputID}
            ></Form.Control>
          </Col>
          <Col sm={12} md={2}>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                AddId();
              }}
            >
              送出
            </Button>
          </Col>
        </Row>
        <br />
        <p>如何查詢 Line ID ?</p>
        <div>
          <p >
            1. 依序點選「主頁」＞「設定」＞「個人檔案」
          </p>
          <p >
            2. 「ID」的欄位內將顯示已設定完成的LINE ID
          </p>
        </div>
      </div>
    </>
  );



  return (
    <>
      <div>
        <Container fluid className="wrap-request">
          <Card>
            <Card.Body>
              {!lineID ? NoContainLineId() : ContainLineId()}
              <hr />
              <div>
                <p>Line 提醒功能</p>
                <p
                  className="pt-0 mr-auto"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <span style={{ wordBreak: "keep-all" }}>
                  
                    每天將會定時推播
                  </span>
                  <span style={{ wordBreak: "keep-all", color: "red" }}>
                    使用金額
                  </span>
                  <span style={{ wordBreak: "keep-all" }}>及</span>
                  <span style={{ wordBreak: "keep-all", color: "red" }}>
                    比較差異
                  </span>
                </p>
                <img
                  alt="..."
                  src={LineDemo}
                  style={{ height: "500px", width: "300px" }}
                />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import {
  BrowserRouter as Rouer,
  useLocation,
  useHistory,
} from "react-router-dom";
import axios from "axios";

// Redux
import { useSelector } from "react-redux";
import { selectUser } from "ReduxStore/slice/userSlice";

export default function CreateServiceSupport() {
  const history = useHistory(); //轉址用

  // 從登入後取得的User權限資訊--TenantID、Group、CompanyOrgId
  const TenantID_Group = useSelector(selectUser);
  let CompanyOrgId = TenantID_Group.userInfo.CompanyOrgId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    `聯絡信箱:
其他通知電子郵件:(若有多人請用;隔開)
聯絡人:
聯絡人電話:
問題描述:`);

  const [urgencyList, setUrgencyList] = useState([
    { property: 1, val: "A-重大影響" },
    { property: 3, val: "B-中度影響" },
    { property: 4, val: "C-最小影響" },
    // { property: 2, val: "高" },
  ]);
  const [SelectUrgency, setSelectUrgency] = useState(4);

  //問題分類第一層選項
  const [ServiceList, setServiceList] = useState([]);
  //選擇的第一層問題分類
  const [SelectService, setSelectService] = useState(null);

  //問題分類第二層選項
  const [SubServiceList, setSubServiceList] = useState([]);
  //選擇的第二層問題分類
  const [SelectSubService, setSelectSubService] = useState(null);

  // 防止二次觸發送出Ticket
  const [DisableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    GetServiceList();
  }, [Rouer]);

  useEffect(() => {
    console.log("SelectService變", SelectService, SelectService ? true : false);
    if (SelectService) {
      console.log("SelectService撈");
      GetSubServiceList();
    }
  }, [SelectService]);

  //取得第一層問題分類
  const GetServiceList = async () => {
    let res = await axios
      .get("https://api.metaage.pro/api/ITOPTicketing/GetService")
      .catch((err) => {
        alert("取得第一層問題分類發生錯誤");
        console.log(err.response.data);
      });
    console.log(res);
    if (res.status == 200) {
      setServiceList(res.data);
      // 預設選第一個
      setSelectService(res.data[0].id);
    } else {
      alert("取得第一層問題分類發生錯誤");
    }
  };

  //取得第二層問題分類
  const GetSubServiceList = async () => {
    let res = await axios
      .get(
        `https://api.metaage.pro/api/ITOPTicketing/GetServiceSubcategory?QueryServiceID=${SelectService}`
      )
      .catch((err) => {
        alert("取得第二層問題分類發生錯誤");
        console.log(err.response.data);
        // 沒資料就清除陣列避免亂選
        setSubServiceList([]);
        setSelectSubService(null);
      });
    console.log(res);
    if (res.status == 200) {
      setSubServiceList(res.data);
      // 預設選第一個
      setSelectSubService(res.data[0].id);
    } else {
      alert("取得第二層問題分類發生錯誤");
      // 沒資料就清除陣列避免亂選
      setSubServiceList([]);
      setSelectSubService(null);
    }
  };

  const submitTicket = async () => {
    setDisableSubmit(true)
    console.log(
      "title",
      title,
      "description",
      description,
      "SelectUrgency",
      SelectUrgency,
      "SelectService",
      SelectService,
      "SelectSubService",
      SelectSubService
    );
    if (!CompanyOrgId) {
      alert("組織代號發生錯誤，無法送出請求");
      return null;
    } else if (!title.trim()) {
      alert("標題為必填");
      setDisableSubmit(false);
      return null;
    } else if (!description.trim()) {
      alert("描述為必填");
      setDisableSubmit(false);
      return null;
    } else if (!SelectUrgency) {
      alert("迫切性為必選");
      setDisableSubmit(false);
      return null;
    } else if (!SelectService) {
      alert("分類為必選");
      setDisableSubmit(false);
      return null;
    } else if (!SelectSubService) {
      alert("子分類為必選");
      setDisableSubmit(false);
      return null;
    }
    console.log("送出");
    let ticketObj = {
      org_id: CompanyOrgId,
      title,
      description,
      urgency: SelectUrgency,
      service_id: SelectService,
      servicesubcategory_id: SelectSubService,
    };
    let res = await axios
      .post(`https://api.metaage.pro/api/ITOPTicketing/CreateTicket`, ticketObj)
      .catch((err) => {
        console.log("送出請求發生錯誤，請檢查問題描述是否有特殊符號，提供給Mataage。");
        setDisableSubmit(false);
        console.log(err.response.data);
      });
    console.log(res);
    setDisableSubmit(false);
    if (res.data.code == 0) {
      alert("成功送出請求!");
      history.push(`/admin/iTopServiceList`);
    }else{
      alert('請求發生錯誤')
    }
    
  };

  return (
    <Container fluid className="wrap-request">
      <Card>
        <Card.Header>
          <Card.Title as="h4">服務請求</Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md="6" xs="12">
              <Form.Group>
                <label>標題</label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="輸入標題"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md="6" xs="12">
              <Form.Group>
                <label>迫切性</label>
                <select
                  style={{
                    display: "block",
                    border: "solid 1px #E3E3E3",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    width: "100%",
                  }}
                  value={SelectUrgency}
                  onChange={(e) => setSelectUrgency(e.target.value)}
                >
                  {urgencyList.map((urgency) => (
                    <option value={urgency.property} key={urgency.property}>
                      {urgency.val}
                    </option>
                  ))}
                </select>
              </Form.Group>
            </Col>
            <Col md="6" xs="12">
              <Form.Group>
                <label>分類</label>
                <select
                  style={{
                    display: "block",
                    border: "solid 1px #E3E3E3",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    width: "100%",
                  }}
                  value={SelectService}
                  onChange={(e) => setSelectService(e.target.value)}
                >
                  {ServiceList.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
            </Col>
            <Col md="6" xs="12">
              <Form.Group>
                <label>子分類</label>
                <select
                  style={{
                    display: "block",
                    border: "solid 1px #E3E3E3",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    width: "100%",
                  }}
                  value={SelectSubService}
                  onChange={(e) => setSelectSubService(e.target.value)}
                >
                  {SubServiceList.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
            </Col>

            <Col xs="12">
              <Form.Group>
                <label>描述</label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {/* <textarea
                  className="d-block w-100 p-1 border rounded"
                  placeholder="輸入描述"
                  style={{ resize: "none", minHeight: "120px" }}
                ></textarea> */}
              </Form.Group>
            </Col>
            {/* <Col xs="12">
              <Form.Group>
                <label>Log</label>
                <Form.Control as="textarea" rows={6} />
                <textarea
                  className="d-block w-100 p-1 border rounded"
                  placeholder="輸入Log"
                  style={{ resize: "none", minHeight: "120px" }}
                ></textarea>
              </Form.Group>
            </Col> */}
            {/* <Col xs="12">
              <Form.Group controlId="formFile">
                <label>上傳圖片</label>
                <Form.Control type="file" className="border rounded p-2" />
              </Form.Group>
            </Col> */}
          </Row>
          <Row className="justify-content-end mt-3 mx-2">
            <Button
              className="btn-wd mr-1"
              type="button"
              variant="primary"
              style={ DisableSubmit ? {'backgroundColor':'#447DF7'}: {}}
              onClick={() => submitTicket()}
              disabled={DisableSubmit ? true:false}
            >
              {DisableSubmit ? '傳送中' : '送出'}
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

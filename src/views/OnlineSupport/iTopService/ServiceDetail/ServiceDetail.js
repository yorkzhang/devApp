import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Table,
  TabContent,
  TabPane,
} from "react-bootstrap";
import axios from "axios";
import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
} from "react-router-dom";
import "./_servicedetail.scss";

// Redux
import { useSelector } from "react-redux";
import { selectUser } from "ReduxStore/slice/userSlice";

export default function ServiceDetail() {
  const history = useHistory(); //轉址用
  // 從登入後取得的User權限資訊--TenantID、Group、CompanyOrgId
  const TenantID_Group = useSelector(selectUser);
  let company_OrgId = TenantID_Group.userInfo.CompanyOrgId;
  let company_UserID = TenantID_Group.userInfo.CompanyUserID;
  const location = useLocation(); //取網址用
  const [ticketRef, setTicketRef] = useState(
    location.pathname.split("/").pop()
  ); //Ticket編號

  const [ticket, setTicket] = useState();
  const [publicLog, setPublicLog] = useState();
  const [CompanyOrgId, setCompanyOrgId] = useState(null);
  const [CompanyUserID, setCompanyUserID] = useState(null);
  const [AttachmentID, setAttachmentID] = useState(''); // Ticket Key
  const [Attachment, setAttachment] = useState([]); //所有附件

  const [CreateStatus, setCreateStatus] = useState(false);//新增附件Loading是否顯示
  const [FetchStatus, setFetchStatus] = useState(true);//取得附件Loading是否顯示
  const [DeleteAttachmentID, setDeleteAttachmentID] = useState('');//刪除附件存ID判斷是否刪除成功

  const hiddenFileInput = React.useRef(null); //要上傳檔案的input:file

  useEffect(() => {
    setCompanyOrgId(company_OrgId);
    setCompanyUserID(company_UserID);
    console.log("company_UserID", company_UserID);
  }, [company_OrgId, company_UserID]);

  useEffect(() => {
    if (!ticketRef) {
      alert("Ticket編號取得錯誤");
      return null;
    }
    if (ticketRef && CompanyOrgId) {
      GetiTopTicket();
    }
  }, [Router, CompanyOrgId]);

  useEffect(() => {
    GetAttachment()
  }, [AttachmentID])

  // 撈iTop Ticket資料
  const GetiTopTicket = async () => {
    if (!CompanyOrgId) {
      alert("組織代號發生錯誤，無法送出回應");
      return null;
    }
    let res = await axios
      .post(`https://api.metaage.pro/api/ITOPTicketing/GetUserRequest`, {
        org_id: CompanyOrgId,
        UserRequest: ticketRef,
      })
      .catch((err) => {
        alert("Ticket取得錯誤");
        history.push("/");
      });
    console.log(res);
    if (res.data.success) {
      setTicket(res.data.res[0]);
      setAttachmentID(res.data.res[0].key)
    }
  };

  // 撈iTop Ticket附件
  const GetAttachment = async () => {
    if (!AttachmentID) {
      return null;
    }

    setFetchStatus(true)
    let AttachmentRes = await axios.post('https://api.metaage.pro/api/ITOPTicketing/GetAttached', {
      ticketid: AttachmentID
    }).catch(err => {
      StopAllAttachmentStatus()
      console.log("Ticket 附件取得錯誤");
    })
    StopAllAttachmentStatus()
    console.log('AttachmentRes', AttachmentRes);
    if (AttachmentRes.data.success) {
      let tempArr = [];
      AttachmentRes.data.res.forEach(item => {
        if (item.fields && item.fields.contents) {
          item.fields.contents.key = item.key
          tempArr.push(item.fields.contents)
        }
      })
      setAttachment(tempArr)
    }
  }

  // Ticket狀態中文
  const TranslateStatus = (status) => {
    switch (status) {
      case "ongoing":
        return "處理中";
      case "resolved":
        return "已解決";
      case "closed":
        return "已關閉";
      default:
        return "無資訊";
    }
  };

  // 送出public_log
  const SendPublicLog = async () => {
    if (!CompanyOrgId) {
      alert("組織代號發生錯誤，無法送出回應");
      return null;
    }
    let res = await axios
      .post("https://api.metaage.pro/api/ITOPTicketing/CreatePublicLog", {
        ref: ticketRef,
        message: `<p>${publicLog.replace(/\r?\n/g, "<br />")}</p>`,
        org_id: CompanyOrgId,
      })
      .catch((err) => {
        console.log(err.response.data);
        alert("訊息發送錯誤");
      });
    console.log(res);
    if (res.data.code == 0) {
      setPublicLog("");
      GetiTopTicket();
    }
  };

  //點擊「上傳附件」按鈕，觸發input:file
  const handleUpload = () => {
    hiddenFileInput.current.click();
  };

  //取得上傳附件並判斷檔案大小
  const handleChange = e => {
    if (!AttachmentID) { //沒有ticket key
      return null;
    }
    console.log('上傳檔案');
    const file = e.target.files[0];
    console.log('檔案詳情', file);
    const fileName = file.name; //檔名
    let filesize = Math.round(file.size / 1024);
    console.log("檔案大小", filesize);
    if (filesize > 2048) {
      alert("檔案過大");
      return null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let base64data = reader.result.replace("data:", "").replace(/^.+,/, "");
      console.log(base64data);
      UploadAttachment(AttachmentID, CompanyOrgId, fileName, base64data)
    };
  };

  //上傳附件
  const UploadAttachment = async (key, orgId, filename, base64) => {

    console.log(key, orgId, filename, base64);
    setCreateStatus(true);
    let res = await axios.post('https://api.metaage.pro/api/ITOPTicketing/CreateAttached', {
      item_id: key,
      item_org_id: orgId,
      data: base64,
      filename: filename
    }).catch(err => {
      setCreateStatus(false);
      alert('附件上傳失敗')
    })
    console.log('上傳回傳', res);

    if (res.data.code == 0) {
      GetAttachment()
    } else {
      alert('附件上傳發生錯誤')
    }
  }

  //刪除檔案
  const deleteFile = async (id) => {
    // console.log('delete id:',id);
    setDeleteAttachmentID(id)
    let res = await axios.post('https://api.metaage.pro/api/ITOPTicketing/DeleteAttached', {
      Attachmentid: id
    }).catch(err => {
      setDeleteAttachmentID('')
      alert('附件刪除發生錯誤!')
    })
    console.log('delete res:', res);
    if (res.data.code == 0) {
      GetAttachment()
    } else {
      alert('附件刪除發生錯誤')
    }
  }
  
  
  //附件上傳與刪除與撈取狀態都設為停止
  const StopAllAttachmentStatus = () =>{
        setFetchStatus(false)
        setCreateStatus(false);
        setDeleteAttachmentID('')
  }

  return (
    <>
      <Container fluid className="wrap-request">
        <Row>
          <Col md="12">
            <Form
              action=""
              className="form-horizontal"
              id="TypeValidation"
              method=""
            >
              <Card>
                <Card.Header>
                  <Card.Title as="h4">服務詳情</Card.Title>
                </Card.Header>
                <hr />
                <Card.Body>
                  {ticket && ticket.fields ? (
                    <>
                      {" "}
                      <Row>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            編號<span className="star"></span>
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.ref}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            公司名稱
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.org_name}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            標題
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.title}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            狀態
                          </h5>
                          <Col sm="12" className="">
                            {TranslateStatus(ticket.fields.operational_status)}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            開始時間
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.start_date}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            結束時間<span className="star"></span>
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.end_date}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            最後更新
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.last_update}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            問題類別
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.service_name}
                          </Col>
                        </Col>
                        <Col sm="12" md="6" xl="4" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            問題子類別
                          </h5>
                          <Col sm="12" className="">
                            {ticket.fields.servicesubcategory_name}
                          </Col>
                        </Col>

                        <Col sm="12" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            問題描述
                          </h5>
                          <Col sm="12" className="border p-2">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: ticket.fields.description,
                              }}
                            ></p>
                          </Col>
                        </Col>

                        <Col sm="12" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            動態消息
                          </h5>
                          <Col
                            sm="12"
                            className="border p-3 public_log_container"
                          >
                            {ticket.fields.public_log &&
                              ticket.fields.public_log.entries.length > 0
                              ? ticket.fields.public_log.entries.map(
                                (item, idx) => {
                                  return (
                                    <div className="PublicLogModal" key={idx}>
                                      <p
                                        className="username"
                                        style={{
                                          textAlign:
                                            CompanyUserID == item.user_id
                                              ? "right"
                                              : "left",
                                        }}
                                      >
                                        {item.user_login}
                                      </p>
                                      <div
                                        className="msgContainer"
                                        style={{
                                          margin:
                                            CompanyUserID == item.user_id
                                              ? "5px 0 5px auto"
                                              : "5px auto 5px 0",
                                        }}
                                      >
                                        <p
                                          className="msg"
                                          dangerouslySetInnerHTML={{
                                            __html: item.message_html,
                                          }}
                                        ></p>
                                        <p
                                          className="date"
                                          style={{
                                            textAlign:
                                              CompanyUserID == item.user_id
                                                ? "left"
                                                : "right",
                                          }}
                                        >
                                          {item.date}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )
                              : null}
                          </Col>
                        </Col>
                        {ticket &&
                          ticket.fields &&
                          (ticket.fields.operational_status == "resolved" ||
                            ticket.fields.operational_status ==
                            "closed") ? null : (
                          <Col sm="12" className="mb-4">
                            <h5 sm="12" className="text-secondary my-0 mb-2">
                              發送動態訊息
                            </h5>
                            <Form.Group>
                              <Form.Control
                                placeholder="輸入訊息"
                                type="text"
                                as="textarea"
                                rows={3}
                                onChange={(e) => {
                                  setPublicLog(e.target.value);
                                }}
                                value={publicLog}
                              ></Form.Control>
                              <Button
                                onClick={() => {
                                  SendPublicLog();
                                }}
                                className="my-1 w-100 "
                                variant="danger"
                                as="input"
                                type="button"
                                value="送出"
                              />
                            </Form.Group>
                          </Col>
                        )}

                        <Col sm="12" className="mb-4">
                          <h5 sm="12" className="text-secondary my-0 mb-2">
                            附件管理
                          </h5>
                          {
                            Attachment && Attachment.length > 0 ? (
                              <Table className="table-hover">
                                <tbody>
                                  {
                                    Attachment ?
                                      Attachment.map((item, idx) => (
                                        <tr key={idx}>
                                          <td >
                                            <a className="attachmentLink" download={item.filename} href={`data:${item.mimetype};base64,${item.data}`}>{item.filename}</a>
                                          </td>
                                          <td className="text-right">
                                            {
                                              DeleteAttachmentID == item.key ?(
                                                <Button disabled variant="default" className="mr-0 ml-auto  d-flex align-items-center btn-outline">
                                                  <span>移除中</span>
                                                </Button>
                                              ):(
                                                <Button onClick={() => window.confirm(`確定刪除${item.filename}?`) ? deleteFile(item.key) : null } variant="default" className="mr-0 ml-auto  d-flex align-items-center btn-outline">
                                                  <i className="nc-icon nc-simple-remove  "></i> 
                                                  <span>移除</span>
                                                </Button>
                                              )
                                            }
                                            
                                          </td>
                                        </tr>
                                      )) : null
                                  }

                                </tbody>
                              </Table>) : null}
                          {
                            FetchStatus ? (<p className="text-center " style={{color:'#FB404B'}}>附件取得中..</p>) : null
                          }
                          {
                            CreateStatus ? (<div >
                              <Button
                                style={{ display: 'block', width: '100%' }}
                                className=" btn-wd btn-outline "
                                type="button"
                                variant="default"
                                onClick={handleUpload}
                                disabled
                              >
                                <span className="btn-label">
                                上傳中...
                                </span>
                              </Button>
                            </div>) : (<div >
                              <input type='file' className="d-none" ref={hiddenFileInput}
                                onChange={handleChange} />
                              <Button
                                style={{ display: 'block', width: '100%' }}
                                className=" btn-wd btn-outline "
                                type="button"
                                variant="danger"
                                onClick={handleUpload}
                              >
                                <span className="btn-label">
                                上傳附件
                                </span>
                              </Button>
                            </div>
                            )
                          }

                        </Col>


                      </Row>
                    </>
                  ) : null}

                </Card.Body>
                <Card.Footer className="text-center">
                  {/* <Button
                    style={{ backgroundColor: "primary" }}
                    onClick={() => {
                      if (!typeRequiredState || !isRequired(typeRequired)) {
                        setTypeRequiredState(false);
                      } else {
                        setTypeRequiredState(true);
                      }
                      if (!typeNameState || !isRequired(typeName)) {
                        setTypeNameState(false);
                      } else {
                        setTypeNameState(true);
                      }
                      if (!typeEmailState || !emailValidation(typeEmail)) {
                        setTypeEmailState(false);
                      } else {
                        setTypeEmailState(true);
                      }
                      if (
                        typeNameState &&
                        typeEmailState &&
                        !isRequired(typeName) === false &&
                        !emailValidation(typeEmail) === false
                      ) {
                        sendMail();
                        autoCloseAlert();
                      }
                    }}
                  >
                    送出
                  </Button> */}
                </Card.Footer>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

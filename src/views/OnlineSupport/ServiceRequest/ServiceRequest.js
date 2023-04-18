import React from 'react'
import './_servicerequest.scss'
// react-bootstrap components
import {
    Button,
    Card,
    Form,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from 'axios'

// validators
const emailValidation = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test( value );
const isRequired = (value) => value !== null && value !== "" && value;
const isNumber = (value) => !isNaN(value) && value !== "";
const ServiceRequest = () =>{
    const [typeRequired, setTypeRequired] = React.useState("");
    const [typeRequiredState, setTypeRequiredState] = React.useState(true);
    const [identifySelect, setIdentifySelect] = React.useState("");
    const [taxId, setTaxId] = React.useState("");
    const [typeName, setTypeName] = React.useState("");
    const [typeNameState, setTypeNameState] = React.useState(true);
    const [typeCompany, setTypeCompany] = React.useState("");
    const [typeNumber, setTypeNumber] = React.useState("");
    const [typeNumberState, setTypeNumberState] = React.useState(true);
    const [typeSubNumber, setTypeSubNumber] = React.useState("");
    const [typeMobileNumber, setTypeMobileNumber] = React.useState("");
    const [typeMobileNumberState, setTypeMobileNumberState] = React.useState(true);
    const [typeEmail, setTypeEmail] = React.useState("");
    const [typeEmailState, setTypeEmailState] = React.useState(true);
    const [categorySelect, setCategorySelect] = React.useState("");
    const [typeMessage, setTypeMessage] = React.useState("");
    const [alert, setAlert] = React.useState(null);
    
    // 收集要送出的資料
    let data = {
        "CompanyType":identifySelect.value,
        "CompanyName":typeCompany,
        "CompanyAccount":taxId,
        "CompanyEmail":typeEmail,
        "UserName":typeName,
        "CompanyTel":typeNumber,
        "CompanyExt":typeSubNumber,
        "CompanyMob":typeMobileNumber,
        "OptionName":categorySelect.value,
        "OptionContent":typeMessage
    }

    // POST
    function sendMail(){
        axios.post('https://api.metaage.pro/api/Ticket', data)
        .then(res => {
            return res;
        });
    }

    // 送出後的通知視窗
    const autoCloseAlert = () => {
        setAlert(
        <SweetAlert
            style={{ display: "block", marginTop: "-100px" }}
            onConfirm={() => hideAlert()}
            showConfirm={false}
        >
            <h4>資料已送出</h4>
        </SweetAlert>
        );
        setTimeout(() => {
        setAlert(null);
        }, 1000);
    };

    return (
        <>
        {alert}
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
                            <Card.Title as="h4">服務請求</Card.Title>
                            </Card.Header>
                            <Card.Body>
                            
                            {/* 身分別、公司統編 */}
                            <Row>
                                <Col>
                                    <Form.Label column sm="12">
                                    身分別
                                    </Form.Label>
                                    <Col sm="12">
                                        <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            name="identifySelect"
                                            value={identifySelect}
                                            onChange={(value) => setIdentifySelect(value)}
                                            options={[
                                                { value: "company", label: "公司" },
                                                { value: "personal", label: "個人" },
                                            ]}
                                            placeholder="請選擇..."
                                        />
                                    </Col>
                                </Col>
                                <Col>
                                    <Form.Label column sm="12">
                                        公司統編
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={
                                            typeNumberState ? "has-success" : "has-error"
                                            }
                                        >
                                            <Form.Control
                                            name="number"
                                            type="text"
                                            value={taxId}
                                            onChange={(e) => {
                                                setTaxId(e.target.value);
                                            }}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>
                            
                            {/* 聯絡姓名、公司名稱 */}
                            <Row>
                                <Col>
                                    <Form.Label column sm="12">
                                    聯絡姓名<span className="star">*</span>
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={
                                            typeNameState ? "has-success" : "has-error"
                                            }
                                        >
                                            <Form.Control
                                            name="required"
                                            type="text"
                                            value={typeName}
                                            onChange={(e) => {
                                                setTypeName(e.target.value);
                                                if (isRequired(e.target.value)) {
                                                setTypeNameState(true);
                                                } else {
                                                setTypeNameState(false);
                                                }
                                            }}
                                            ></Form.Control>
                                            {typeNameState ? null : (
                                            <label className="error">
                                                This field is required.
                                            </label>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Col>
                                <Col>
                                    <Form.Label column sm="12">
                                    公司名稱
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={"has-success"}
                                        >
                                            <Form.Control
                                            name="required"
                                            type="text"
                                            value={typeCompany}
                                            onChange={(e) => {
                                                setTypeCompany(e.target.value);
                                            }}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>
                            {/* 電話號碼、分機 */}
                            <Row>
                                <Col>
                                    <Form.Label column sm="12">
                                    電話號碼
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={
                                            typeNumberState ? "has-success" : "has-error"
                                            }
                                        >
                                            <Form.Control
                                            name="number"
                                            type="text"
                                            value={typeNumber}
                                            onChange={(e) => {
                                                setTypeNumber(e.target.value);
                                                if (e.target.value !== null && isNumber(e.target.value)) {
                                                setTypeNumberState(true);
                                                } else {
                                                setTypeNumberState(false);
                                                }
                                            }}
                                            ></Form.Control>
                                            {typeNumberState ? null : (
                                            <label className="error">
                                                This field is required to be a number.
                                            </label>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Col>
                                
                                <Col>
                                    <Form.Label column sm="12">
                                    分機
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={"has-success"}
                                        >
                                            <Form.Control
                                            name="required"
                                            type="text"
                                            value={typeSubNumber}
                                            onChange={(e) => {
                                                setTypeSubNumber(e.target.value);
                                            }}
                                            ></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>
                            
                            {/* 手機號碼、Email */}
                            <Row>
                                <Col>
                                    <Form.Label column sm="12">
                                    手機號碼
                                    </Form.Label>

                                    <Col sm="12">
                                        <Form.Group
                                            className={
                                            typeMobileNumberState ? "has-success" : "has-error"
                                            }
                                        >
                                            <Form.Control
                                            name="number"
                                            type="text"
                                            value={typeMobileNumber}
                                            onChange={(e) => {
                                                setTypeMobileNumber(e.target.value);
                                                if (e.target.value !== null && isNumber(e.target.value)) {
                                                setTypeMobileNumberState(true);
                                                } else {
                                                setTypeMobileNumberState(false);
                                                }
                                            }}
                                            ></Form.Control>
                                            {typeMobileNumberState ? null : (
                                            <label className="error">
                                                This field is required to be a number.
                                            </label>
                                            )}
                                            
                                        </Form.Group>
                                    </Col>
                                </Col>
                                <Col>
                                    <Form.Label column sm="12">
                                    Email<span className="star">*</span>
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Group
                                            className={typeEmailState ? "has-success" : "has-error"}
                                        >
                                            <Form.Control
                                            name="email"
                                            type="text"
                                            value={typeEmail}
                                            onChange={(e) => {
                                                setTypeEmail(e.target.value);
                                                if (emailValidation(e.target.value)) {
                                                setTypeEmailState(true);
                                                } else {
                                                setTypeEmailState(false);
                                                }
                                            }}
                                            ></Form.Control>
                                            {typeEmailState ? null : (
                                            <label className="error">
                                                This field is required to be an email.
                                            </label>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>
                            {/* 問題類別 */}
                            <Row>
                                <Col md="12">
                                    <Form.Label column sm="12">
                                        問題類別
                                    </Form.Label>
                                    <Col md="12">
                                        <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            name="categorySelect"
                                            value={categorySelect}
                                            onChange={(value) => setCategorySelect(value)}
                                            options={[
                                                { value: "bill", label: "帳單" },
                                                { value: "tech", label: "技術" },
                                                { value: "limit", label: "服務與訂用帳戶限制" },
                                            ]}
                                            placeholder="請選擇分類"
                                            
                                        />
                                    </Col>
                                </Col>
                            </Row>
                            {/* 問題描述 */}
                            <Row>
                                <Col md="12">
                                    <Form.Label column sm="12">
                                        問題描述
                                    </Form.Label>
                                    <Col md="12">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3}
                                                type = 'text'
                                                name="message"
                                                value={typeMessage} 
                                                onChange={(e) => setTypeMessage(e.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                </Col>
                            </Row>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button
                                    style={{backgroundColor:'primary'}}
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
                                    if ( typeNameState && typeEmailState && !isRequired(typeName)=== false && !emailValidation(typeEmail)=== false){
                                        sendMail();
                                        autoCloseAlert()
                                    }
                                    }}
                                >
                                    送出
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default ServiceRequest
import React, { useEffect, useState } from 'react'
// react-bootstrap components
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
    Table
} from "react-bootstrap";
import axios from 'axios'
import ReactTable from "components/ReactTable/ReactTable.js";

const RoleAuth = (props) =>{

    // 取得User權限資訊
    const OpenID = props.openId
    const [getUser, setGetUser] = useState(false)
    const [userGroup, setUserGroup] = useState()
    const [customerTenantId, setCustomerTenantId] = useState()
    useEffect(()=>{
        const GetUser = async() =>{
            let res = await axios.get(`https://api.metaage.pro/api/User/${OpenID}`).catch((err)=>{console.log(err)});
            setCustomerTenantId(res.data[0].userCompanyID === "2e4706cc-0eea-4478-8bc8-c2d26cb8ef7f"? "cdfb1bbe-3e20-455f-90c1-c2d26cb8ef7f": res.data[0].userCompanyID)
            setUserGroup(res.data[0].groupName==="SuperGromp"? "SuperGroup": res.data[0].groupName)
        }

        if(props.openId){
            GetUser()
        }

    },[props.openId])

    // 透過User資訊進一步取得各欄位資訊
    let _dataSet = []
    let _restdataSet = []
    const [data, setData] = useState()
    const [restData, setRestData] = useState()
    useEffect(()=>{
        axios.get(`https://api.metaage.pro/api/azureusers?QureyCustomerTenantId=${customerTenantId}&UserGroup=${userGroup}`)
        // axios.get(`https://api.metaage.pro/api/azureusers?QureyCustomerTenantId=fc1cfcaa-b666-4331-b996-fe54793c36cc&UserGroup=x`)
        .then((res)=>{
            res.data.map((res)=>{
                _dataSet.push([
                    res.tenantId,
                    res.businessPhones,
                    res.displayName,
                    res.givenName,
                    res.jobTitle,
                    res.mail,
                    res.mobilePhone,
                    res.officeLocation,
                    res.preferredLanguage,
                    res.surname,
                    res.tenantName
                ])
            })
            setData(_dataSet.map((prop, key) => {
                return {
                    id: key,
                    tenantId: prop[0],
                    businessPhones: prop[1],
                    displayName: prop[2],
                    givenName: prop[3],
                    jobTitle: prop[4],
                    mail: prop[5],
                    mobilePhone: prop[6],
                    officeLocation: prop[7],
                    preferredLanguage: prop[8],
                    surname: prop[9],
                    tenantName: prop[10],
                    actions: (
                        <div className="actions-right">
                            <Button
                                onClick={() => {
                                    let obj = data.find((o) => o.id === key);
                                }}
                                variant="info"
                                size="sm"
                                className="text-info btn-link like"
                            >
                                <i className="fa fa-heart" />
                            </Button>{" "}
                            <Button
                                onClick={() => {
                                    let obj = data.find((o) => o.id === key);
                                }}
                                variant="warning"
                                size="sm"
                                className="text-warning btn-link edit"
                            >
                                <i className="fa fa-edit" />
                            </Button>{" "}
                        </div>
                    ),
                };
            }))
            setRestData(_restdataSet.map((prop, key) => {
                return {
                    id: key,
                    subscriptionName: prop,
                }
            }))
        })
        .catch((err)=>{console.log("err :", err)})
    },[userGroup])

    return(
        <>
        <Container fluid>
        <Row>
            <Col md="12">
                
                <Card>
                    <Card.Header>使用者權限管理</Card.Header>
                    
                    <Card.Body>
                        <Row md="12">
                        </Row>
                        {data
                        ?
                            <ReactTable
                                restData={restData}
                                data={data}
                                columns={[
                                {
                                    Header: "訂閱名稱",
                                    accessor: "tenantName",
                                },
                                // {
                                //     Header: "時間月份",
                                //     accessor: "tenantId",
                                // },
                                {
                                    Header: "電話",
                                    accessor: "businessPhones",
                                },
                                {
                                    Header: "名稱",
                                    accessor: "displayName",
                                },
                                {
                                    Header: "姓",
                                    accessor: "surname",
                                },
                                {
                                    Header: "指定名稱",
                                    accessor: "givenName",
                                },
                                {
                                    Header: "職稱",
                                    accessor: "jobTitle",
                                },
                                {
                                    Header: "信箱",
                                    accessor: "mail",
                                },
                                {
                                    Header: "行動電話",
                                    accessor: "mobilePhone",
                                },
                                {
                                    Header: "辦公地點",
                                    accessor: "officeLocation",
                                },
                                {
                                    Header: "語言",
                                    accessor: "preferredLanguage",
                                },
                                
                                
                                // {
                                //     Header: "金額(TWD)",
                                //     accessor: "cost",
                                //     sortable: false,
                                //     filterable: false,
                                // },
                                ]}
                                className="-striped -highlight primary-pagination"
                            />
                        :null
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </Container>
        </>
    )
}

export default RoleAuth
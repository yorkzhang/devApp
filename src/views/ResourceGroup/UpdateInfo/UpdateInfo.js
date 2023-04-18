import React, { useEffect, useState } from 'react'
// react-bootstrap components
import { Button, Card, Container, Row, Col, } from "react-bootstrap";
import axios from 'axios'
import ReactTable from "components/ReactTable/ReactTable.js";

const RGUpdateInfo = (props) =>{

    // 取得User權限資訊
    const OpenID = props.openId
    const [getUser, setGetUser] = useState(false)
    const [userGroup, setUserGroup] = useState()
    const [customerTenantId, setCustomerTenantId] = useState()
    useEffect(()=>{
        // console.log('props.openId',props.openId);

        const GetUser = async() =>{
            let res = await axios.get(`https://api.metaage.pro/api/User/${OpenID}`).catch((err)=>{console.log(err)});
            setCustomerTenantId(res.data[0].userCompanyID === "2e4706cc-0eea-4478-8bc8-c2d26cb8ef7f"? "cdfb1bbe-3e20-455f-90c1-c2d26cb8ef7f": res.data[0].userCompanyID)
            setUserGroup(res.data[0].groupName==="SuperGromp"? "SuperGroup": res.data[0].groupName)
        }

        if(props.openId){
            GetUser()
        }

    },[props.openId])

    // 進入畫面後，無法接收api，則再次render
    useEffect(()=>{
        if(userGroup === undefined){
            console.log("userGroup is undefined")
        }
    },[userGroup])

    // 透過User權限資訊，取得群組資訊
    let _dataSet = []
    let _restdataSet = []
    const [data, setData] = useState()
    const [restData, setRestData] = useState()
    useEffect(()=>{
        axios.get(`https://api.metaage.pro/api/azuregroup?QureyCustomerTenantId=${customerTenantId}&UserGroup=${userGroup}`)
        // axios.get(`https://api.metaage.pro/api/azuregroup?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f&UserGroup=x`)
        .then((res)=>{
            res.data.map((res)=>{
                _dataSet.push([
                    res.description,
                    res.displayName,
                    res.groupTypes,
                    res.mailEnabled,
                    res.mailNickname,
                    res.securityEnabled,
                    res.tenantName
                ])
            })
            setData(_dataSet.map((prop, key) => {
                return {
                    id: key,
                    description: prop[0],
                    displayName: prop[1],
                    groupTypes: prop[2],
                    mailEnabled: prop[3],
                    mailNickname: prop[4],
                    securityEnabled: prop[5],
                    tenantName: prop[6],
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
                    <Card.Header>群組管理與統計</Card.Header>
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
                                    {
                                        Header: "群組描述",
                                        accessor: "description",
                                    },
                                    {
                                        Header: "群組名稱",
                                        accessor: "displayName",
                                    },
                                    {
                                        Header: "群組類型",
                                        accessor: "groupTypes",
                                    },
                                    {
                                        Header: "郵件啟用",
                                        accessor: "mailEnabled",
                                    },
                                    {
                                        Header: "郵件暱稱",
                                        accessor: "mailNickname",
                                    },
                                    {
                                        Header: "安全性",
                                        accessor: "securityEnabled",
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

export default RGUpdateInfo
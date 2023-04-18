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

const ServiceStorage = (props) =>{
    // 取得User權限資訊
    const OpenID = props.openId
    const [getUser, setGetUser] = useState(false)
    const [userGroup, setUserGroup] = useState()
    const [customerTenantId, setCustomerTenantId] = useState()
    useEffect(()=>{
        if(OpenID){
            axios.get(`https://api.metaage.pro/api/User/${OpenID}`)
            .then((res)=>{
                setCustomerTenantId(res.data[0].userCompanyID === "2e4706cc-0eea-4478-8bc8-c2d26cb8ef7f"? "cdfb1bbe-3e20-455f-90c1-c2d26cb8ef7f": res.data[0].userCompanyID)
                setUserGroup(res.data[0].groupName==="SuperGromp"? "SuperGroup": res.data[0].groupName)
            })
            .catch((err)=>{console.log(err)})
        }
    },[OpenID, getUser])

    // 收集表單所需資料
    let _dataSet = []
    let _restdataSet = []
    const [data, setData] = useState()
    const [restData, setRestData] = useState()
    useEffect(()=>{
        if(customerTenantId){
            // axios.get(`https://api.metaage.pro/api/AzureBlobStorage?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f`)
            axios.get(`https://api.metaage.pro/api/AzureBlobStorage?QureyCustomerTenantId=${customerTenantId}`)
            .then((res)=>{
                res.data.map((res)=>{
                    _dataSet.push([
                        res.tenantName,
                        res.resourceGroup,
                        res.name,
                        res.location,
                        res.encryptionServicesBlobEnabled,
                        res.accessTier,
                        res.provisioningState,
                        res.primaryEndpointsBlob,
                        res.createDate.split('T')[0],
                        res.capacity,
                    ])
                })
                setData(_dataSet.map((prop, key) => {
                    return {
                        id: key,
                        tenantName: prop[0],
                        resourceGroup: prop[1],
                        name: prop[2],
                        location: prop[3],
                        encryptionServicesBlobEnabled: prop[4],
                        accessTier: prop[5],
                        provisioningState: prop[6],
                        primaryEndpointsBlob: prop[7],
                        createDate: prop[8],
                        capacity: prop[9],
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
        }
    },[customerTenantId])

    return(
        <>
        <Container fluid>
        <Row>
            <Col md="12">
                
                <Card>
                    <Card.Header>儲存體使用</Card.Header>
                    
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
                                    Header: "群組",
                                    accessor: "resourceGroupsPhones",
                                },
                                {
                                    Header: "Blob名稱",
                                    accessor: "name",
                                },
                                {
                                    Header: "存放地點",
                                    accessor: "location",
                                },
                                {
                                    Header: "啟動加密服務",
                                    accessor: "encryptionServicesBlobEnabled",
                                },
                                {
                                    Header: "訪問層",
                                    accessor: "accessTier",
                                },
                                {
                                    Header: "狀態",
                                    accessor: "provisioningState",
                                },
                                {
                                    Header: "主要端點",
                                    accessor: "primaryEndpointsBlob",
                                },
                                {
                                    Header: "建立時間",
                                    accessor: "createDate",
                                },
                                {
                                    Header: "用量",
                                    accessor: "capacity",
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

export default ServiceStorage
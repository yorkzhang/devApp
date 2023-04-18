import React, { useEffect, useState } from 'react'
// react-bootstrap components
import { Button, Card, Container, Row, Col, } from "react-bootstrap";
import axios from 'axios'
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactDatetime from "react-datetime";
// Redux
import { useSelector } from 'react-redux'
import { selectUser } from 'ReduxStore/slice/userSlice';

const Forecast = () =>{
    // 取得User權限資訊
    const UserInfo = useSelector(selectUser)
    const CustomerTenantId = UserInfo.userInfo.CustomerTenantId
    const UserGroup = UserInfo.userInfo.UserGroup
    
    // 透過User資訊進一步取得各欄位資訊
    let _dataSet = []
    let _restdataSet = []
    const [data, setData] = useState()
    const [restData, setRestData] = useState()
    // 起始時間、結束時間
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('zh-TW'))
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('zh-TW'))
    useEffect(()=>{
        if(CustomerTenantId && UserGroup){
            // axios.get(`https://api.metaage.pro/api/azureForecast?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f&UserGroup=xxx&StartData=2022/09/01&EtartData=2022/09/01`)
            axios.get(`https://api.metaage.pro/api/azureForecast?QureyCustomerTenantId=${CustomerTenantId}&UserGroup=${UserGroup}&StartData=${startDate}&EtartData=${endDate}`)
            .then((res)=>{
                res.data.map((res)=>{
                    _dataSet.push([
                        res.date,
                        res.tenantName,
                        res.sumCost.toFixed(0),
                    ])
                })
                setData(_dataSet.map((prop, key) => {
                    return {
                        id: key,
                        date: prop[0],
                        tenantName: prop[1],
                        sumCost: prop[2],
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
    },[CustomerTenantId, UserGroup, startDate, endDate])

    return(
        <>
        <Container fluid>
        <Row>
            <Col md="12">
                <Card>
                    <Card.Header>成本預測</Card.Header>
                    <Card.Body>
                        <Row md="12">
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <div className="d-flex flex-row align-items-center justify-content-center" style={{margin:'auto 1rem'}}>起始日期</div>
                                <ReactDatetime
                                    inputProps={{
                                        className: "form-control",
                                        placeholder: "Date Picker Here",
                                    }}
                                    timeFormat={false}
                                    dateFormat="yyyy/MM/DD"
                                    value={startDate}
                                    onChange={(date) => {
                                        const d = new Date(date).toLocaleDateString('zh-TW');
                                        setStartDate(d);
                                    }}
                                ></ReactDatetime>
                            </div>
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <div className="d-flex flex-row align-items-center justify-content-center" style={{margin:'auto 1rem'}}>結束日期</div>
                                <ReactDatetime
                                    inputProps={{
                                        className: "form-control",
                                        placeholder: "Date Picker Here",
                                    }}
                                    timeFormat={false}

                                    dateFormat="yyyy/MM/DD"
                                    value={endDate}
                                    onChange={(date) => {
                                        const d = new Date(date).toLocaleDateString('zh-TW');
                                        setEndDate(d);
                                    }}
                                ></ReactDatetime>
                            </div>
                        </Row>


                        <Row md="12">

                        </Row>


                        {data
                        ?
                            <ReactTable
                                restData={restData}
                                data={data}
                                columns={[
                                {
                                    Header: "預測日期",
                                    accessor: "date",
                                },
                                {
                                    Header: "本月預測雲用量總金額",
                                    accessor: "sumCost",
                                    ContentPosition:'right',//表格內容對齊位置
                                    thousandth : true //千分號
                                },
                                {
                                    Header: "公司名稱",
                                    accessor: "tenantName",
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

export default Forecast
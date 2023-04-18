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
    Table,
    Container,
    Row,
    Col,
} from "react-bootstrap";
// core components
import ReactTable from "components/ReactTable/ReactTable.js";
// 新增
import axios from 'axios'
import ReactDatetime from "react-datetime";
import './_consumption.scss'
const Consumption = (props) =>{

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

    // 加入下拉式選單，用登入User的
    let _selectTenantID = []
    const [collectTenant, setCollectTenant] = useState([])
    useEffect(()=>{
        if(customerTenantId){
            const GetTenantId = async() =>{
                let getInfo = await axios
                    // .get(`https://api.metaage.pro/api/Consumption/V1/GetCompany?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f`)
                    .get(`https://api.metaage.pro/api/Consumption/V1/GetCompany?QureyCustomerTenantId=${customerTenantId}`)
                    .catch((err)=>{console.log(err)});
                if(getInfo){
                    getInfo.data.map((res, key)=>{
                        if(!_selectTenantID.includes(res.tenantID)){_selectTenantID.push({tenantID: res.tenantID, tenantName: res.tenantName})}
                    })
                    setCollectTenant(_selectTenantID)
                    
                    // 進入頁面時，直接設定公司選單預設值
                    if(getInfo.data && getInfo.data.length > 0){
                        setSelectCompany(getInfo.data[0].tenantID)
                    }
                }
            }
            GetTenantId()
        }
    },[customerTenantId])

    const [selectCompany, setSelectCompany] = useState()
    function CompanySelector(){
        return(
            <select 
                className='form-control'
                value={selectCompany} // 增加公司的預設值
                onChange={(e) => {setSelectCompany(e.target.value)}}
            >
            <option>公司名稱</option>
                { collectTenant.map((company, key)=>{ return(<option key={`_dDowncompant`+key} value={company.tenantID} >{company.tenantName}</option>) }) }
            </select>
        );
    }
    
    // 透過User資訊進一步取得各欄位資訊
    let _dataSet = []
    let _restdataSet = []
    const [data, setData] = useState([])
    const [restData, setRestData] = useState()
    // 起始時間、結束時間
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('zh-TW'))
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('zh-TW'))
    useEffect(()=>{
        if(customerTenantId && userGroup){
        // axios.get(`https://api.metaage.pro/api/Consumption/?QureyCustomerTenantId=${customerTenantId}&UserGroup=${userGroup}&StartData=${startDate}&EtartData=${endDate}`)
        // axios.get(`https://api.metaage.pro/api/Consumption/?QureyCustomerTenantId=123&UserGroup=SuperGroupx&StartData=2022/08/01&EtartData=2022/08/05`)
        // axios.get(`https://api.metaage.pro/api/Consumption/V1/GetConsumption?QureyCustomerTenantId=${customerTenantId}&UserGroup=${userGroup}&StartData=${startDate}&EtartData=${endDate}`)
        axios.get(`https://api.metaage.pro/api/Consumption/V1/GetConsumption?QureyCustomerTenantId=${selectCompany}&StartData=${startDate}&EtartData=${endDate}`)
        .then((res)=>{
            res.data.map((res)=>{
                _dataSet.push([
                    res.date, 
                    res.serviceName, 
                    res.resourceGroup, 
                    res.resourceLocation, 
                    res.meterSubcategory, 
                    res.unitOfMeasure, 
                    res.preTaxCost.toFixed(0)
                ])
                if(!_restdataSet.includes(res.subscriptionName)){_restdataSet.push(res.subscriptionName)}
            })
            setData(_dataSet.map((prop, key) => {
                return {
                    id: key,
                    date: prop[0],
                    name: prop[1],
                    group: prop[2],
                    location: prop[3],
                    category: prop[4],
                    unit: prop[5],
                    cost: prop[6],
                    actions: (
                        <div className="actions-right">
                            <Button
                                onClick={() => {
                                let obj = data.find((o) => o.id === key);
                                alert(
                                    "You've clicked LIKE button on \n{ \nGroup: " +
                                    obj.group +
                                    ", \nlocation: " +
                                    obj.location +
                                    ", \ncategory: " +
                                    obj.category +
                                    ", \nunit: " +
                                    obj.unit +
                                    ", \ncost: " +
                                    obj.cost +
                                    "\n}."
                                );
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
                                alert(
                                    "You've clicked EDIT button on \n{ \nGroup: " +
                                    obj.group +
                                    ", \nlocation: " +
                                    obj.location +
                                    ", \ncategory: " +
                                    obj.category +
                                    ", \nunit: " +
                                    obj.unit +
                                    ", \ncost: " +
                                    obj.cost +
                                    "\n}."
                                );
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
    },[startDate, endDate, selectCompany])
    
    // 時間範圍內總計金額
    const [sum, setSum] = useState()
    useEffect(()=>{
        if(customerTenantId && userGroup){
            const getSum = async()=>{
                let getInfo = await axios
                    // .get(`https://api.metaage.pro/api/Consumption/V1/GetConsumptionAmount?QureyCustomerTenantId=cdfb1bbe-3e20-455f-90c1-c2d26cb8ef7f&UserGroup=SuperGroupx&StartData=2022/08/01&EtartData=2022/08/05`) 
                    // .get(`https://api.metaage.pro/api/Consumption/V1/GetConsumptionAmount?QureyCustomerTenantId=${customerTenantId}&UserGroup=${userGroup}&StartData=${startDate}&EtartData=${endDate}`) 
                    .get(`https://api.metaage.pro/api/Consumption/V1/GetConsumptionAmount?QureyCustomerTenantId=${selectCompany}&StartData=${startDate}&EtartData=${endDate}`) 
                    .catch((err)=>{console.log(err)})
                if(getInfo && getInfo.data[0].preTaxCost){
                    setSum(getInfo.data[0].preTaxCost)
                }
            }
            getSum()
        }
    },[startDate, endDate, selectCompany])
    
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // EXCEL
    const downExcel = () =>{
        axios({
            // url: `https://api.metaage.pro/api/Consumption/V1/GetConsumptionToExcel?StartData=${startDate}&EtartData=${endDate}&QureyCustomerTenantId=0beb142b-d676-4cba-acb5-ea490570c519`, //your url
            // url: `https://api.metaage.pro/api/Consumption/V1/GetConsumptionToExcel?StartData=${startDate}&EtartData=${endDate}&QureyCustomerTenantId=${customerTenantId}`, //your url
            url: `https://api.metaage.pro/api/Consumption/V1/GetConsumptionToExcel?StartData=${startDate}&EtartData=${endDate}&QureyCustomerTenantId=${selectCompany}`, //your url
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `${'每日費用'}-帳單明細.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    }
    function ProduceExcel(){
        return(
        <Button className="btn mr-1" style={{fontSize:'0.7rem', width:'6rem', margin:'1rem',backgroundColor:'rgba(250,100,50,1.0)'}} onClick={()=>{downExcel()}}>匯出EXCEL</Button>
        )
    }

    return (
    <>
        <Container fluid className='wrap-consumption'>
        <Row>
            <Col md="12">
                <Card>
                    <Card.Body>
                        <Row md="12">
                        {/* 起始時間-下拉式選單 */}
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <div className="col-4 d-flex flex-row align-items-center justify-content-center">起始日期</div>
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
                        {/* 結束時間-下拉式選單 */}
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <div className="col-4 d-flex flex-row align-items-center justify-content-center">結束日期</div>
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
                            <div className="d-flex flex-row align-items-center justify-content-start">
                                <div className="col-4 d-flex flex-row align-items-center justify-content-center">選擇公司</div>
                                    {CompanySelector()}
                            </div>
                            {/* 匯出EXCEL */}
                            <div className="col">
                                {ProduceExcel()}
                            </div>
                            {/* 範圍金額總計 */}
                            <div>
                                <div className="d-flex flex-row align-items-center con-sum">
                                    <div className="con-sum--title">總計</div>
                                    <div className="col con-sum--num">{selectCompany !== '公司名稱' && sum? AddThousandSign(sum.toFixed(0)): 0}</div> 
                                </div>
                            </div>
                        </Row>
                        {data
                        ?
                            <ReactTable
                                restData={restData}
                                data={data}
                                columns={[
                                {
                                    Header: "時間月份",
                                    accessor: "date",
                                },
                                {
                                    Header: "服務名稱",
                                    accessor: "name",
                                },
                                {
                                    Header: "資源群組",
                                    accessor: "group",
                                },
                                {
                                    Header: "資源位置",
                                    accessor: "location",
                                },
                                {
                                    Header: "服務類別",
                                    accessor: "category",
                                },
                                {
                                    Header: "單位",
                                    accessor: "unit",
                                },
                                {
                                    Header: "金額(TWD)",
                                    accessor: "cost",
                                    sortable: false,
                                    filterable: false,
                                    ContentPosition:'right',//表格內容對齊位置
                                    thousandth : true //千分號
                                },
                                ]}
                                /*
                                You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                                */
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
    );


}

export default Consumption
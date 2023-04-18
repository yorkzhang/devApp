import React , { useState, useEffect }from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'
import ReactDatetime from "react-datetime";
import ANASubscription from './ANASubscription'
import axios from 'axios'
// Redux
import { useSelector } from 'react-redux'
import { selectUser } from 'ReduxStore/slice/userSlice';

const Analysis = (props) =>{
    
    // 取得User權限資訊
    const UserInfo = useSelector(selectUser)
    const CustomerTenantId = UserInfo.userInfo.CustomerTenantId
    
    // 進入畫面時，以當天時間往前推一周的時間，做為預設日期
    var tday = new Date(); 
    let setDay = tday.setDate( tday.getDate()-7 )
    
    // 收集開始時間、結束時間
    const [startDate, setStartDate] = useState(new Date(setDay).toLocaleDateString('zh-TW'))
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('zh-TW'))
    
    // 提取公司名稱
    let _CompanysInfo = []
    const [companysInfo, setCompanysInfo] = useState([])
    useEffect(()=>{
        // axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetCompany?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f`)
        axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetCompany?QureyCustomerTenantId=${CustomerTenantId}`)
        .then((res)=>{
            res.data.map((res)=>{
                if(!_CompanysInfo.includes(res.tenantName)){
                    _CompanysInfo.push({tenantID:res.tenantID, tenantName:res.tenantName})
                }
            })
            setCompanysInfo(_CompanysInfo)

            // 進入頁面時，直接設定公司選單預設值
            if(res.data && res.data.length > 0){
                setCompanyTenantID(res.data[0].tenantID)
            }
        })
    },[CustomerTenantId])

    // 製作公司選單
    const [companyTenantID, setCompanyTenantID] = useState()
    function CompanySelector(){
        return(
            <select 
                className="rdt" 
                style={{border:'solid 1px #E3E3E3', borderRadius:'4px', padding:'8px 12px', fontSize:'0.875rem'}} 
                value={companyTenantID}
                onChange={(e)=>{setCompanyTenantID(e.target.value)}}
            >
                <option>公司名稱</option>
                {companysInfo.map((company, key)=>{
                    return(<option key={`_dDowncompant`+key} value={company.tenantID}>{company.tenantName}</option>)
                })}
            </select>
        )
    }

    return(
        <>
        <Container fluid>
            <Row>
                <Col md="12">
                    <Card>
                        <Card.Header>成本分析</Card.Header>
                        <Card.Body>
                            <Row md="12">
                                {/* 開始時間下拉式選單 */}
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
                                {/* 結束時間下拉式選單 */}
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
                                {/* 公司名稱 */}
                                <div className="d-flex flex-row align-items-center justify-content-start">
                                    <div className="d-flex flex-row align-items-center justify-content-center" style={{margin:'auto 1rem'}}>請選擇</div>
                                    {CompanySelector()}
                                </div>

                            </Row>
                        </Card.Body>
                        
                        <ANASubscription 
                            startDate={startDate}
                            endDate={endDate}
                            companyTenantID={companyTenantID}
                            CustomerTenantId={CustomerTenantId}
                        />
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default Analysis

import React, { PureComponent, useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios'
// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Form,
    InputGroup,
    Navbar,
    Nav,
    TabContent,
    TabPane,
    Container,
    Collapse,
    Row,
    Col,
    Tab,
    Table,
    Tooltip
} from "react-bootstrap";
import ANAVirtualMachine from './ANAVirtualMachine';
import ANAStorage from './ANAStorage';
import ANANetwork from './ANANetwork';


// 加千分號
const AddThousandSign = (num) =>{
    return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
}

// 設定呈現顏色
const COLORS = ['#FB404B', '#00C49F', '#1DC7EA', '#FFBB28'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
    <g>
        <text x={cx} y={375} dy={5} textAnchor="middle" fill={fill}>
            選取訂閱帳戶 : {payload.subscriptionName}
        </text>
        <text x={cx} y={375} dy={25} textAnchor="middle" fill={fill}>
            所有訂閱帳戶金額 : {AddThousandSign(payload.comTotal.toFixed(0))}
        </text>
        <text x={cx} y={375} dy={45} textAnchor="middle" fill={fill}>
            個別訂閱帳戶金額 : {AddThousandSign(payload.subTotal.toFixed(0))}
        </text>
        {/* 各部分扇形區域 */}
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
        {/* 動態外圈 */}
        <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
        />
    </g>
    );
};


export default function ANASubscription (props){
    
    // 收集Chart圖所需資料--製作圓餅圖
    let _subArr = []
    const [subChart, setSubChart] = useState([])
    // 收集Chart圖所需資料--製作表格
    const [resGHtml, setResGHtml] = useState()

    useEffect(()=>{
        
        const BillingAnalysis = async() => {
            let GetSubPctRes = await axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubPct?StartData=${props.startDate}&EtartData=${props.endDate}&QureyCompanyID=${props.companyTenantID}`)
                                    .catch((err)=>{
                                        setSubChart([])
                                        setResGHtml(null)
                                        console.log("err :", err)
                                    })
            console.log('GetSubPctRes',GetSubPctRes);
            GetSubPctRes.data.map((res)=>{
                if(!_subArr.includes(res.subscriptionName)){
                    _subArr.push({
                        comTotal:res.comTotal, 
                        subPct:res.subPct, 
                        subTotal:res.subTotal, 
                        subscriptionName:res.subscriptionName,
                    })
                }
            })
            setSubChart(_subArr)
            let GetSubResourceGroupRes = await axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubResourceGroup?StartData=${props.startDate}&EtartData=${props.endDate}&QureyCompanyID=${props.companyTenantID}`)
            setResGHtml(GetSubResourceGroupRes)
        }
        if( props.startDate && props.endDate && props.companyTenantID){
            BillingAnalysis()
        }
        
    },[ props.startDate , props.endDate , props.companyTenantID])

    // bootstrap class設定
    var _formCol = {
        item:'col-8', 
        subscription:'col-10 text-center', 
        input:'col-12'
    }

    // 套件功能
    const [state, setState]= useState({activeIndex: 0, subscriptioname:''})
    const onPieEnter = (_, index) => {
        setState({activeIndex: index, subscriptionName: subChart[index].subscriptionName});
    };

    
    return (
    <>
    <Card.Body>
        <Row md='12'>
            <Col md="6">
                <ResponsiveContainer width="100%" height={425}>
                    {subChart.length > 0
                        ?
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={subChart}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={140}
                                    fill="#8884d8"
                                    dataKey="subPct"
                                    activeIndex={state.activeIndex}
                                    activeShape={renderActiveShape}
                                    onMouseEnter={onPieEnter}
                                >
                                    {subChart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        :   
                            <h3>查無資料</h3>
                    }
                </ResponsiveContainer>
            </Col>
            <Col md="6">
                <Card.Body style={{maxHeight:'400px', overflowX:'auto'}}>
                    <div></div>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className={`${_formCol.item}`}>訂閱帳戶 : {state.subscriptionName}</th>
                                <th className={`${_formCol.subscription}`} ></th>
                            </tr>
                            <tr>
                                <th className={`${_formCol.item}`}>資源群組</th>
                                <th className={`${_formCol.subscription}`}>金額(NTD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                resGHtml && state.subscriptionName
                                ?
                                    resGHtml.data.map((res)=>{
                                        return(
                                        res.resourceGroup !== '' && res.subscriptionName === state.subscriptionName
                                        ? 
                                            
                                            <tr>
                                                <th className={`${_formCol.item}`} style={{color:'gray', fontSize:'0.8rem', margin:'1px'}}>{res.resourceGroup}</th>
                                                <th className={`${_formCol.subscription}`} style={{color:'gray', fontSize:'0.8rem', margin:'1px'}}>{AddThousandSign(res.subTotal.toFixed(0))} </th>
                                            </tr>
                                        :
                                            null
                                        )
                                    })
                                : 
                                    <tr>
                                        <th className={`${_formCol.item}`}>請將滑鼠移至左側訂閱帳戶以觀看資源群組資料</th>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Col>
        </Row>
    </Card.Body>
    <Card.Body>
        <Row md='12'>
            <Col md="4">
                <ANAVirtualMachine 
                    startDate={props.startDate}
                    endDate={props.endDate}
                    companyTenantID={props.companyTenantID}
                    CustomerTenantId={props.CustomerTenantId}
                    subscriptionName={state.subscriptionName}
                />
            </Col>
            <Col md="4">
                <ANAStorage 
                    startDate={props.startDate}
                    endDate={props.endDate}
                    companyTenantID={props.companyTenantID}
                    CustomerTenantId={props.CustomerTenantId}
                    subscriptionName={state.subscriptionName}
                />
            </Col>
            <Col md="4">
                <ANANetwork 
                    startDate={props.startDate}
                    endDate={props.endDate}
                    companyTenantID={props.companyTenantID}
                    CustomerTenantId={props.CustomerTenantId}
                    subscriptionName={state.subscriptionName}
                />
            </Col>
        </Row>
    </Card.Body>
    </>
    );
}

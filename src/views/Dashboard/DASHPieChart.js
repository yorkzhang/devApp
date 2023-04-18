// 暫時的假資料

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios'
// react-bootstrap components
import { Card, Row, Col, Table, } from "react-bootstrap";

const COLORS = ['##b0ee4c', '#FFBB28', '#F46036', '#ff9be2', '#00C49F', '#1DC7EA', '#FB404B', '#F133FD', '#e0901d'];
const RADIAN = Math.PI / 180;
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
        <text x={cx} y={300} dy={25} textAnchor='middle' fill={fill}>
            {payload.servicename} {payload.金額.toFixed(0)}%
        </text>
        {/* 各部分區域 */}
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

const DASHPieChart=()=>{
    const [state, setState]= useState({activeIndex: 0})
    const onPieEnter = (_, index) => {
        setState({activeIndex: index});
    };
    let _collectData = []
    const [finalData, setFinalData] = useState([])
    useEffect(()=>{
        const PieChartData = async() =>{
            let getData = await axios
                .get(`https://api.metaage.pro/api/DashBoard/GetCountService?QureyCustomerTenantId=0beb142b-d676-4cba-acb5-ea490570c519&StartData=2022-09-01&EtartData=2022-09-30`)
                .catch((err)=>{console.log(err)})
            if(getData){
                getData.data.map((res)=>{
                    if(!_collectData.includes(res.servicename)){_collectData.push({"servicename": res.servicename, "金額": res.subPct})}
                })
                setFinalData(_collectData)
            }
        }
        PieChartData()
    },[])


    console.log('window.screen.width :', window.screen.width)
    console.log('window.screen.width :', window.screen.width * 0.0625)
    console.log('window.screen.width :', window.screen.width * 0.0364)
    return (
        <Row>
        <Col md='6'>
            <ResponsiveContainer width="100%" height={330}>
                <PieChart width="100%" height={400}>
                <Pie
                    data={finalData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // outerRadius={window.screen.width > 1366? 125: 75} // 80 125
                    outerRadius="75%" // 80 125
                    dataKey="金額"
                    activeIndex={state.activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={onPieEnter}
                >
                    {finalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Col>
        <Col md='6'>
            <Card.Body style={{maxHeight:'300px', overflowX:'auto'}}>
                <div></div>
                <Table>
                    <thead>
                        <tr>
                            <th className={`col-1`}></th>
                            <th className={`col-11`}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            finalData
                            ?
                                finalData.map((res, index)=>{
                                    return(
                                        <tr>
                                            <th 
                                                style={{color:COLORS[index % COLORS.length]}}
                                            >
                                                <div style={{width:'10px', height:'10px', backgroundColor:COLORS[index % COLORS.length], }}></div>
                                            </th>
                                            <th 
                                                style={{color:COLORS[index % COLORS.length]}}
                                            >{res.servicename}</th>
                                        </tr>
                                    )
                                })
                            :
                                null
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Col>
        </Row>
    );
}
export default DASHPieChart
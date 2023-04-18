import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import axios from 'axios'

export default function ANANetwork(props){
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // 設定呈現顏色
    const COLORS = ['#FB404B', '#00C49F', '#1DC7EA', '#FFBB28', '#2E294E', '#F46036', '#C5D86D'];
    // 收集Chart圖所需資料
    let _bandwidthArr = []
    const [bandArr, setBandArr] = useState([])
    useEffect(()=>{
        // axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubBandwidth?StartData=2022-10-01&EtartData=2022-10-30&QureyCompanyID=0beb142b-d676-4cba-acb5-ea490570c519`)
        if(props.startDate && props.endDate && props.companyTenantID && props.subscriptionName){
        axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubBandwidth?StartData=${props.startDate}&EtartData=${props.endDate}&QureyCompanyID=${props.companyTenantID}`)
        .then((res)=>{
            res.data.map((res)=>{
                if(res.subscriptionName === props.subscriptionName && !_bandwidthArr.includes(props.subscriptionName)){_bandwidthArr.push({
                    meterSubcategory: res.meterSubcategory, 
                    subPct: res.subPct, 
                    subPctNum: res.subPct.toFixed(0)+"%", 
                    金額: res.subTotal,
                })}
                setBandArr(_bandwidthArr)
            })
        })    
        .catch((err)=>{
            console.log(err)
            setBandArr([])
        })
        }
    },[props.startDate, props.endDate, props.companyTenantID, props.subscriptionName])
    
    
    return (
        <>
        <h4>Bandwidth</h4>
        <ResponsiveContainer width="100%" height={325}>
            <BarChart
                width={500}
                height={300}
                data={bandArr}
                barCategoryGap={40}
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="meterSubcategory"/>
                <YAxis />
                <Tooltip formatter={(value, name) => (name === "price") ? `$${value/100}A` : AddThousandSign(value.toFixed(0)) }/>
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="金額">
                    {bandArr.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % 20]} />))}
                    <LabelList dataKey="subPctNum" position="top" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        </>
    );
}
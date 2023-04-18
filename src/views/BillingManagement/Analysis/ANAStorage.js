import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import axios from 'axios'

export default function ANAStorage(props){
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // 設定呈現顏色
    const COLORS = ['#FB404B', '#00C49F', '#1DC7EA', '#FFBB28', '#2E294E', '#F46036', '#C5D86D'];
    // 收集Chart圖所需資料
    let _storeArr = []
    const [storeArr, setStoreArr] = useState([])
    useEffect(()=>{
        // axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubStorage?StartData=2022-10-01&EtartData=2022-10-30&QureyCompanyID=0beb142b-d676-4cba-acb5-ea490570c519`)
        if(props.startDate && props.endDate && props.companyTenantID && props.subscriptionName){
        axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubStorage?StartData=${props.startDate}&EtartData=${props.endDate}&QureyCompanyID=${props.companyTenantID}`)
        .then((res)=>{
            res.data.map((res)=>{
                if(res.subscriptionName === props.subscriptionName && !_storeArr.includes(props.subscriptionName)){_storeArr.push({
                    meterSubcategory: res.meterSubcategory, 
                    subPct: res.subPct, 
                    subPctNum: res.subPct.toFixed(0)+"%", 
                    金額: res.subTotal,
                })}
                setStoreArr(_storeArr)
            })
        })    
        .catch((err)=>{
            console.log(err)
            setStoreArr([])
        })
        }
    },[props.startDate, props.endDate, props.companyTenantID, props.subscriptionName])
    
    
    return (
        <>
        <h4>Storage</h4>
        <ResponsiveContainer width="100%" height={325}>
            <BarChart
                width={500}
                height={300}
                data={storeArr}
                style={{fontSize:'12px'}}
                layout="vertical"
                barCategoryGap={storeArr.length > 3? 5: 20}
                margin={{
                    top: 5,
                    right: 30,
                    bottom: 5,
                }}
            >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis type='number' />
            <YAxis type='category' dataKey='meterSubcategory' width={200}/>
            {/* <Tooltip formatter={(value, name) => (name === "price") ? `$${value/100}A` : value.toLocaleString('zh', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 })}/> */}
            <Tooltip formatter={(value, name) => (name === "price") ? `$${value/100}A` : AddThousandSign(value.toFixed(0)) }/>
            <Bar dataKey="金額">
                {storeArr.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % 20]} />))}
                <LabelList dataKey="subPctNum" position="right" />
            </Bar>
            </BarChart>
        </ResponsiveContainer>
        </>
    );
}
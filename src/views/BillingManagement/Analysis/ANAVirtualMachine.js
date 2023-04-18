import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import axios from 'axios'

export default function ANAVirtualMachine(props){
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // 設定呈現顏色
    const COLORS = ['#FB404B', '#00C49F', '#1DC7EA', '#FFBB28'];
    // 收集Chart圖所需資料
    let _vmArr = []
    const [vmArr, setVMArr] = useState([])
    useEffect(()=>{
        // axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubVirtualMachines?StartData=2022-10-01&EtartData=2022-10-30&QureyCompanyID=0beb142b-d676-4cba-acb5-ea490570c519`)
        if(props.startDate && props.endDate && props.companyTenantID && props.subscriptionName){
            axios.get(`https://api.metaage.pro/api/AzureBillingAnalysis/V1/GetSubVirtualMachines?StartData=${props.startDate}&EtartData=${props.endDate}&QureyCompanyID=${props.companyTenantID}`)
            .then((res)=>{
                res.data.map((res)=>{
                    let  [i1, i2, ...rest] = res.meterSubcategory.split (" ");
                    let restName = rest.join(" ")
                    if(res.subscriptionName === props.subscriptionName && !_vmArr.includes(props.subscriptionName)){_vmArr.push({
                        meterSubcategory: restName, 
                        subPct: res.subPct, 
                        subPctNum: res.subPct.toFixed(0)+"%", 
                        金額: res.subTotal,
                    })}
                    setVMArr(_vmArr)
                })
            })    
            .catch((err)=>{
                console.log(err)
                setVMArr([])
            })
        }
        
    },[props.startDate, props.endDate, props.companyTenantID, props.subscriptionName])
    
    
    return (
        <>
        <h4>Virtual Machines</h4>
        <ResponsiveContainer width="100%" height={325}>
            <BarChart
                width={500}
                height={300}
                data={vmArr}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                style={{fontSize:'12px'}}
                layout="vertical"
                barCategoryGap={20}
            >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis type='number' />
            <YAxis type='category' dataKey='meterSubcategory'/>
            <Tooltip formatter={(value, name) => (name === "price") ? `$${value/100}` : AddThousandSign(value.toFixed(0)) }/>
            {/* <Bar dataKey="金額" barSize={20}> */}
            <Bar dataKey="金額">
                {vmArr.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % 20]} />))}
                <LabelList dataKey="subPctNum" position="right" />
            </Bar>
            </BarChart>
        </ResponsiveContainer>
        </>
    );
}
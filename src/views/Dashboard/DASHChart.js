import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { selectUser } from 'ReduxStore/slice/userSlice';

const DASHChart = () =>{

  // Redux取得User權限資訊
  const UserInfo = useSelector(selectUser)
  const CustomerTenantId = UserInfo.userInfo.CustomerTenantId
  
  // 透過User資訊取得所有公司名稱及Chart圖所需資料(日期、金額)
  const [companyName, setCompanyName] = useState()
  const [lastest30, setLastest30] = useState([])
  let _arrlastest = []
  useEffect(()=>{
    if(CustomerTenantId){
      axios.get(`https://api.metaage.pro/api/DashBoard/DailyAmount?QureyCustomerTenantId=${CustomerTenantId}`)
      .then((res)=>{
        // 取得最新30天
        res.data.slice(-30).map((r)=>{
          _arrlastest.push({
            'date':r['date'].split('/')[1]+'/'+ r['date'].split('/')[2], 
            'timestamp' : new Date(r['date'].split('/')[0], r['date'].split('/')[1]-1, r['date'].split('/')[2]).getTime(), 
            [r.customerName] : r.sumPreTaxCost
          })
        })
        setLastest30(_arrlastest)
        setCompanyName(res.data[0].customerName)
      })
      .catch((err)=>{console.log(err)})
    }
  },[CustomerTenantId])

  return (
    <>
    <ResponsiveContainer 
      height={330}
      className='h-100'
    > 
        <LineChart
            height={300}
            width={500}
            margin={{
                top: 20,
                right: 50,
                left: 20,
                bottom: 5,
            }}
            data={lastest30}
        >
            <CartesianGrid strokeDasharray="3 3" dot={{ stroke: 'red', strokeWidth: 1, r: 4, strokeDasharray:''}}/>
            <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
            <YAxis axisLine={false}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={companyName} stroke="#FB404B" strokeWidth={4} dot={false} activeDot={{r: 8}} Label="name" />
        </LineChart>
    </ResponsiveContainer>
    </>
  );
}

export default DASHChart 
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'

// Redux
import { useSelector } from "react-redux";
import { redexUserId } from 'ReduxStore/slice/loginSlice';
import { selectUser } from 'ReduxStore/slice/userSlice';

export default function DASHForecast(){
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // 從登入後取得的User權限資訊--TenantID、Group
    const TenantID_Group = useSelector(selectUser)
    let tenantId = TenantID_Group.userInfo.CustomerTenantId
    // 從登入後取得的User權限資訊--OpenId
    const OpenId = useSelector(redexUserId)
    const User = OpenId.payload.RLogin.userId
    let MonthStr = [
        {m: 1, mStr: 'Jan', },
        {m: 2, mStr: 'Feb', },
        {m: 3, mStr: 'Mar', },
        {m: 4, mStr: 'Apr', },
        {m: 5, mStr: 'May', },
        {m: 6, mStr: 'Jun', },
        {m: 7, mStr: 'Jul', },
        {m: 8, mStr: 'Aug', },
        {m: 9, mStr: 'Sep', },
        {m: 10, mStr: 'Oct', },
        {m: 11, mStr: 'Nov', },
        {m: 12, mStr: 'Dec'},
    ]
    let _fullYear = [
        // {年份:null,月份: 1, month: 'Jan', 實際: '0', 預測: '0'},
        // {年份:null,月份: 2, month: 'Feb', 實際: '0', 預測: '0'},
        // {年份:null,月份: 3, month: 'Mar', 實際: '0', 預測: '0'},
        // {年份:null,月份: 4, month: 'Apr', 實際: '0', 預測: '0'},
        // {年份:null,月份: 5, month: 'May', 實際: '0', 預測: '0'},
        // {年份:null,月份: 6, month: 'Jun', 實際: '0', 預測: '0'},
        // {年份:null,月份: 7, month: 'Jul', 實際: '0', 預測: '0'},
        // {年份:null,月份: 8, month: 'Aug', 實際: '0', 預測: '0'},
        // {年份:null,月份: 9, month: 'Sep', 實際: '0', 預測: '0'},
        // {年份:null,月份: 10, month: 'Oct', 實際: '0', 預測: '0'},
        // {年份:null,月份: 11, month: 'Nov', 實際: '0', 預測: '0'},
        // {年份:null,月份: 12, month: 'Dec', 實際: '0', 預測: '0'},
    ]
    let getInfoYear = 0
    const [fullYear, setFullYear] = useState([])
    useEffect(()=>{
        if(tenantId){
            const getForecast = async() =>{
                let getInfo = await axios
                    .get(`https://api.metaage.pro/api/DashBoard/GetCountForecastMoon?QureyCustomerTenantId=${tenantId}`)
                    // .get(`https://api.metaage.pro/api/DashBoard/GetCountForecastMoon?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f`)
                    .catch((err) => console.log(err))
                console.log('getInfo',getInfo);
                if(getInfo){
                    getInfo.data.forEach((res)=>{
                        let obj = {}
                        let year = null;
                        let month = null;
                        // 取得資料年分
                        if(res.cData){ 
                             year = res.cData.slice(0,4);
                             month = res.cData.slice(4);
                        }
                        obj.年份 = year;
                        obj.月份 = month > 9 ? month : `0${month}`;
                        obj.日期 = `${year}/${month}`;
                        obj.實際 = res.sumPreTaxCost;
                        obj.預測 = res.forecastCost;
                        _fullYear.push(obj)
                    })
                    // 空月份補0
                    if(_fullYear.length > 0 ){

                        for(let j =  12 - _fullYear.length  ; j > 0 ; j--){
                            let obj = {}
                            let year = null;
                            let month = null;
                            if(_fullYear[0].月份-1>0){
                                year =  _fullYear[0].年份;
                                month =  _fullYear[0].月份 -1;
                                obj.年份 =year;
                                obj.月份 = month > 9 ? month : `0${month}`;
                                obj.日期 = `${ obj.年份}/${obj.月份}`;
                                obj.實際 = 0
                                obj.預測 = 0
                            }else{ //1月
                                obj.年份 = _fullYear[0].年份 -1;
                                obj.月份 = 12;
                                obj.日期 = `${ obj.年份}/${obj.月份}`;
                                obj.實際 = 0
                                obj.預測 = 0
                            }
                            _fullYear.unshift(obj)
                        }
                    }else{ //完全沒資料
                        for(let k = 1 ; k<=12 ; k++){
                            let obj = {}
                            obj.年份 = new Date().getFullYear();
                            obj.月份 = k > 9 ? k : `0${k}`;
                            obj.日期 = `${ obj.年份}/${obj.月份}`;
                            obj.實際 = 0
                            obj.預測 = 0
                            _fullYear.push(obj)
                        }
                    }
                    console.log('_fullYear',_fullYear);
                    setFullYear(_fullYear)
                }
            }
            getForecast()
        }
    },[tenantId])

    return (
    <>
    <ResponsiveContainer width="100%" height={250}>
        <BarChart
            width={500}
            height={300}
            data={fullYear}
            margin={{ top: 20, right: 30, left: 20, bottom: 5, }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="日期" />
            <YAxis yAxisId="left" orientation="left" stroke="#1DC7EA" />
            <YAxis yAxisId="right" orientation="right" stroke="#FB404B" />
            <Tooltip formatter={(value, name) => (name === "price") ? `$${value/100}A` : AddThousandSign(value | 0) }/>
            <Legend />
            <Bar yAxisId="left" dataKey="實際" fill="#1DC7EA" />
            <Bar yAxisId="right" dataKey="預測" fill="#FB404B" />
        </BarChart>
    </ResponsiveContainer>
    </>
    );
}

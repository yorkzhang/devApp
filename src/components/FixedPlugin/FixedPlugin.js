/**
 * 由於套件使用，許多style衝突，因此直接in-line設定css style
 * 2022.10.31 by Jefferson
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Col,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";

import LineDemo from '../../assets/img/LineDemo.PNG'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import { selectUser } from 'ReduxStore/slice/userSlice';
import axios from 'axios'

function FixedPlugin({
  setSidebarImageParent,
  setSidebarBackgroundParent,
  sidebarDefaultImage,
  sidebarImages,
  backgroundColors,
  backgroundColor,
}) {


  // 從登入後取得的User權限資訊--TenantID、Group
  const TenantID_Group = useSelector(selectUser)
  const [lineID,setLineID] = useState()
  const [initToggle, setInitToggle] = useState()
  const [inputID, setInputID] = useState()
  let tenantId = TenantID_Group.userInfo.CustomerTenantId
  
  // 比對目前的使用者以及查詢line的狀態
  useEffect(()=>{
    const LineInfo = async() =>{
      // console.log(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyCompany?QureyCustomerTenantId=${tenantId}`)
      
      let getInfo = await axios
        // .get(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyCompany?QureyCustomerTenantId=1`)
        .get(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyCompany?QureyCustomerTenantId=${tenantId}`)
        .catch((err)=>{console.log(err), setInitToggle(false)})
      
        if(getInfo && getInfo.data.length > 0){
          // 取得的初始LineID
          setLineID(getInfo.data[0].companyLineId)
          // 取得的初始接收通知(開啟:1 關閉:0)，並且對應checkbox傳入true、false
          if(getInfo.data[0].status === '1'){ setInitToggle(true) }
          else{ setInitToggle(false) }
        }
    }
    LineInfo()
  },[initToggle])

  console.log('初始開關狀態 :', initToggle)
  console.log('line id :', lineID)
  console.log('input id :', inputID)

  // 新增使用者line ID
  const AddId = async () => {
    let data = {
      "CompanyId":tenantId, 
      "CompanyLineId":inputID, 
      "Status":"1"
    }
    await axios
      .post(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyCreateCompany`, data)
      .catch((err)=>{console.log(err)})
    console.log("ADD ID POST!")
  }

  // 修正使用者開啟狀態
  const ToggleNotify = async (value) => {
    let data = {
      "CompanyId":tenantId,  // 測試用: "CompanyId":'1', 
      "CompanyLineId":lineID, 
      "Status": value === true? '1': '0' // 測試用: "Status": '0'
    }
    // 如果toggle的狀態跟api的初始狀態不一致，才要去put
    if(value !== initToggle){ 
      await axios
        .put(`https://api.metaage.pro/api/LINENotify/V1/LineNotifyUpdateCompany`, data)
        .catch((err)=>{console.log(err)});
    }
    console.log('data 已傳送:', data)
  }

  return (
    <>
      <div className="fixed-plugin" style={{marginTop:'-100px', marginRight:'10px',height:'500px'}}>
        <Dropdown className="show-dropdown" 
          style={{
            marginRight:'100px',
            height:'500px',
          }}
        >
          <Dropdown.Toggle>
            <i 
              className="fab fa-line fa-2x fab-test"
              style={{
                color:'white',
                fontSize:'60px',
                paddingRight:'100px',
                borderRadius:'10px',
                opacity:'1',
                margin:'auto',
                paddingLeft:'5px',
              }}
            ></i>
          </Dropdown.Toggle>
            
            <Dropdown.Menu 
              style={{
                marginRight:'-100px ', 
                width:'350px', 
                height:'500px',
                overflowX:'hidden',
                overflowY:'auto'
              }}>

              {/* 調整為同一頁 */}
                <div>
                  <div style={{height:'auto', marginBottom:'0rem', width:'300px'}}>
                    <div className='d-flex flex-row justify-content-center align-items-center'>
                      <li className="header-title">Line 入群申請</li>
                      <Dropdown.Toggle 
                        className='button-container'
                        style={{
                          marginTop:'10px',
                          width:'40px',
                          color:'white',
                          borderRadius:'10px',
                          textAlign:'center',
                          border:'solid 1px gray',
                          backgroundColor:'red'
                        }}
                      >X</Dropdown.Toggle>
                    </div>
                    <br/>
                    <div style={{width:'100%'}}>
                      {/* 如果沒有 line id 的話，才 show 出輸入id欄位 */}
                      { lineID === undefined || lineID === ''
                      ?  
                        <>
                        <div style={{fontSize:'0.9rem', marginBottom:'1rem', textAlign:'center'}}>提供Line ID，確認後會立刻將您加入群組唷</div>
                        <br/>
                        <div className="col-12" style={{width:'100%'}}>
                          <label className="col-4" style={{fontSize:'1rem'}}>Line ID</label>
                          <input
                            className="col-8"
                            type="text"
                            id="message"
                            name="message"
                            // onChange={(event)=>{setLineID(event.target.value.trim())}}
                            // value={lineID}
                            
                            // 新增的跟修改的應該要分開來寫才對
                            onChange={(event)=>{setInputID(event.target.value)}}
                            value={inputID}
                          />
                        </div>
                        <br/>
                        <Button style={{width:'100%'}} 
                          onClick={()=>{
                            if(inputID !== undefined && inputID !== ''){
                              AddId()
                            }else{
                              console.log('EMPTY')
                            }
                          }}
                        >送出</Button>
                        <hr/>
                        <div 
                          style={{
                            width:'100%', 
                            textAlign:'center', 
                            backgroundColor:'black', 
                            color:'white'
                          }}
                        > 如何查詢 Line ID </div>
                        <br/>
                        <div>
                          <p style={{fontSize:'0.8rem'}}>1. 依序點選「主頁」＞「設定」＞「個人檔案」</p>
                          <p style={{fontSize:'0.8rem'}}>2. 「ID」的欄位內將顯示已設定完成的LINE ID</p>
                        </div>
                        </>
                      : null
                      }

                      {/* 如果有 line id 的話，才 show 接收通知的開關 */}
                      { lineID && lineID !== undefined && lineID !=='' && lineID !== null
                      ?
                        <div className='d-flex flex-row align-items-center justify-content-end' style={{width:'100%'}}>
                          <Form.Check
                            type="switch"
                            id="custom-switch-12"
                            onClick={(e)=>{ToggleNotify(e.target.checked)}}
                            defaultChecked={initToggle === true? true: false}
                          />
                          <div style={{fontSize:'0.85rem', fontWeight:'100', marginLeft:'1rem'}}>是否持續接收Line通知</div>
                        </div>
                      : null
                      }
                    </div>
                  </div>
                  <hr/>
                  {/* 分頁內容 */}
                  <div className='d-flex flex-row justify-content-center align-items-center'>
                    <li className="header-title">Line 提醒功能</li>
                  </div>
                  <li className="adjustments-line d-flex align-items-center" >
                    <p className="pt-0 mr-auto" style={{display:'flex', flexDirection:'row'}}>
                      <p style={{wordBreak:'keep-all'}}>每天將會定時推播</p>
                      <p style={{wordBreak:'keep-all', color:'red'}}>使用金額</p>
                      <p style={{wordBreak:'keep-all'}}>及</p>
                      <p style={{wordBreak:'keep-all', color:'red'}}>比較差異</p>
                    </p>
                  </li>
                  <img alt="..." src={LineDemo} style={{height:'500px', width:'300px'}}></img>
                </div>
            </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

FixedPlugin.defaultProps = {
  setSidebarImageParent: () => {},
  setSidebarBackgroundParent: () => {},
  sidebarDefaultImage: "",
  sidebarImages: [],
  backgroundColors: [],
};

FixedPlugin.propTypes = {
  setSidebarImageParent: PropTypes.func,
  setSidebarBackgroundParent: PropTypes.func,
  sidebarDefaultImage: PropTypes.string,
  sidebarImages: PropTypes.arrayOf(PropTypes.string),
  // these are colors that can be passed to the Badge component
  backgroundColors: PropTypes.arrayOf(PropTypes.string),
};

export default FixedPlugin;

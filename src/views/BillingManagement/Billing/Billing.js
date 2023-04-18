import React ,{ useEffect, useState}from 'react'
import './_billing.scss'
import axios from 'axios'
// react-bootstrap components
import { Button, Card, Modal, Container, Row, Col,  } from "react-bootstrap";
import BillingModal from './BillingModal';
// Redux
import { useSelector } from "react-redux";
import { redexUserId } from 'ReduxStore/slice/loginSlice';
import { selectUser } from 'ReduxStore/slice/userSlice';

const Billing = (props) =>{
  
  // 從登入後取得的User權限資訊--TenantID、Group
  const TenantID_Group = useSelector(selectUser)
  let tenantId = TenantID_Group.userInfo.CustomerTenantId
  let group = TenantID_Group.userInfo.UserGroup

  // 從登入後取得的User權限資訊--OpenId
  const OpenId = useSelector(redexUserId)
  const User = OpenId.payload.RLogin.userId
  
  const [getUser, setGetUser] = useState(false)
  const [userGroup, setUserGroup] = useState()
  const [customerTenantId, setCustomerTenantId] = useState()
  const [modal, setModal] = React.useState(false);
  const [storeDetail, setStoreDetail] = useState({"meterCategory": "", "sumBilling": ""})
  
  const [reset, setReset] = useState(true)

  // #1僅先取得選單的選項
  const [colCompany, setColCompany] = useState([])
  const [colMonth, setColMonth] = useState([])
  const [colSubscription, setColSubscription] = useState([])
  const [colResourceGroup, setColResourceGroup] = useState([])
  const [dropDownS, setDropDownS] = useState({"company":"", "month":"", "subscription":"", "group":""})
  let _arrcolCompany = []
  let _arrcolMonth = []
  let _arrcolData = []
  let _arrcolSubscription = []
  let _arrcolResourceGroup = []

  useEffect(()=>{
    if(User){
      const companyInfo = async() =>{
        let getInfo = await axios
          .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetCompany?QureyCustomerTenantId=${tenantId}`)
          // .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetCompany?QureyCustomerTenantId=9f24a1a4-2ec0-4bf1-83b9-8b987288642f`)
          .catch((err) => {console.log('err :',err)})
        if(getInfo){
          getInfo.data.map((result)=>{
            if(!_arrcolCompany.includes(result.companyId)){
              _arrcolCompany.push({Id: result.companyId, Name: result.companyName})
            }
            setColCompany(_arrcolCompany)
          })
        }
      }
      companyInfo()
    }
  },[User, dropDownS.company, dropDownS.month, dropDownS.subscription, dropDownS.group])
function CompanySelector(){
  return(
    <select className="wrap-billing--selector--single" onChange={(e) => {
      setDropDownS({"company":e.target.value, "month":'', "subscription":'', "group":''});
      setReset(!reset);
    }}>
      <option>公司名稱</option>
      { colCompany.map((company, key)=>{ return(<option key={`_dDowncompant`+key} value={company.Id}>{company.Name}</option>) }) }
    </select>
  );
}


useEffect(()=>{
  if(User && dropDownS.company){
    const companyInfo = async() =>{
      let getInfo = await axios
        .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetCompanyDate?QureyCustomerTenantId=${dropDownS.company}`)
        .catch((err) => {console.log('err :',err)})
      if(getInfo){
        getInfo.data.map((result)=>{
          if(dropDownS.company === result.companyId && !_arrcolMonth.includes(result.cData)){
            _arrcolMonth.push({Id: result.companyId, cData: result.cData})
          }
          setColMonth(_arrcolMonth)
        })
      }
    }
    companyInfo()
  }
},[User, dropDownS.company])
function MonthSelector(){
  return(
    <select className="wrap-billing--selector--single" value={dropDownS.month} onChange={(e) => {
      setDropDownS({"company":dropDownS.company, "month":e.target.value, "subscription":'', "group":''});
      setReset(!reset)}}>
      <option value={''}>帳單時間</option>
      { colMonth.map((month, key)=>{ return(<option key={`_dDownMonth`+key} value={month.cData}>{month.cData}</option>) }) }
    </select>
  );
}

useEffect(()=>{
  if(User && dropDownS.company && dropDownS.month){
    const companyInfo = async() =>{
      let getInfo = await axios
        .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetCompanySub?QureyCustomerTenantId=${dropDownS.company}&QueryCDate=${dropDownS.month}`)
        .catch((err) => {console.log('err :',err)})
      if(getInfo){
        getInfo.data.map((result)=>{
          if(!_arrcolSubscription.includes(result.subscriptionID)){
            _arrcolSubscription.push({Id: result.subscriptionID, Name: result.subscriptionName})
          }
          setColSubscription(_arrcolSubscription)
        })
      }
    }
    companyInfo()
  }
},[User, dropDownS.company, dropDownS.month])
function SubscriptionSelector(){
  return(
    <select className="wrap-billing--selector--single" value={dropDownS.subscription} onChange={(e) => {
      setDropDownS({"company":dropDownS.company, "month":dropDownS.month, "subscription":e.target.value, "group":''});
      setReset(!reset)}}>
      <option value={''}>訂閱帳戶</option>
      { colSubscription.map((sub, key)=>{ return(<option key={`_dDownSub`+key} value={sub.Id}>{sub.Name}</option>) }) }
    </select>
  );
}



useEffect(()=>{
  if(User && dropDownS.company && dropDownS.month){
    const companyInfo = async() =>{
      let getInfo = await axios
        .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetCompanyGroup?QureyCustomerTenantId=${dropDownS.company}&QueryCDate=${dropDownS.month}&QuerySubscriptionID=${dropDownS.subscription}`)
        .catch((err) => {console.log('err :',err)})
      if(getInfo){
        getInfo.data.map((result)=>{
          if(!_arrcolResourceGroup.includes(result.resourceGroup)){
            _arrcolResourceGroup.push(result.resourceGroup)
          }
          setColResourceGroup(_arrcolResourceGroup)
        })
      }
    }
    companyInfo()
  }
},[User, dropDownS.company, dropDownS.month, dropDownS.subscription])
function GroupSelector(){
  return(
    <select className="wrap-billing--selector--single" value={dropDownS.group} onChange={(e) => {
      setDropDownS({"company":dropDownS.company, "month":dropDownS.month, "subscription":dropDownS.subscription, "group":e.target.value});
      setReset(!reset)}}>
      <option value={''}>資源群組</option>
      { colResourceGroup.map((group, key)=>{ return(<option key={`_dDownGroup`+key} value={group}>{group}</option>) }) }
    </select>
  );
}


  // 因為api取得資料過慢，增加re-render刷新按鈕
  function Refresh(){
    return(
      <Button className="btn mr-1" style={{fontSize:'1rem', width:'10%', backgroundColor:'rgba(250,100,50,1.0)'}} onClick={()=>{setGetUser(!getUser)}}>刷新</Button>
    )
  }
  
  // EXCEL
  const downExcel = () =>{
    axios({
      // url: 'https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountToExcel?QureyCustomerTenantId=0beb142b-d676-4cba-acb5-ea490570c519&QueryCDate=202209&QuerySubscriptionID=269c083b-d7ec-41a7-97e2-876b2f8be41f&QueryResourGroup=humax', //your url
      url: `https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountToExcel?QureyCustomerTenantId=${dropDownS.company}&QueryCDate=${dropDownS.month}&QuerySubscriptionID=${dropDownS.subscription}&QueryResourGroup=${dropDownS.group}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${dropDownS.month}-帳單明細.xlsx`); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }
  function ProduceExcel(){
    return(
      <Button className="btn mr-1" style={{fontSize:'0.7rem', width:'10%', backgroundColor:'rgba(250,100,50,1.0)'}} onClick={()=>{downExcel()}}>匯出EXCEL</Button>
    )
  }

    


  
  // #3當取得使用者選取的內容，才將結果丟進api，生成更精確的帳單資訊
  const [tomainUI, setTomainUI] = useState([])
  const [tosubUI, setTosubUI] = useState([])
  let _finalmainCollect = []
  let _finalsubCollect = []
  useEffect(()=>{
    if(User && dropDownS.company && dropDownS.month){
      const mainBilling = async() =>{
        let getInfo = await axios
          .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountMaster?QureyCustomerTenantId=${dropDownS.company}&QueryCDate=${dropDownS.month}&QuerySubscriptionID=${dropDownS.subscription}&QueryResourGroup=${dropDownS.group}`)
          .catch((err) => {
            console.log('err :',err)
            setTomainUI([])
          })
        if(getInfo){
          _finalmainCollect.push(getInfo.data[0])
        }
        setTomainUI(_finalmainCollect)
      }
      mainBilling()

      const subBilling = async() =>{
        let getInfo = await axios
          .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountMasterService?QureyCustomerTenantId=${dropDownS.company}&QueryCDate=${dropDownS.month}&QuerySubscriptionID=${dropDownS.subscription}&QueryResourGroup=${dropDownS.group}`)
          .catch((err) => {
            console.log('err :',err)
            setTomainUI([])
          })
        if(getInfo){
          getInfo.data.map((result)=>{
            if(!_finalsubCollect.includes(result.servicename)){
              _finalsubCollect.push({servicename: result.servicename, cost: result.cost})
            }
            setTosubUI(_finalsubCollect)
          })
        }
      }
      subBilling()
    }
  },[User, dropDownS.company, dropDownS.month, dropDownS.subscription, dropDownS.group])

  useEffect(()=>{
    if(tomainUI, tosubUI){ billingPage() }
  },[userGroup, dropDownS.company, dropDownS.month, dropDownS.subscription, dropDownS.group])



  // 加千分號
  const AddThousandSign = (num) =>{
    return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
  }

  // 主要帳單資訊
  function billingPage(){
    return(
      tomainUI && tosubUI
      ?
        <div className="d-flex-r">
          <div className="wrap-billing--sum">
              <div className='row gap-3 my-0 item-lists'>
                {/* <div className='col-lg order-lg-1 item-lists--main' style={{backgroundColor:'rgba(209, 233, 252,1)'}}> */}
                <div className='col-lg order-lg-1 item-lists--main' >
                    <div className="item-lists--main--title">帳單編號</div>
                    <div className="item-lists--main--sum">
                      <div className="item-lists--main--sum--unit">&nbsp;</div>
                      <div className="item-lists--main--sum--number"> {tomainUI[0]? tomainUI[0].invoiceId: null} </div>
                    </div>
                </div>
                {/* <div className='col-lg order-lg-2 item-lists--main'  style={{backgroundColor:'rgba(208, 242, 255,1)'}}> */}
                <div className='col-lg order-lg-2 item-lists--main' >
                    <div className="item-lists--main--title">帳單總額</div>
                    <div className="item-lists--main--sum">
                      <div className="item-lists--main--sum--number"> {tomainUI[0]? AddThousandSign(tomainUI[0].costAuount.toFixed(0)): null} </div>
                      <div className="item-lists--main--sum--unit">NTD</div>
                    </div>
                </div>
                {/* <div className='col-lg order-lg-3 item-lists--main'  style={{backgroundColor:'rgba(255, 247, 205,1)'}}> */}
                <div className='col-lg order-lg-3 item-lists--main' >
                    <div className="item-lists--main--title">年月</div>
                    <div className="item-lists--main--sum">
                      <div className="item-lists--main--sum--unit">&nbsp;</div>
                      <div className="item-lists--main--sum--number"> {tomainUI[0]? tomainUI[0].cData: null} </div>
                    </div>
                </div>
                {/* <div className='col-lg order-lg-4 item-lists--main'  style={{backgroundColor:'rgba(255, 231, 217,1)'}}> */}
                <div className='col-lg order-lg-4 item-lists--main' >
                    <div className="item-lists--main--title">訂閱帳戶</div>
                    <div className="item-lists--main--sum">
                      <div className="item-lists--main--sum--unit">&nbsp;</div>
                      <div className="item-lists--main--sum--number"> {tomainUI[0]? tomainUI[0].subscriptionName: null} </div>
                    </div>
                </div>
                {/* <div className='col-lg order-lg-5 item-lists--main'  style={{backgroundColor:'rgba(157, 252, 185,0.7)'}}> */}
                <div className='col-lg order-lg-5 item-lists--main' >
                    <div className="item-lists--main--title">資源群組</div>
                    <div className="item-lists--main--sum">
                      <div className="item-lists--main--sum--unit">&nbsp;</div>
                      <div className="item-lists--main--sum--number"> {tomainUI[0]? tomainUI[0].resourceGroup: null} </div>
                    </div>
                </div>
              </div>
              <div className="refreshAPI">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                <div className="refreshAPI--text"> 若資訊與選取內容不一致，請點選 </div>
                <div className="refreshAPI--highlight"> 刷新 </div>
              </div>

              <div className='row gap-0 my-3 item-lists'>
                <BillingModal modal={modal} setModal={setModal} storeDetail={storeDetail} dropDownS={dropDownS} colCompany={colCompany}/>
                {tosubUI.map((_info, key)=>{
                  return(
                    <div className='col-lg-3 my-3 order-lg-2 item-lists--sub' >
                        <div 
                          className='item-lists--sub--dup' 
                          style={{overflowX:'hidden'}}
                          onClick={()=>{
                            setModal(!modal)
                            setStoreDetail({"selectResult": dropDownS, "meterCategory": _info.servicename, "sumBilling": _info.cost})
                          }}
                        >
                            <div className="item-lists--sub--dup--title">{_info.servicename}</div>
                            <div className="item-lists--sub--dup--sum">
                                {/* <div className="item-lists--sub--dup--sum--number">{_info.cost.toFixed(0)}</div> */}
                                <div className="item-lists--sub--dup--sum--number">{AddThousandSign(_info.cost.toFixed(0))}</div>
                                <div className="item-lists--sub--dup--sum--unit">NTD</div>
                            </div>
                        </div>
                    </div>
                  )
                })}
              </div>
          </div>
        </div>
      :     
      null
      )
  }

  return(
    <>
    <Row md='12'>
      {CompanySelector()}
      {MonthSelector()}
      {SubscriptionSelector()}
      {GroupSelector()}
      {Refresh()}
      {ProduceExcel()}
    </Row>

    {/* 帳單主內容 */}
    {billingPage()}
    </>
  )
}

export default Billing

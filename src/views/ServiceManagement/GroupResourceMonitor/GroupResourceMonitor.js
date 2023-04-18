import React ,{ useState , useEffect} from 'react'
import '../_resourceMonitor.scss'
import axios from 'axios'
import Select from "react-select";
import {
    BrowserRouter as Router,
    useLocation,
    useHistory,
  } from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import { selectUser } from 'ReduxStore/slice/userSlice';

export default function GroupResourceMonitor() {


  // 從登入後取得的User權限資訊--TenantID、Group
  const UserInfo = useSelector(selectUser)
  const CustomerTenantId = UserInfo.userInfo.CustomerTenantId

  const [GrafanaUrl,useGrafanaUrl] = useState('')
  // 取得CustomerTenantId的所有訂用帳戶
  const [subscriptionsList,useSubscriptionsList] = useState([]) 
  // 選到要顯示的訂用帳戶
  const [SelectSubscription,useSelectSubscription] = useState("")

  useEffect(()=>{
    console.log('start',CustomerTenantId);
    if(CustomerTenantId){
        GetUserSubscriptions()
        // 下面改成先取得所有訂用帳戶後再撈每個訂用帳戶的資源
        // GetGrafanaUrl()
    }
  },[Router,CustomerTenantId])

  useEffect(()=>{
    if(SelectSubscription){
      console.log('更換訂用帳戶',SelectSubscription);
      GetGrafanaUrl()
    }
  },[SelectSubscription])
  
  const GetUserSubscriptions =  async() =>{
      console.log('GetUserSubscriptions');
      let res = await axios.get(`https://api.metaage.pro/api/GraganaUrl/V1/GetGraFanaSub?QureyCustomerTenantId=${CustomerTenantId}`)
                        .catch(err=>alert("資源群組取得錯誤"))
      console.log('GetUserSubscriptions_res',res);
      if(res.data && res.data.length > 0){
        // 先取的所有訂用帳戶
        // useSubscriptionsList(res.data)
        let tempArr = []
        res.data.forEach(item=>tempArr.push({value:item.subscriptionID,label:item.subscriptionName}))
        useSubscriptionsList(tempArr)
        // 預設選擇第一個訂用帳戶顯示資源資訊
        console.log('tempArr',tempArr);
        useSelectSubscription(tempArr[0])

      }{
        console.log("資源群組取得錯誤")
      }
  }
  
  const GetGrafanaUrl =  async() =>{
      console.log('GetGrafanaUrl');
      let res = await axios.get(`https://api.metaage.pro/api/GraganaUrl/V1/GetGraFanaUrl?QureyCustomerTenantId=${CustomerTenantId}&QureySubpageID=SPI010`)
      console.log('res',res);
      if(res.data && res.data.length > 0){
          console.log('SelectSubscription',SelectSubscription);
          useGrafanaUrl(`${res.data[0].graFanaUrl}${SelectSubscription.value}`)
      }
      console.log('res.data',res.data);
  }



  // 預防按下ESC後，跳出遮蔽側邊攔的模式
  window.addEventListener("blur", function (e) {
    setTimeout(function () {
      window.focus();
    }, 0);
  });

  return (
    <div className="wrap-grafana">
      
      <div className="grafana-dropdown d-flex align-items-center p-2" style={{'background':'white'}}>{/* DropDown的內容 */}
        <h5 className='m-0' style={{'flexBasis': '150px'}}>訂用帳戶：</h5>
        <Select
            style={{"flex-grow": 1,"flexShrink": 1}}
            className="react-select primary m-2 w-100"
            classNamePrefix="react-select"
            options={subscriptionsList}
            onChange={(value) => useSelectSubscription(value)}
            value={SelectSubscription}>
        </Select>
      </div>
      <iframe
        id="grafanaframe"
        className="grafana-frame"
        src={GrafanaUrl}
        frameBorder="0"
        style={{
          overflow: "hidden",
          overflowX: "hidden",
          overflowY: "hidden",
          width: "100%",
          position: "absolute",
          scrolling: "no",
          top: "100px",
          left: "0px",
          right: "0px",
          bottom: "0px",
        }}
        width="100%"
      ></iframe>
    </div>
  );
}

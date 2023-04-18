import React ,{ useState , useEffect} from 'react'
import '../_resourceMonitor.scss'
import axios from 'axios'
import {
    BrowserRouter as Router,
    useLocation,
    useHistory,
  } from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import { selectUser } from 'ReduxStore/slice/userSlice';

export default function StorageResourceMonitor() {

  // 從登入後取得的User權限資訊--TenantID、Group
  const UserInfo = useSelector(selectUser)
  const CustomerTenantId = UserInfo.userInfo.CustomerTenantId

  const [GrafanaUrl,useGrafanaUrl] = useState('')


  useEffect(()=>{
    console.log('start',CustomerTenantId);
    if(CustomerTenantId){
        GetGrafanaUrl()
    }
  },[Router,CustomerTenantId])

  const GetGrafanaUrl =  async() =>{

      console.log('GetGrafanaUrl');
      let res = await axios.get(`https://api.metaage.pro/api/GraganaUrl/V1/GetGraFanaUrl?QureyCustomerTenantId=${CustomerTenantId}&QureySubpageID=SPI009`)
      if(res.data && res.data.length > 0){
          useGrafanaUrl(res.data[0].graFanaUrl)
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
      <div className="grafana-dropdown">{/* DropDown的內容 */}</div>
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

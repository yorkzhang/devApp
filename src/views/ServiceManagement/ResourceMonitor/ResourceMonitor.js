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

const ResourceMonitor = () =>{

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
        let res = await axios.get(`https://api.metaage.pro/api/GraganaUrl/V1/GetGraFanaUrl?QureyCustomerTenantId=${CustomerTenantId}&QureySubpageID=SPI007`)
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
    
    return(
        <div className='wrap-grafana'>
            <div className='grafana-dropdown'>
                {/* DropDown的內容 */}
            </div>
            <iframe 
                id="grafanaframe" 
                className="grafana-frame"
                src={GrafanaUrl}
                frameBorder="0"
                style={{
                    overflow:'hidden', 
                    overflowX:'hidden', 
                    overflowY:'hidden', 
                    width:'100%', 
                    position:'absolute', 
                    scrolling:"no",
                    top:'100px',
                    left:'0px', 
                    right:'0px', 
                    bottom:'0px',
                }} 
                width="100%"
            >
            </iframe>
        </div>
    )
}

export default ResourceMonitor

/**
 * 歷史版本-V1
 * src="http://20.243.204.157:3000/d/AzVmInsightsByRG/azure-insights-virtual-machines-by-resource-group?orgId=1&var-ds=Azure+Monitor&var-sub=3ff1c84b-a716-46fd-bdc0-0a7ea7ddc6ea&var-agg=score+%3D+round%28avg%28Val%29%2C+2%29&var-tenantId=53b9a01f-254a-4f35-a551-cc15f67d983e&var-rg=P500_React&from=1666317876489&to=1666318776489&kiosk" 
 * 
 * 歷史版本-V2
 * src="https://20.243.219.197:3000/d/AzVmInsightsByRG/azure-insights-virtual-machines-by-resource-group?orgId=1&var-ds=Azure+Monitor&var-sub=3ff1c84b-a716-46fd-bdc0-0a7ea7ddc6ea&var-rg=P500_React&var-agg=score%3D+round%28percentile%28Val%2C+5%29%2C+2%29&var-tenantId=53b9a01f-254a-4f35-a551-cc15f67d983e&from=1666764182990&to=1666765082990&kiosk"
 * 
 * 歷史版本-V3
 * src="https://20.243.219.197:3000/d/kJmyScN4z/azure-insights-virtual-machines-by-resource-group-copy?orgId=1&from=1666764628640&to=1666765528640&kiosk"
 * 
 * 歷史版本-V4
 * src="https://grafana.metaage.pro:3000/d/qUH4_ov4k/azure-insights-vm-group?var-ds=Azure+Monitor&var-sub=3ff1c84b-a716-46fd-bdc0-0a7ea7ddc6ea&var-rg=P500_React&var-agg=score+%3D+round%28avg%28Val%29%2C+2%29&var-tenantId=53b9a01f-254a-4f35-a551-cc15f67d983e&from=1667958453686&to=1667959353686&orgId=1&kiosk"
 * 
 * 歷史版本-V5
 * src="https://grafana.metaage.pro:3000/d/qUH4_ov4k/azure-insights-vm-group?var-ds=Azure%20Monitor&var-sub=3ff1c84b-a716-46fd-bdc0-0a7ea7ddc6ea&var-rg=P500_React&var-agg=score%20%3D%20round%28avg%28Val%29,%202%29&var-tenantId=53b9a01f-254a-4f35-a551-cc15f67d983e&from=now-5m&to=now&orgId=1&kiosk"
 * 
 */
/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Buttons from "views/Components/Buttons.js";
import GridSystem from "views/Components/GridSystem.js";
import Panels from "views/Components/Panels.js";
import SweetAlert from "views/Components/SweetAlertPage.js";
import Notifications from "views/Components/Notifications.js";
import Icons from "views/Components/Icons.js";
import Typography from "views/Components/Typography.js";
import RegularForms from "views/Forms/RegularForms.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ValidationForms from "views/Forms/ValidationForms.js";
import Wizard from "views/Forms/Wizard/Wizard.js";
import RegularTables from "views/Tables/RegularTables.js";
import ExtendedTables from "views/Tables/ExtendedTables.js";
import ReactTables from "views/Tables/ReactTables.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import VectorMap from "views/Maps/VectorMap.js";
import Charts from "views/Charts.js";
import Calendar from "views/Calendar.js";
import UserPage from "views/Pages/UserPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";

import ServiceRequest from "views/OnlineSupport/ServiceRequest/ServiceRequest";
import ServiceList from "views/OnlineSupport/iTopService/ServiceList";
import ServiceDetail from "views/OnlineSupport/iTopService/ServiceDetail/ServiceDetail";
import CreateServiceSupport from "views/OnlineSupport/iTopService/CreateServiceSupport";
import Billing from "views/BillingManagement/Billing/Billing";
import Consumption from "views/BillingManagement/Consumption/Consumption";

import UpdateInfo from "views/SystemEvent/UpdateInfo/UpdateInfo";
import AutoProvision from "views/ServiceManagement/AutoProvision/AutoProvision";
import ResourceMonitor from "views/ServiceManagement/ResourceMonitor/ResourceMonitor";
import StorageResourceMonitor from "views/ServiceManagement/StorageResourceMonitor/StorageResourceMonitor";
import GroupResourceMonitor from "views/ServiceManagement/GroupResourceMonitor/GroupResourceMonitor";
import AlertResourceMonitor from "views/ServiceManagement/AlertResourceMonitor/AlertResourceMonitor";
import RoleAuth from "views/IdentifyDomain/RoleAuth/RoleAuth";
import RGUpdateInfo from "views/ResourceGroup/UpdateInfo/UpdateInfo";
import Forecast from "views/BillingManagement/Forecast/Forecast";
import Analysis from "views/BillingManagement/Analysis/Analysis";
import ServiceStorage from "views/ServiceManagement/ServiceStorage/ServiceStorage";
import LineSetting from "views/Setting/LineSetting/LineSetting";

import Continued from "Continued";
import ShowPowerBI from "views/PowerBI/ShowPowerBI";

let routes = [
  {
    path: "/dashboard",
    layout: "/admin",
    name: "Dashboard",
    icon: "nc-icon nc-tv-2",
    // component: ResourceMonitor
    // component: ShowPowerBI
    component: Dashboard
  },
  {
    path: "/AuthManagement",
    layout: "/admin",
    name: "權限管理",
    icon: "nc-icon nc-layers-3",
    component: Dashboard
  },
  {
    collapse: true,
    path: "/AccountOverview",
    name: "帳號總覽",
    state: "openAccountOverview",
    icon: "nc-icon nc-circle-09",
    views: [
      {
        path: "/AzureContract",
        layout: "/admin",
        name: "Azure合約資訊",
        mini: "B",
        miniIcon: "nc-icon nc-stre-right",
        component: Continued
      },
    ]
  },
  {
    collapse: true,
    path: "/ServiceManagement",
    name: "服務管理",
    state: "openServiceManagement",
    icon: "nc-icon nc-notes",
    views: [
      {
        path: "/ResourceMonitor",
        layout: "/admin",
        name: "雲端主機資源監控",
        mini: "B",
        component: ResourceMonitor
      },
      {
        path: "/StorageResourceMonitor",
        layout: "/admin",
        name: "儲存資源監控",
        mini: "B",
        component: StorageResourceMonitor
      },
      {
        path: "/GroupResourceMonitor",
        layout: "/admin",
        name: "資源群組總覽",
        mini: "B",
        component: GroupResourceMonitor
      },
      {
        path: "/AlertResourceMonitor",
        layout: "/admin",
        name: "警報消耗量",
        mini: "B",
        component: AlertResourceMonitor
      },
      {
        path: "/AutoProvision",
        layout: "/admin",
        name: "自動化佈署",
        mini: "B",
        component: AutoProvision
      }
    ]
  },
  {
    collapse: true,
    path: "/SystemEvent",
    name: "系統事件",
    state: "openSystemEvent",
    icon: "nc-icon nc-bullet-list-67",
    views: [
      {
        path: "/UpdateInfo",
        layout: "/admin",
        name: "系統狀態、事件及更新訊息",
        mini: "B",
        // component: UpdateInfo
        component: Continued
      }
    ]
  },
  {
    collapse: true,
    path: "/BillingManagement",
    name: "帳務管理",
    state: "openBillingManagement",
    icon: "nc-icon nc-credit-card",
    views: [
      {
        path: "/Forecast",
        layout: "/admin",
        name: "成本預測",
        mini: "B",
        component: Forecast
      },
      {
        path: "/Analysis",
        layout: "/admin",
        name: "成本分析",
        mini: "B",
        component: Analysis
        // component: Continued
      },
      {
        path: "/Billing",
        layout: "/admin",
        name: "歷史帳務",
        mini: "B",
        component: Billing
      },
      {
        path: "/Consumption",
        layout: "/admin",
        name: "每日費用",
        mini: "B",
        component: Consumption
      },
      {
        path: "/BlobStorage",
        layout: "/admin",
        name: "BlobStorage儲存體每日用量",
        mini: "B",
        component: ServiceStorage
      }
    ]
  },
  {
    collapse: true,
    path: "/AduitTrail",
    name: "稽核紀錄",
    state: "openAduitTrail",
    icon: "nc-icon nc-paper-2",
    views: [
      {
        path: "/JSON",
        layout: "/admin",
        name: "稽核記錄下載(JSON)",
        mini: "B",
        component: Continued
      }
    ]
  },
  {
    collapse: true,
    path: "/SecurityProtect",
    name: "資安防護",
    state: "openAduitTrail",
    icon: "nc-icon nc-umbrella-13",
    views: [
      {
        path: "/AIScan",
        layout: "/admin",
        name: "AI 弱點掃描",
        mini: "B",
        component: Continued
      },
      {
        path: "/AISecurity",
        layout: "/admin",
        name: "AI 資安評比",
        mini: "B",
        component: Continued
      }
    ]
  },
  {
    collapse: true,
    path: "/IdentifyDomain",
    name: "身分識別",
    state: "openIdentifyDomain",
    icon: "nc-icon nc-badge",
    views: [
      {
        path: "/RoleAuth",
        layout: "/admin",
        name: "使用者",
        mini: "B",
        component: RoleAuth
      },
      {
        path: "/RGUpdateInfo",
        layout: "/admin",
        name: "群組",
        mini: "B",
        component: RGUpdateInfo
      }
    ]
  },
  {
    collapse: true,
    path: "/ResourceGroup",
    name: "資源群組",
    state: "openResourceGroup",
    icon: "nc-icon nc-app",
    views: [
      // {
      //   path: "/RGUpdateInfo",
      //   layout: "/admin",
      //   name: "群組管理與統計",
      //   mini: "B",
      //   component: RGUpdateInfo
      // }
    ]
  },
  {
    collapse: true,
    path: "/OnlineSupport",
    name: "線上支援",
    state: "openOnlineSupport",
    icon: "nc-icon nc-chat-round",
    views: [
      // {
      //   path: "/ServiceRequest",
      //   layout: "/admin",
      //   name: "服務請求",
      //   mini: "B",
      //   component: ServiceRequest
      // },
      // {
      //   path: "/AIAssistant",
      //   layout: "/admin",
      //   name: "小A智能助手",
      //   mini: "B",
      //   component: Continued
      // },
      {
        path: "/iTopServiceList",
        layout: "/admin",
        name: "服務列表",
        mini: "B",
        component: ServiceList
      },
      {
        path: "/iTopServiceDetail/:id",
        layout: "/admin",
        name: "服務詳情",
        mini: "B",
        component: ServiceDetail
      },
      {
        path: "/iTopCreateServiceSupport",
        layout: "/admin",
        name: "建立服務請求",
        mini: "B",
        component: CreateServiceSupport
      },
    ]
  },
  {
    collapse: true,
    path: "/setting",
    name: "系統設置",
    state: "setting",
    icon: "nc-icon nc-settings-gear-64",
    views: [
      {
        path: "/line-setting",
        layout: "/admin",
        name: "LINE設定",
        mini: "B",
        component: LineSetting
      },
      {
        path: "/test-setting",
        layout: "/admin",
        name: "TEST設定",
        mini: "B",
        component: LineSetting
      },
    ]
  }
]
console.log('routes.js',routes);
export default routes;

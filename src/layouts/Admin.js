import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
// core components
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
// dinamically create dashboard routes
import routes from "../routes.js";
// 背景圖片
import image1 from "assets/img/full-screen-image-1.jpg";
import image2 from "assets/img/full-screen-image-2.jpg";
import image3 from "assets/img/full-screen-image-3.jpg";
import image4 from "assets/img/full-screen-image-4.jpg";
// 撈api
import axios from "axios";
// Redux
import { useDispatch } from "react-redux";
import { redexUserId } from "ReduxStore/slice/loginSlice";
import { UserInfo } from "ReduxStore/slice/userSlice";
// AADB2C
import { useMsal } from "@azure/msal-react";

function Admin() {
  
  // Redux
  const dispatch = useDispatch();
  // AADB2C驗證成功後取得使用著資訊
  const { accounts } = useMsal();
  const [name, setName] = useState();
  const [openId, setOpenId] = useState();
  const [customerTenantId, setCustomerTenantId] = useState();
  const [userGroup, setUserGroup] = useState();
  const [companyOrgId, setCompanyOrgId] = useState();//iTop用，撈特定客戶Ticket
  const [companyUserID, setCompanyUserID] = useState();//iTop用，分辨PublicLog
  useEffect(() => {
    axios
      .get(`https://api.metaage.pro/api/User/${accounts[0].localAccountId}`)
      .then((res) => {
        console.log('登入資訊',res);
        // 取得User權限資訊
        setName(res.data[0].userName);
        setOpenId(res.data[0].userOpenID);
        setCustomerTenantId(res.data[0].userCompanyID);
        setUserGroup(res.data[0].groupName);
        setCompanyOrgId(res.data[0].companyOrgId);
        setCompanyUserID(res.data[0].companyUserID);

        // redux
        dispatch(redexUserId(res.data[0].userOpenID));
        dispatch(
          UserInfo({
            CustomerTenantId: res.data[0].userCompanyID,
            UserGroup: res.data[0].groupName,
            CompanyOrgId: res.data[0].companyOrgId,
            CompanyUserID: res.data[0].companyUserID,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 背景圖片
  const [sidebarImage, setSidebarImage] = React.useState(image3);
  const [sidebarBackground, setSidebarBackground] = React.useState("black");
  // 收集選單
  const [filterPage, setFilterPage] = useState([]);
  let _collectPage = [];
  // 收集子選單
  const [filterSubPage, setFilterSubPage] = useState([]);
  let _collectSubPage = [];
  useEffect(() => {
    if (openId) {
      axios
        .get(`https://api.metaage.pro/api/UserMenu/${openId}`) // https://api.metaage.pro/api/UserMenu/7c8b4abc-9742-4570-a3ff-21d364c71a1d
        .then((res) => {
          
          res.data.userMenuSelectDto.forEach((r) => {
            // 收集選單
            _collectPage.push(r.pageName);
            // 收集子選單
            r.userMenuDetail.forEach((r) => {
              // if(!_collectSubPage.includes(r.subPageName)){_collectSubPage.push(r.subPageName)}
              _collectSubPage.push(r.subPageName);
            });
          });
          setFilterPage(_collectPage);
          setFilterSubPage(_collectSubPage);
        })
        .catch((err) => {
          console.log("err :", err);
        });
    }
  }, [openId]);

  const [filterPageBefore, setFilterPageBefore] = useState([]);
  useEffect(() => {
    let _filterPageBeforeImport = [];
    routes.forEach((route) => {
      let viewsRoute = [];
      if (route.views) {
        route.views.forEach((r) => {
          if (filterSubPage.includes(r.name)) {
            viewsRoute.push(r);
          }
        });
      }
      if (filterPage.includes(route.name)) {
        let tempRoute = Object.assign({}, route);
        tempRoute.views = viewsRoute;
        _filterPageBeforeImport.push(tempRoute);
      }
      setFilterPageBefore(_filterPageBeforeImport);
    });
  }, [filterPage]);

  const getRoutes = () => {
    let routeArray = [];
    routes.forEach((r, key) => {
      if (r.collapse && r.views.length > 0) {
        routeArray.push(...r.views);
      } else {
        routeArray.push(r);
      }
    });

    return routeArray.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.layout + prop.path} key={key}>
            <prop.component
              openId={openId}
              customerTenantId={customerTenantId}
              userGroup={userGroup}
            />
          </Route>
        );
      }
    });
    // return routes.map((prop, key) => {
    //   if (prop.collapse) {
    //     return getRoutes(prop.views);
    //   }
    //   if (prop.layout === "/admin") {
    //     return (
    //       <Route
    //         path={prop.layout + prop.path}
    //         key={key}
    //       >
    //         <prop.component openId={openId} customerTenantId={customerTenantId} userGroup={userGroup}/>
    //       </Route>
    //     );
    //   } else {
    //     return null;
    //   }
    // });
  };
  return (
    <>
      {/* 在這裡加上overflowY，就不會產生不同分頁因為長度不同時，自動生成scrollbar的寬度差距 */}
      <div className="wrapper" style={{ overflowY: "scroll" }}>
        <Sidebar
          routes={filterPageBefore}
          image={sidebarImage}
          background={sidebarBackground}
          userId={name}
          filterSubPage={filterSubPage}
        />
        <div className="main-panel">
          <AdminNavbar />
          <div className="content">
            <Switch>{getRoutes()}</Switch>
          </div>
        </div>
      </div>
      {/* <FixedPlugin
        setSidebarImageParent={(value) => setSidebarImage(value)}
        sidebarDefaultImage={sidebarImage}
        sidebarImages={[image1, image2, image3, image4]}
        backgroundColors={[
          "black",
          "azure",
          "green",
          "orange",
          "red",
          "purple",
        ]}
        backgroundColor={sidebarBackground}
        setSidebarBackgroundParent={(value) => setSidebarBackground(value)}
      /> */}
    </>
  );
}

export default Admin;

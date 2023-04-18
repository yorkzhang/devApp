import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Nav,
  Tab,
  TabContent,
  TabPane,
} from "react-bootstrap";
import axios from "axios";
import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
} from "react-router-dom";
// Redux
import { useSelector } from "react-redux";
import { selectUser } from "ReduxStore/slice/userSlice";
// core components
import ReactTable from "components/ReactTable/ReactTable.js";

export default function ServiceList() {
  const history = useHistory(); //轉址用
  // 從登入後取得的User權限資訊--TenantID、Group、CompanyOrgId
  const TenantID_Group = useSelector(selectUser);
  let tenantId = TenantID_Group.userInfo.CustomerTenantId;
  let group = TenantID_Group.userInfo.UserGroup;
  let CompanyOrgId = TenantID_Group.userInfo.CompanyOrgId;

  const [TicketData, setTicketData] = useState([]);
  const [OngolinDataTable, setOngolinDataTable] = useState([]);
  const [ResolvedDataTable, setResolvedDataTable] = useState([]);

  

  useEffect(() => {
    console.log("router測試");
    if (CompanyOrgId) {
      GetUserTickets();
    }
  }, [Router, CompanyOrgId]);

  useEffect(() => {
    if (!TicketData) return null;
    let tempOngolinDataTable = [...OngolinDataTable];
    let tempResolvedDataTable = [...ResolvedDataTable];
    TicketData.forEach((item, key) => {
      let tempData = {
        id: item.key,
        ref: item.fields.ref,
        title: item.fields.title,
        start_date: item.fields.start_date,
        status: TranslateStatus(item.fields.operational_status),
        category: item.fields.service_name,
        subcategory: item.fields.servicesubcategory_name,
        // priority:  item.fields.title,
        // caller:  item.fields.caller_name,
        actions: (
          // we've added some custom button actions
          <div className="actions-center">
            <Button
              onClick={() => {
                history.push(`/admin/iTopServiceDetail/${item.fields.ref}`);
              }}
              className=" btn-outline"
              type="button"
              variant="success"
            >
              詳細
            </Button>
          </div>
        ),
      };

      if (item.fields.operational_status == "ongoing") {
        //進行中
        tempOngolinDataTable.push(tempData);
      } else {
        //已結案、已關閉
        tempResolvedDataTable.push(tempData);
      }
      
    });

    setOngolinDataTable(tempOngolinDataTable)
    setResolvedDataTable(tempResolvedDataTable)
  }, [TicketData]);
  
  
  const GetUserTickets = async () => {
    let res = await axios
      .get(
        `https://api.metaage.pro/api/ITOPTicketing/GetUserRequestORG?QureyUserRequestORG=${CompanyOrgId}`
      )
      .catch((err) => {
        console.log(err.response.data);
      });
    if (res.data.success) {
      console.log(res.data.res);
      setTicketData(res.data.res);
    }
  };

  const TranslateStatus = (status) =>{
    switch(status){
      case 'ongoing':
        return '處理中'
      case 'resolved':
        return '已解決'
      case 'closed':
        return '已關閉'
      default:
        return '無資訊'
    }
  }

  return (
    <Container fluid className="wrap-request">
      <Card>
        <Card.Header>
          <Card.Title as="h4">支援列表</Card.Title>
        </Card.Header>
        <Card.Body>
          <Tab.Container id="plain-tabs-example" defaultActiveKey="ing">
            <Nav role="tablist" variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="ing" className="text-success">
                  進行中
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="finish" className="text-success">
                  已結案
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="ing">
                <ReactTable
                  data={OngolinDataTable}
                  columns={[
                    {
                      Header: "編號",
                      accessor: "ref",
                    },
                    {
                      Header: "標題",
                      accessor: "title",
                    },
                    {
                      Header: "日期",
                      accessor: "start_date",
                    },
                    {
                      Header: "狀態",
                      accessor: "status",
                    },
                    {
                      Header: "分類",
                      accessor: "category",
                    },
                    {
                      Header: "子分類",
                      accessor: "subcategory",
                    },
                    {
                      Header: "詳細",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                      HeadPosition: "center",
                    },
                  ]}
                  /*
                    You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                  */
                  className="-striped -highlight primary-pagination"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="finish">
                <ReactTable
                  data={ResolvedDataTable}
                  columns={[
                    {
                      Header: "編號",
                      accessor: "ref",
                    },
                    {
                      Header: "標題",
                      accessor: "title",
                    },
                    {
                      Header: "日期",
                      accessor: "start_date",
                    },
                    {
                      Header: "狀態",
                      accessor: "status",
                    },
                    {
                      Header: "分類",
                      accessor: "category",
                    },
                    {
                      Header: "子分類",
                      accessor: "subcategory",
                    },
                    {
                      Header: "詳細",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                      HeadPosition: "center",
                    },
                  ]}
                  /*
                    You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                  */
                  className="-striped -highlight primary-pagination"
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
}
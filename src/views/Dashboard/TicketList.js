import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
  Container,
  Row,
  Col,
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

export default function TicketList() {
  const history = useHistory(); //轉址用
  // 從登入後取得的User權限資訊--TenantID、Group、CompanyOrgId
  const TenantID_Group = useSelector(selectUser);
  let tenantId = TenantID_Group.userInfo.CustomerTenantId;
  let group = TenantID_Group.userInfo.UserGroup;
  let CompanyOrgId = TenantID_Group.userInfo.CompanyOrgId;

  const [TicketData, setTicketData] = useState([]);

  useEffect(() => {
    console.log("router測試");
    if (CompanyOrgId) {
      GetUserTickets();
    }
  }, [Router, CompanyOrgId]);

  const GetUserTickets = async () => {
    let res = await axios
      .get(
        `https://api.metaage.pro/api/ITOPTicketing/GetUserRequestORG?QureyUserRequestORG=${CompanyOrgId}&Querylimit=3`
      )
      .catch((err) => {
        console.log(err.response.data);
      });
    if (res.data.success) {
      console.log(res.data.res);
      setTicketData(res.data.res);
    }
  };

  return (
    <>
      <div className="table-full-width">
        <Table style={{ width: "100%" }}>
          <tbody>
            {TicketData
              ? TicketData.map((item) => (
                  <tr key={item.key}>
                    <td style={{ width: "100%", fontSize: "1.1rem" }}>
                      {item.fields.title}
                    </td>
                    <td className="text-center" style={{ minWidth: "80px" }}>
                      <Button
                        onClick={() => {
                          history.push(
                            `/admin/iTopServiceDetail/${item.fields.ref}`
                          );
                        }}
                        style={{ fontSize: "1.1rem" }}
                        className=" btn-outline mx-auto "
                        type="button"
                        variant="success"
                      >
                        詳細
                      </Button>
                    </td>
                  </tr>
                ))
              : null}
            {/*<tr>
              <td>Azure Virtual Machine開不了，是否有專人可以給予協助修復?</td>
              <td className="td-actions text-right"></td>
            </tr>
             <tr>
              <td>我的登入權限應該是Admin，怎麼會看不到帳單?</td>
              <td className="td-actions text-right">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-746544352">Edit Task..</Tooltip>
                  }
                  placement="top"
                >
                  <Button
                    className="btn-simple btn-link"
                    type="button"
                    variant="info"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={<Tooltip id="tooltip-743037005">Remove..</Tooltip>}
                  placement="top"
                >
                  <Button
                    className="btn-simple btn-link"
                    type="button"
                    variant="danger"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
            <tr>
              <td>近期因為部門需求會增加訂閱帳戶，新增的資訊要怎麼查看?</td>
              <td className="td-actions text-right">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-855684210">Edit Task..</Tooltip>
                  }
                  placement="top"
                >
                  <Button
                    className="btn-simple btn-link"
                    type="button"
                    variant="info"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={<Tooltip id="tooltip-242945902">Remove..</Tooltip>}
                  placement="top"
                >
                  <Button
                    className="btn-simple btn-link"
                    type="button"
                    variant="danger"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </OverlayTrigger>
              </td>
            </tr> */}
          </tbody>
        </Table>
      </div>
    </>
  );
}

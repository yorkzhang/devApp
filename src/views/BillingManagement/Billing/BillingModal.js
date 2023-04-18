import React, { useEffect, useState } from 'react'
// react-bootstrap components
import { Button, Card, Modal, Container, Row, Col, } from "react-bootstrap";
import axios from 'axios'

// Redux
import { useSelector } from "react-redux";
import { selectUser } from 'ReduxStore/slice/userSlice';

const BillingModal = (props) =>{
    // 加千分號
    const AddThousandSign = (num) =>{
        return num? num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : ''
    }
    // 從登入後取得的User權限資訊--TenantID、Group
    const TenantID_Group = useSelector(selectUser)
    let tenantId = TenantID_Group.userInfo.CustomerTenantId
    // 父層觸發(打開/關閉)彈出視窗
    let modal = props.modal
    let setModal = props.setModal
    // 收集點選到的service內部的細項
    let _collectDetail = []
    const [collectDetail, setCollectDetail] = useState([])
    useEffect(()=>{
        const BillingAmount = async()=>{
            let getInfo = await axios
                // .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountMasterServiceDetail?QureyCustomerTenantId=0beb142b-d676-4cba-acb5-ea490570c519&QueryCDate=202208&QureyServicename=Storage&QuerySubscriptionID=269c083b-d7ec-41a7-97e2-876b2f8be41f&QueryResourGroup=humax`)
                .get(`https://api.metaage.pro/api/AzureBillingAmount/V1/GetBillingAmountMasterServiceDetail?QureyCustomerTenantId=${tenantId}&QueryCDate=${props.dropDownS.month}&QureyServicename=${props.storeDetail.meterCategory !== ''? props.storeDetail.meterCategory: ''}&QuerySubscriptionID=${props.dropDownS.subscription !== ''? props.dropDownS.subscription: ''}&QueryResourGroup=${props.dropDownS.group !== ''? props.dropDownS.group: ''}`)
                .catch((err)=>{console.log(err)})

                // 收集表單資料
                if(getInfo){
                    getInfo.data.map((res)=>{
                        if(!_collectDetail.includes(res.product)){_collectDetail.push({
                            product: res.product,
                            unitOfMeasure: res.unitOfMeasure,
                            costAuount: AddThousandSign(res.costAuount.toFixed(0))
                        })}
                    })
                }
                setCollectDetail(_collectDetail)
            }
        BillingAmount()
    },[props.dropDownS.month, props.storeDetail.meterCategory, props.dropDownS.subscription, props.dropDownS.group])

    return(
        <>
            <div
            onHide={() => setModal(!modal)}
            show={modal}
            onClick={()=>{setModal(!modal)}}
            style={{
                backgroundColor:'rgba(0,0,0,0.25)', 
                display: !modal? 'none':'',
                zIndex:'1050', 
                width:"100vw", 
                height:'100vh', 
                position:'fixed',
                left:'0px', 
                top:'0px', 
                padding:'0 20%'
                }}
            >
                <div style={{
                    // backgroundColor:'rgba(255,255,255,1)', 
                    backgroundColor:'rgba(255,255,255,.8)', 
                    backdropFilter: 'blur(5px)',
                    display:'flex', 
                    flexDirection:'column', 
                    alignItems:'center',
                    // top:'5rem',
                    top:'5%',
                    position:'relative',
                    overflowX:'scroll',
                    height:'90%'
                    }}
                >
                    <Modal.Header className="justify-content-center pb-0">
                        <div>{`${props.storeDetail.meterCategory} - 明細報表`}</div>
                    </Modal.Header>
                    <Modal.Body className="text-center" style={{width:'100%'}}>
                        <Container fluid >
                            <Row>
                                <Col>
                                    <Card.Body className="table-responsive px-5">
                                        <table className="table table-hover">
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col-5">服務項目</th>
                                                    <th scope="col-2"></th>
                                                    <th scope="col">{props.storeDetail.meterCategory}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row" className="col-5">公司名稱</th>
                                                    <th scope="row" className="col-2"></th>
                                                    <td className="text-center col">{props.colCompany.length > 0? props.colCompany[0].Name: null}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="col-5">帳單月份</th>
                                                    <th scope="row" className="col-2"></th>
                                                    <td className="text-center col">{props.dropDownS.month}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="col-5">訂閱帳戶</th>
                                                    <th scope="row" className="col-2"></th>
                                                    <td className="text-center col">{props.dropDownS.subscription !== ''? props.dropDownS.subscription: 'ALL'}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="col-5">資源群組</th>
                                                    <th scope="row" className="col-2"></th>
                                                    <td className="text-center col">{props.dropDownS.group !== ''? props.dropDownS.group: 'ALL'}</td>
                                                </tr>
                                                
                                                <tr>
                                                    <th scope="row" className="col-5">細項金額(NTD)</th>
                                                    <th scope="row" className="col-2"></th>
                                                    <td className="text-right col" style={{fontSize:'1rem'}}>{props.storeDetail && props.storeDetail.sumBilling? AddThousandSign(props.storeDetail.sumBilling.toFixed(0)): null} </td>
                                                </tr>
                                            </tbody>

                                            {/* 細項 */}
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col-5">細項</th>
                                                    <th scope="col-2">容量</th>
                                                    <th scope="col">金額(NTD)</th>
                                                </tr>
                                            </thead>
                                            {collectDetail.map((res)=>{
                                                return(
                                                    <tr>
                                                        <th scope="row" className="col-8" style={{fontSize:'0.85rem'}}>{res.product}</th>
                                                        <th scope="row" className="col-2" style={{fontSize:'0.85rem'}}>{res.unitOfMeasure}</th>
                                                        <td className="text-right col" style={{fontSize:'0.85rem'}}>{res.costAuount}</td>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button>關閉</Button>
                                    </Card.Footer>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </div>
            </div>
        </>
    )
}

export default BillingModal
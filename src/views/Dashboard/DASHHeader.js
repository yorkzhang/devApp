import React , {useState, useEffect} from 'react'
// react-bootstrap components
import { Card, Row, Col } from "react-bootstrap";
import axios from 'axios'
// Redux
import { useSelector } from 'react-redux'
import { selectUser } from 'ReduxStore/slice/userSlice';

const DASHHeader = () =>{
    
    // Redux取得User權限資訊
    const UserInfo = useSelector(selectUser)
    const CustomerTenantId = UserInfo.userInfo.CustomerTenantId

    // 透過User資訊取得所有訂閱帳戶數量、租用戶數量
    const [tenantNum, setTenantNum] = useState()
    const [subscriptionNum, setSubscriptionNum] = useState()
    const [blobStorageNum, setBlobStorageNum] = useState()
    useEffect(()=>{
        axios.get(`https://api.metaage.pro/api/DashBoard/GetCountSubscription?QureyCustomerTenantId=${CustomerTenantId}`)
        .then((res)=>{
            setSubscriptionNum(res.data[0].countSubscription)
        })
        .catch((err)=>{console.log(err)})
    },[])
    useEffect(()=>{
        const GetTenantNumAndSubscriptionNum = async() =>{
            let res = await axios.get(`https://api.metaage.pro/api/DashBoard/GetCountSubscription?QureyCustomerTenantId=${CustomerTenantId}`)
                        .catch((err)=>{console.log(err)})
            let res2 = await axios.get(`https://api.metaage.pro/api/DashBoard/GetCountTenant?QureyCustomerTenantId=${CustomerTenantId}`)
                        .catch((err)=>{console.log(err)})
            let res3 = await axios.get(`https://api.metaage.pro/api/DashBoard/GetBlobStorageCapacity?QureyCustomerTenantId=${CustomerTenantId}`)
            setSubscriptionNum(res.data[0].countSubscription)
            setTenantNum(res2.data[0].countTenantId)
            setBlobStorageNum(res3.data[0].capacity)
        }
        if(CustomerTenantId){
            GetTenantNumAndSubscriptionNum()
        }
    },[CustomerTenantId])

    return(
        <>
        <Col lg="3" sm="6">
            <Card className="card-stats">
                <Card.Body>
                    <Row>
                    <Col xs="2">
                        <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-chart text-warning"></i>
                        </div>
                    </Col>
                    <Col xs="10">
                        <div className="numbers">
                        <p className="card-category">租用戶</p>
                        <Card.Title as="h4">{tenantNum !== undefined? tenantNum: '0'}</Card.Title>
                        </div>
                    </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                    <i className="fas fa-redo mr-1"></i>
                    刷新
                    </div>
                </Card.Footer>
                </Card>
            </Col>
            <Col lg="3" sm="6">
                <Card className="card-stats">
                <Card.Body>
                    <Row>
                    <Col xs="5">
                        <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-light-3 text-success"></i>
                        </div>
                    </Col>
                    <Col xs="7">
                        <div className="numbers">
                        <p className="card-category">訂閱帳戶</p>
                        <Card.Title as="h4">{subscriptionNum !== undefined?　subscriptionNum: 0}</Card.Title>
                        </div>
                    </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                    <i className="far fa-calendar-alt mr-1"></i>
                    刷新
                    </div>
                </Card.Footer>
                </Card>
            </Col>
            <Col lg="3" sm="6">
                <Card className="card-stats">
                <Card.Body>
                    <Row>
                    <Col xs="4">
                        <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-tablet-2 text-dark"></i>
                        </div>
                    </Col>
                    <Col xs="8">
                        <div className="numbers d-flex flex-r">
                            <div className='mx-1 w-100'>
                                <p className="card-category">Blob</p>
                                <p className="card-category">Storage</p>
                                <Card.Title as="h4">{blobStorageNum}G</Card.Title>
                            </div>
                            <div className='mx-1 w-100'>
                                <p className="card-category">File</p>
                                <p className="card-category">Storage</p>
                                <Card.Title as="h4">0G</Card.Title>
                            </div>
                        </div>
                    </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                    <i className="far fa-clock-o mr-1"></i>
                    已更新
                    </div>
                </Card.Footer>
                </Card>
            </Col>
            <Col lg="3" sm="6">
                <Card className="card-stats">
                <Card.Body>
                    <Row>
                    <Col xs="5">
                        <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-favourite-28 text-primary"></i>
                        </div>
                    </Col>
                    <Col xs="7">
                        <div className="numbers">
                        <p className="card-category">服務狀態警示</p>
                        <Card.Title as="h4">0</Card.Title>
                        </div>
                    </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <hr></hr>
                    <div className="stats">
                    <i className="fas fa-redo mr-1"></i>
                    刷新
                    </div>
                </Card.Footer>
            </Card>
        </Col>
        </>
    )
}

export default DASHHeader
import React from 'react'
// react-bootstrap components
import { Button, Card, Row, Col, Table } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

const AutoStorage =()=>{

    // bootstrap class
    var _formCol = {
        item:'col-3 ', 
        subscription:'col-7', 
        input:'col-12'
    }

    // [模板功能]
    const [alert, setAlert] = React.useState(null);
    const autoCloseAlert = () => {
        console.log("hey")
        setAlert(
        <SweetAlert
            style={{ display: "block", marginTop: "-100px" }}
            title="資料已送出!"
            onConfirm={() => hideAlert()}
            showConfirm={false}
        >
            {/* <h4>資料已送出</h4> */}
        </SweetAlert>
        );
        setTimeout(() => {
        setAlert(null);
        }, 1000);
    };


    return(

        <>
        {alert}
        <div className="wrap-autobackup">
            <Card.Header>
            <Card.Title as="h4">Create a Standard Storage Account</Card.Title>
            {/* <p className="category">More information here</p> */}
            </Card.Header>
            <Card.Body>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className={`${_formCol.item}`}>參數名稱</th>
                            <th className={`${_formCol.subscription}`}>說明</th>
                            <th className={`${_formCol.input}`}>輸入</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr >
                            <td className={`${_formCol.item}`}>storageAccountType</td>
                            <td className={`${_formCol.subscription}`}>Storage Account type</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}}onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        
                        <tr className="success">
                            <td className={`${_formCol.item}`}>location</td>
                            <td className={`${_formCol.subscription}`}>Location for the storage account.</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}}onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>storageAccountName</td>
                            <td className={`${_formCol.subscription}`}>The name of the Storage Account</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        
                    </tbody>
                </Table>
            </Card.Body>

            <Card.Footer>
                <Row>
                    <Button className="btn btn-success btn-l ml-auto mr-3" onClick={()=>{
                        autoCloseAlert()
                    }}>送出</Button>
                </Row>
            </Card.Footer>
        </div>
        </>
    )
}

export default AutoStorage
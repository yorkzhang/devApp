import React from 'react'
// react-bootstrap components
import { Button, Card, Row, Table } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

const AutoDatabase =()=>{
    
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
            <Card.Title as="h4">Create a SQL Server and Database</Card.Title>
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
                            <td className={`${_formCol.item}`}>serverName</td>
                            <td className={`${_formCol.subscription}`}>The name of the SQL logical server.</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}}onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        
                        <tr className="success">
                            <td className={`${_formCol.item}`}>sqlDBName</td>
                            <td className={`${_formCol.subscription}`}>The name of the SQL Database.</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}}onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>location</td>
                            <td className={`${_formCol.subscription}`}>Location for all resources.</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr className="info">
                            <td className={`${_formCol.item}`}>administratorLogin</td>
                            <td className={`${_formCol.subscription}`}>The administrator username of the SQL logical server.</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>administratorLoginPassword</td>
                            <td className={`${_formCol.subscription}`}>The administrator password of the SQL logical server.</td>
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

export default AutoDatabase
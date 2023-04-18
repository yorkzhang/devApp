import React from 'react'
import "./_autobackup.scss"
// react-bootstrap components
import { Button, Card, Row, Table } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

const AutoBackup =()=>{

    // bootstrap class
    var _formCol = {
        item:'col-3 ', 
        subscription:'col-7', 
        input:'col-12'
    }
    
    // [模板功能]
    const [alert, setAlert] = React.useState(null);
    const autoCloseAlert = () => {
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
            <Card.Title as="h4">Azure Backup for Workload in Azure Virtual Machines</Card.Title>
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
                            <td className={`${_formCol.item}`}>vaultName</td>
                            <td className={`${_formCol.subscription}`}>Name of the Vault</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        
                        <tr className="success">
                            <td className={`${_formCol.item}`}>vmResourceGroup</td>
                            <td className={`${_formCol.subscription}`}>Resource group of Compute VM containing the workload</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>vmName</td>
                            <td className={`${_formCol.subscription}`}>Name of the Compute VM containing the workload</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr className="info">
                            <td className={`${_formCol.item}`}>policyName</td>
                            <td className={`${_formCol.subscription}`}>Backup Policy Name</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>databaseInstanceName</td>
                            <td className={`${_formCol.subscription}`}>Name of database server instance</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr className="danger">
                            <td className={`${_formCol.item}`}>databaseName</td>
                            <td className={`${_formCol.subscription}`}>Name of protectable data source i.e. Database Name</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>isNewVault</td>
                            <td className={`${_formCol.subscription}`}>Conditional parameter for New or Existing Vault</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr className="warning">
                            <td className={`${_formCol.item}`}>isNewPolicy</td>
                            <td className={`${_formCol.subscription}`}>Conditional parameter for New or Existing Backup Policy</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>workloadType</td>
                            <td className={`${_formCol.subscription}`}>Workload type which is installed in VM and Pre-Registration Steps are performed</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr className="success">
                            <td className={`${_formCol.item}`}>protectedItemType</td>
                            <td className={`${_formCol.subscription}`}>Protected Item (Database) type</td>
                            <td className={`${_formCol.input}`}><input style={{width:'100%'}} onChange={(e)=>{console.log(e.target.value)}}/></td>
                        </tr>
                        <tr>
                            <td className={`${_formCol.item}`}>location</td>
                            <td className={`${_formCol.subscription}`}>Location for all resources.</td>
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
        


























        // <>
        // <Card className="wrap-autobackup">
        //     <Card.Header>
        //     <Card.Title as="h4">Azure Backup for Workload in Azure Virtual Machines</Card.Title>
        //     {/* <p className="category">More information here</p> */}
        //     </Card.Header>
        //     <Card.Body>

        //         {/* 
        //             底下應該用map生成，至於輸入的部分，
                    
        //             資料格式 => { id: index, input: e.target.value}
                    
        //             id透過索引值比對，雖然key值都是input，但是內容可以不同
                    
        //             之後chart圖的就是，如果date不存在，就寫入，如果存在就填補
        //             if(!_arr.include(XXX)){_arr[key].value = XXX}

        //             如果完全不存在，就push一個新的

        //             並且再map之前就先把order整理過，這樣才不用map完才整理
        //         */}
        //         <Form className='m-3'>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>參數名稱</div>
        //                         <div className={`${_formCol.subscription}`}>說明</div>
        //                         {/* <div className={`${_formCol.input}`}>輸入</div> */}
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>vaultName</div>
        //                         <div className={`${_formCol.subscription}`}>Name of the Vault</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>vmResourceGroup</div>
        //                         <div className={`${_formCol.subscription}`}>Resource group of Compute VM containing the workload</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>vmName</div>
        //                         <div className={`${_formCol.subscription}`}>Name of the Compute VM containing the workload</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>policyName</div>
        //                         <div className={`${_formCol.subscription}`}>Backup Policy Name</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>databaseInstanceName</div>
        //                         <div className={`${_formCol.subscription}`}>Name of database server instance</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>databaseName</div>
        //                         <div className={`${_formCol.subscription}`}>Name of protectable data source i.e. Database Name</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>isNewVault</div>
        //                         <div className={`${_formCol.subscription}`}>Conditional parameter for New or Existing Vault</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>isNewPolicy</div>
        //                         <div className={`${_formCol.subscription}`}>Conditional parameter for New or Existing Backup Policy</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>workloadType</div>
        //                         <div className={`${_formCol.subscription}`}>Workload type which is installed in VM and Pre-Registration Steps are performed</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>protectedItemType</div>
        //                         <div className={`${_formCol.subscription}`}>Protected Item (Database) type</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
        //             <Form.Group>
        //                 <Row>
        //                     <div className="input-group">
        //                         <div className={`${_formCol.item}`}>location</div>
        //                         <div className={`${_formCol.subscription}`}>Location for all resources</div>
        //                         <input type="text" className={`${_formCol.input}`} placeholder="Username"/>
        //                     </div>
        //                 </Row>
        //             </Form.Group>
                    
        //         </Form>

        //         {/* <Table striped bordered hover> */}
        //         <Table bordered hover>
        //             <thead>
        //                 <tr>
        //                 <th>參數名稱</th>
        //                 <th>說明</th>
        //                 <th>輸入</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 <tr className="success">
        //                     <td>vaultName</td>
        //                     <td>Name of the Vault</td>
        //                     {/* <td style={{height:'100%'}}><input onChange={(e)=>{console.log(e.target.value)}}/></td> */}
        //                     {/* <td><input style={{margin:'0px'}} onChange={(e)=>{console.log(e.target.value)}}/></td> */}
        //                     {/* <input style={{width:'100%', margin:'0px'}} onChange={(e)=>{console.log(e.target.value)}}/> */}
        //                     {/* <td><input onChange={(e)=>{console.log(e.target.value)}}/></td> */}
        //                     <input onChange={(e)=>{console.log(e.target.value)}}/>
        //                 </tr>
                        
        //                 <tr className="success">
        //                     <td align="center">vmResourceGroup</td>
        //                     <td align="center">Resource group of Compute VM containing the workload</td>
        //                     <td align="center"><input style={{width:'100%'}}onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>

        //                 <tr>
        //                     <td>vmName</td>
        //                     <td>Name of the Compute VM containing the workload</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
                        
        //                 <tr>
        //                     <td>policyName</td>
        //                     <td>Backup Policy Name</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>databaseInstanceName</td>
        //                     <td>Name of database server instance</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>databaseName</td>
        //                     <td>Name of protectable data source i.e. Database Name</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>isNewVault</td>
        //                     <td>Conditional parameter for New or Existing Vault</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>isNewPolicy</td>
        //                     <td>Conditional parameter for New or Existing Backup Policy</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>workloadType</td>
        //                     <td>Workload type which is installed in VM and Pre-Registration Steps are performed</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>protectedItemType</td>
        //                     <td>Protected Item (Database) type</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
        //                 <tr>
        //                     <td>location</td>
        //                     <td>Location for all resources.</td>
        //                     <td><input onChange={(e)=>{console.log(e.target.value)}}/></td>
        //                 </tr>
                        
        //             </tbody>
        //         </Table>
        //     </Card.Body>
        // </Card>
        // </>
    )
}

export default AutoBackup
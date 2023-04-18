import React from 'react'
import { Link } from "react-router-dom";
const Continued = () =>{
    return(
        <>
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <main>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 align-self-center">
                            <h1>404</h1>
                            <h2>施工中...</h2>
                            <p>The page you are looking for does not exist.
                            How you got here is a mystery. But you can click the button below
                            to go back to the homepage.
                            </p>
                            <button>
                                <Link to="/admin/dashboard" style={{
                                    color:'black',
                                }}>回首頁
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </>
    )
}

export default Continued
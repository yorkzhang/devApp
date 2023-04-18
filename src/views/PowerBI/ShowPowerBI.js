import React from 'react'
import './_showpowerbi.scss'

const ShowPowerBI = () =>{
    return(
        <div className="wrap-powerbi">
        <iframe 
            class="iframe-bottom"
            title="1 - 第 1 頁" 
            src="https://app.powerbi.com/view?r=eyJrIjoiMDg5NTJhNTgtZGQ0NS00MTkzLTk3NGUtMzU1YWIzOTUzMDI4IiwidCI6IjM2OTBjNGY3LTIyYzgtNDRkYy04YjljLTc1YzAwYzE0NzczZiIsImMiOjR9" 
            frameborder="0"
            allowFullScreen="true"
        ></iframe>
        </div>
    )
}

export default ShowPowerBI
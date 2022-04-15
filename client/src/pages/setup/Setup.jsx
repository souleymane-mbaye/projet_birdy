import React from 'react'
import "./Setup.css"
import LogOptions from "../../components/logOptions/LogOptions"

function Setup() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className='home'>
        <img
           src={
                PF + "home.png"
            }
            alt=""
          />
        <LogOptions/>
    </div>
  )
}

export default Setup
import React from 'react'
import "./Setup.css"
import LogOptions from "../../components/logOptions/LogOptions"
import Home from "../../assets/home.png";


function Setup() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    console.log(PF,"PF");
  return (
    <div className='home'>
      
        <img
           src={
                Home
            }
            alt=""
          />
        <LogOptions/>
    </div>
  )
}

export default Setup
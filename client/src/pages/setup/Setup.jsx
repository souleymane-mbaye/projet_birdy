import React from 'react'
import "./Setup.css"
import LogOptions from "../../components/logOptions/LogOptions"
import Home from "../../assets/home.png";


function Setup() {
  return (
    <div className='home'>
      
        <img src={Home} alt="Birdy" />
        <LogOptions/>
    </div>
  )
}

export default Setup
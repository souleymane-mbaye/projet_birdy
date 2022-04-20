import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import Form from '../../components/formUpdate/Form'
import "./update.css"
import Share from '../../components/share/Share'

export default function Update() {
  return (
    <div className='u'>
        <Topbar/>
        <div className='update'>
         <Sidebar/>
         <Form/>
        </div>
        
    </div>
  )
}

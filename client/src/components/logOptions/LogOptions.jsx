import React, { useState } from 'react'
import "./LogOptions.css";
import {Link} from 'react-router-dom';

function LogOptions() {
    
  return (
    <div className='option'>
        <h1>Ca se passe maintenant</h1>

        <div className='blocBtn'>
            <h3>Rejoigne Birdy dés aujourd'hui</h3>
            <br/>
            <Link to="./register" className='insc'>S'inscrire</Link>
        </div>
        <div className='blocBtn'>
            <h3>Vous avez deja un compte?</h3>
            <br/>
            <Link to='./login' className="connect">Connexion</Link>
        </div>
        
    </div>
  )
}

export default LogOptions

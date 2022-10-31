import React from 'react'
import Steps from '../components/Steps'

import { Link, useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar'

import Flower from "../assets/main flowers.jpg"

import Stage from "../assets/walkway main.jpg"

import Lighting from "../assets/main lighting.jpg"

const Decor = () => {
  return (
    <>
    
    <Navbar />
    <Steps active='decor'/>
    <div className='col'>     
                      
        <div className='col-child' >
          <Link to={`/flowers`}>
            <img src={Flower}/>
            <p className='pname'>Flowers</p>
            
          </Link>
        </div>

        <div className='col-child' >
          <Link to={`/stage`}>
          <img src={Stage}/>
            <p className='pname'>Stage</p>
            
          </Link>
        </div>

        <div className='col-child'>
          <Link to={`/lighting`}>
          <img src={Lighting}/>
            <p className='pname'>Lighting</p>
            
          </Link>
        </div>
      

    </div>
    </>
  )
}

export default Decor
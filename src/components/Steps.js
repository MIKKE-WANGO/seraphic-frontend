import React,{useEffect} from 'react'

import "../css/step.css"

import { Link } from "react-router-dom"

import Start from "../assets/start.png"

import Chair from "../assets/chair.png"

import Table from "../assets/coffee-table.png"

import Decor from "../assets/flower-bouquet.png"

import Review from "../assets/finish-line.png"

import Tent from "../assets/event-tent.png"


const Steps = (props) => {

    let active_class = props.active
    
  useEffect(() => {
    setActiveClass()
  },[active_class]);

  function setActiveClass() {
    document.getElementById(props.active).classList.add("active");
    }



  return (
    <>
    
    <div className='steps'>
        
        <div className="circle">
            <Link to='/start'>
            <div className="inner-circle" id='start'><img src={Start}/> </div>
            <div className='step-label'>Start</div>
            </Link>
        </div> 
        <div className="line"></div> 

        <div className="circle">
            <Link to='/tents'>
            <div className="inner-circle " id='tents'><img src={Tent}/></div>
            <div className='step-label'>Tents</div>
            </Link>
        </div> 
        <div className="line"></div> 

        <div className="circle ">
            <Link to='/chairs'>
            <div className="inner-circle" id='chairs'><img src={Chair}/></div>
            <div className='step-label '>Chairs</div>
            </Link>
        </div> 
        <div className="line "></div> 

        <div className="circle">
            <Link to='/tables'>
            <div className="inner-circle" id='tables'><img src={Table}/></div>
            <div className='step-label'>Tables</div>
            </Link>
        </div>
        <div className="line"></div> 

        <div className="circle">
            <Link to='/decor'>
            <div className="inner-circle" id='decor'><img src={Decor}/></div>
            <div className='step-label'>Decor</div>
            </Link>
        </div>
        <div className="line"></div> 

        <div className="circle">
            <Link to='/review'>
            <div className="inner-circle" id='review'><img src={Review}/></div>
            <div className='step-label'>Review</div>
            </Link>
        </div>
    </div>
    
    </>
  )
}

export default Steps
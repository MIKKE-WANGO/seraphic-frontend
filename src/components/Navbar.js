import React,{useEffect, useState} from 'react'
import "../css/navbar.css"
import menu from "../assets/seraphic-menu.png"
import { Link, useNavigate } from 'react-router-dom'

import Logo from "../assets/Seraphic-logo.jpg"
//calling verify whenever navbar is interacted with
const Navbar = (props) => {

  const [verified, setverified] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    Verify()
  },[])

  
  useEffect(() => {
   
  },[verified])

  async function  Verify  ()  {
    //retrieve refresh and access
    if (localStorage.getItem('access')){
      let response = await fetch('https://seraphic-0kq8.onrender.com/api/token/verify', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',        
          },
          
          body: JSON.stringify({token: ` ${localStorage.getItem('access')}`})
      })

      //remove items from local storage
      if(!response.ok){
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('username')
        localStorage.removeItem('useremail')

        setverified(false)
        return navigate('/')

      }

      let data = await response.json()
      setverified(true)  
    } 
  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    }

   
  function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  }

  
let logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('username')
  localStorage.removeItem('useremail')
  closeNav()
  setverified(false)
}

  return (
    <div className='navbar'>

       <div id="mySidenav" class="sidenav">
            <Link to="#" class="closebtn" onClick={e => closeNav(e)}>&times;</Link>
            <Link to="/" onClick={e => closeNav(e)}>Home</Link>
            <Link to="/login" onClick={e => closeNav(e)}>Login</Link>
            <Link to="#" onClick={ logout}>Logout</Link>
        </div>
          
       

        <div className='logo'>
        <Link to="/" ><img src={Logo}    alt="mobile menu "/></Link>
          
        </div>


        <div class="menu">
          <img src={menu}  onClick={e => openNav(e)}  alt="mobile menu "/>      
        </div>


    </div>
  )
}

export default Navbar
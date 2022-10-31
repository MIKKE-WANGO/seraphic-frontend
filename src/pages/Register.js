

import React ,{useState,useEffect}from 'react'
import "../css/login.css"
import { Link, useNavigate } from "react-router-dom"


import {  toast } from 'react-toastify';
import Navbar from '../components/Navbar';
//import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
 
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    password: '',
  })

  const [accountCreated, setAccountCreated] = useState(false)

  
  useEffect(() => {
    redirect()
  },[accountCreated])

  //destructure to access formData keys  individually
  const {name,email, password} = formData

  let navigate = useNavigate()

  let redirect = ()  => {
    if(accountCreated){
        console.log('redirected')
        return navigate('/')
        }
    
    }

  const onChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  
  const onSubmit = e => {
    e.preventDefault()
    signup(formData)      
    
  };

  const get_user = async () => {
    if (localStorage.getItem('access')){
      let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/user-details', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',            
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,      
            },
       })

      let data = await response.json()
 
      if(!response.ok){
        console.log("unable to get user")     
      }

      localStorage.setItem('username', data.user.name)
      localStorage.setItem('useremail', data.user.email)
      
      setAccountCreated(true)
      toast.success('Account created')

      console.log("user accessed")
     
    } else {
      console.log(" no access key")
    }
  }

  async function  Loginuser  ()  {
    //retrieve refresh and access
    let response = await fetch('https://seraphic-wango.herokuapp.com/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({email:email, password:password})
    })
    //remove items from local storage
    if(!response.ok){
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      toast.error("Account created but unable to log you in");
      
    }

    let data = await response.json()

    console.log("login success")
    
    //set access in localstorage of browser
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    get_user()
  }
  
  const signup= async  (formData) => {
  
    let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify(formData)
    })

    let data = await response.json()
    
    //remove items from local storage
    if(!response.ok){
      setAccountCreated(false)

      if( data.error === 'User with this email already exists'){
        toast.error('User with this email already exists')
        return console.log('user already exists')    
    
      } else if(data.error==='Password must be at least 6 characters long'){
        toast.error("Password must be at least 6 characters long");
  
      } 
        
    } else {
      Loginuser()
      console.log("sign up success") 
     
    }         
  }

  return (
    <>
    <Navbar/>
    <div className='login-outer'>
    <div className='login'>
      <div className='login-inner'>
        <p>CREATE ACCOUNT</p>

        <hr></hr>
        
        <form onSubmit={e => onSubmit(e)} style={{margin:5}} >
               
                <label for='name'>Full Name</label>
                <input  
                name="name" 
                type="text"
                value={name}
                onChange={e => onChange(e)} 
                />

               <label for='email'>Email address</label>
                <input
                name="email"  
                type="email"
                value={email}
                onChange={e => onChange(e)}                        
                />
             
                <label for='password'>Password</label>
                <input  
                name="password" 
                type="password"
                value={password}
                onChange={e => onChange(e)} 
                />
             
                <button type='submit' className='log'>CREATE ACCOUNT</button>

                <p className='new'>------- Already have an account? -------</p>
                <Link to='/login'><button  className='lb'>LOGIN</button></Link>
         
        </form>
               
      </div>
    </div>
    </div>
    </>
  )
}

export default Register
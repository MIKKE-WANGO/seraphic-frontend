
import React ,{useState,useEffect}from 'react'
import "../css/login.css"

import { toast } from 'react-toastify';


import { Link, useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar';
  const RequestPasswordReset = () => {

  
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    password: '',
    re_password: '',
  })

//destructure to access formData keys  individually
  const {email, code, password, re_password} = formData
    
  const [requested, setRequested] = useState(false)

  const [codeSubmitted, setCodeSubmitted] = useState(false)

  
  const [reset, setReset] = useState(false)

    
  useEffect(() => {

  },[requested])
    
    
  useEffect(() => {
    redirect()
  })
    
  useEffect(() => {

  },[setCodeSubmitted])
    
  let navigate = useNavigate()

  let redirect = ()  => {
    if(reset){
        console.log('redirected')
        return navigate('/login')
        }
    
    }

  const onChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  const onSubmitEmail = e => {
    e.preventDefault()
    RequestCode(email)
    
  };

  const onSubmitCode = e => {
    e.preventDefault()
    TestCode(code, email)
  };

  const onSubmitPassword = e => {
    e.preventDefault()
    if (password === re_password){
      ResetPassword(code,email,password)
    
        } else {
          toast.error("Passwords do not match!");
  
      }
    
  };



  async function  RequestCode  (email)  {
    //retrieve refresh and access
    let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/request-reset-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({email: email})
    })

    if(!response.ok){
      toast.error("invalid email");
      return console.log('not authorised') 
      
    }
    setRequested(true)
  }

  async function  TestCode  (code,email)  {
    //retrieve refresh and access
    let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/test-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({code:code, email:email })
    })

    
    let data = await response.json()

    if(!response.ok){
      if( data.error === 'OTP has expired'){
        toast.error('Code has expired')
        return console.log('user already exists')    
    
      } else if(data.error==='Invalid OTP'){
        toast.error("Invalid code");
      }
      
    }

    setCodeSubmitted(true)

  }

  async function  ResetPassword  (code,email,password)  {
    //retrieve refresh and access
    let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({code:code, email:email, password:password })
    })

    
    let data = await response.json()

    if(!response.ok){
      if( data.error === 'OTP has expired'){
        toast.error('Code has expired')
        return console.log('user already exists')    
    
      } else if(data.error==='Invalid OTP'){
        toast.error("Invalid code");
      } else if(data.error==='Password must be at least 6 characters long'){
        toast.error("Password must be at least 6 characters long");
      }

      
    }

    setReset(true)

  }




  return (
    
    <>
    <Navbar/>
    <div className='login-outer'>
    <div className='login'>

      <div className='login-inner'>

      {codeSubmitted 
      ? 
      <>
        <p>SET NEW PASSWORD</p>

        <hr></hr>

        <form onSubmit={e => onSubmitPassword(e)} style={{margin:5}} >
          
          <label for='password'>New Password</label>
            <input
            name="password"  
            type="password"
            value={password}
            onChange={e => onChange(e)}                        
          />

          <label for='re_password'>Confirm Password</label>
            <input
            name="re_password"  
            type="password"
            value={re_password}
            onChange={e => onChange(e)}                        
          />


          <button type='submit' className='log'>CHANGE PASSWORD</button>

        </form>

      </> 
      
      :
        <>
        {requested 
        ? 
        <>
          <p>ENTER CODE</p>

          <p className='forget'>Please enter the code sent to your email address below.</p>

          <hr></hr>

          <form onSubmit={e => onSubmitCode(e)} style={{margin:5}} >
                
                <label for='code'>Code</label>
                  <input
                  name="code"  
                  type="number"
                  value={code}
                  onChange={e => onChange(e)}                        
                  />

                  <button type='submit' className='log'>Submit</button>
            
          </form>
        </> 
               
        :
        <>
        <p>FORGOT PASSWORD?</p>

        <p className='forget'>Please enter your email address below. You will receive a code to reset your password.</p>

        <hr></hr>
        
        <form onSubmit={e => onSubmitEmail(e)} style={{margin:5}} >
               
               <label for='email'>Email address</label>
                <input
                name="email"  
                type="email"
                value={email}
                onChange={e => onChange(e)}                        
                />


                <button type='submit' className='log'>Submit</button>

                <Link to='/login'><button  className='lb'>BACK TO LOGIN</button></Link>      
        </form>
        </>
        }
        </>
      }
      </div>
    </div>
    </div>
    </>

  )
}



export default RequestPasswordReset
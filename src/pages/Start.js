import React,{useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Steps from '../components/Steps'

import { toast } from 'react-toastify';

import { Link, useNavigate } from "react-router-dom"

const Start = () => {

  let navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    guests: '',
    date: ''
  })

  const [eventExists, setEventExists] = useState(false)

  //destructure to access formData keys  individually
  const {title, budget, guests,date} = formData

  
  useEffect(() => {
    checkIfEventExists()
  },[])

  
  useEffect(() => {
  },[eventExists])


  const onChange = (e) => {
    redirect()
    //console.log(e)
    setFormData({...formData, [e.target.name]: e.target.value});
}

  const onSubmit = e => {
    e.preventDefault()
    CreateEvent()
   // console.log(date)
  };

  let redirect = ()  => {
    if(localStorage.getItem('access') === null){
      console.log('redirect')
      toast.warning("Please login to start creating your own quotation")
      return navigate('/login')
    }      
  }

  async function  checkIfEventExists  ()  {
    if(localStorage.getItem('access')){
      let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/event', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
              
          },
      })
     
      let data = await response.json()
      if(!response.ok){
        console.log('unable to fetch event')     
      }

      if (data.exists === false){
        setEventExists(false)
        console.log('does not exist')
      } else{
        return toast.warning('You already have an existing quotaion.Submitting a new one will delete the previous one',{autoClose:2800})
        //return navigate('/tents')
      }
    } else{
      setEventExists(false)
    }
  }

  async function  CreateEvent(){
    //retrieve refresh and access
    let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
            
        },
        body: JSON.stringify(formData)
    })

    
    let data = await response.json()
    if(!response.ok){
      return toast.error("Unable to create quotation try again later")
    }

    toast.success('Quotation created')
    return navigate('/tents')

  }



  return (
    <>
    <Navbar />
    <Steps active='start'/>
    <div>

    <div className='login-outer' >
    
    <div className='login' style={{marginTop:5}}>
      
      <div className='login-inner'>
        
          <p>Create your own quotation that fits your budget by choosing any of our products to create your perfect event </p>
          <p>Simply follow the steps</p>
          
        <hr></hr>
        
        <form onSubmit={e => onSubmit(e)} style={{margin:5}} >
          
          <label >Title <span style={{fontSize:13}}> e.g my wedding or son's birthday</span></label>
          <input
          name="title"  
          type="text"
          value={title}
          required={true}
          onChange={e => onChange(e)}                        
          />

          <label >Budget</label>
          <input  
          name="budget" 
          type="number"
          value={budget}
          required={true}
          onChange={e => onChange(e)} 
          />

          <label >Number of Guests</label>
          <input
          name="guests"  
          type="number"
          value={guests}
          required={true}
          onChange={e => onChange(e)}                        
          />

          <label >Date</label>
          <input
          name="date"  
          type="date"
          value={date}
          required={true}
          onChange={e => onChange(e)}                        
          />
          
          <button type='submit' className='log'>Submit</button>
          
        </form>

      
      </div>
    </div>
    </div>
      
    </div>
    </>
  )
}

export default Start
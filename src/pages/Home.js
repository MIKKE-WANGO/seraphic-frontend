import React,{useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Steps from '../components/Steps'

import { toast } from 'react-toastify';

import { Link, useNavigate } from "react-router-dom"

import "../css/home.css"

import "../css/review.css"



const Home = () => {
    
    
  const [login, setLogin] = useState(true)
  
  const [eventExists, setEventExists] = useState(false)
  
  const [quotaions, setQuotations] = useState([])
  
  const [empty, setEmpty] = useState(true)


  let navigate = useNavigate()

  
  useEffect(() => {
    },[eventExists,login])

  useEffect(() => {
    checkIfEventExists()
    getQuotations()
  },[])

  

  
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
        toast.error('Try again later')     
      }

      if (data.exists === false){
        setEventExists(false)
        
      } else{
        setEventExists(true)
        
      }
    } else{
      setEventExists(false)
    }
  }

  
  async function  getQuotations ()  {
    if(localStorage.getItem('access')){
      let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/get-quotations-list', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
              
          },
      })
     
      let data = await response.json()
      if(!response.ok){
        return toast.error('Unamble to fetch quotation history')   
      }
      setQuotations(data.events)
      let qoutes = data.events
      if (qoutes.length === 0){
        setEmpty(true)
      } else{
        setEmpty(false)
      }

    }
  }

  async function  createQuote  ()  {
    if(localStorage.getItem('access')){
      let response = await fetch('https://seraphic-wango.herokuapp.com/quotation/delete-event', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access')}`,
              
          },
      })
     
      let data = await response.json()
      if(!response.ok){
        toast.error('Try again later')        
      }
      if (data.success === 'Event successfully deleted'){
        
        return navigate('/start')
      }
    }
    }

  return (
    <>
    <Navbar />
    <div className='home-intro'>
        
            {localStorage.getItem('access')
            ?
                <>
                <div className='text'><p> Welcome {localStorage.getItem('username')}</p></div>
                <div className='log-button'><button className='quote-button' onClick={e=> createQuote()}>Create New quotation</button></div>
                {eventExists 
                    ?
                    <>
                    <p className='or'>OR</p>
                    <div className='log-button'><button className='quote-button'><Link to='/review'>Continue with previous quote</Link></button></div>
               
                    </>
                    :
                    <></>

                }
                
                </>
            :
                <>
                    <div className='text'><p> Welcome to Seraphic</p></div>
                    <div className='log-button'><button><Link to='/login'>Login</Link></button></div>
                    
                </>

            }

    </div>
    <div className='quotation-history'>
        <h2>Quotation History</h2>
        {empty ?
            <p style={{textAlign:'center'}}>Quotations you create will appear here</p>
        :
        <div className='table'>
        <table class="styled-table">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Guests</th>
                  <th>Total price</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
            {quotaions.map(quotaion => 
              <tr>
                  <td>{quotaion.name}</td>   
                  <td>{quotaion.guests}</td>
                  <td>{quotaion.total_price}</td>
                  <td style={{cursor:'pointer'}}><Link to={`quote/${quotaion.id}`}>View</Link></td>
              </tr>
            )}
            
          </tbody>
        </table>
        </div>
        }

    </div>

    
    </>
  )
}

export default Home
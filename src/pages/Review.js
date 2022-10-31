import React,{useEffect,useState} from 'react'
import Steps from '../components/Steps'

import { toast } from 'react-toastify';
import "../css/review.css"
import Navbar from '../components/Navbar'

import { Link, useNavigate } from "react-router-dom"

import Delete from "../assets/delete-forever.png"
const Review = () => {


  const [eventProducts, setEventProducts] = useState([]) 
  const [eventPrice,setEventPrice] = useState(0)
  const [budget, setBudget] = useState("")   
  const [moneyLeft, setMoneyLeft] = useState(0)  
  const [guests, setGuests] = useState(0)
  
  let navigate = useNavigate()


  useEffect(() => {
    getEventProducts()
    getbudget()
    
}, []);

  
useEffect(() => {
  
}, [eventProducts,moneyLeft]);



  async function getEventProducts() {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/review`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,              
            
        },     
    });
    let data = await response.json();   
    setEventProducts(data.event_products)
    setEventPrice(data.total_price)
    
  }

  async function getbudget() {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/budget`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',   
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                         
        },     

    });
    let data = await response.json();
    setGuests(data.guests)   
    setMoneyLeft(data.money_left)   
    setBudget(data.budget)
    
  }

  
  async function DeletProduct(id) {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',   
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                         
        },     
        body: JSON.stringify({'id':id})

    });
    let data = await response.json();
    if(!response.ok){
      toast.error("Unable to remove item try again later");
    }
    if(data.success === 'deleted successfully'){  
      getEventProducts()
      getbudget()
      return toast.success('Item removed')
    }
  }

  
  async function SubmitQuote() {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/submit-quote`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',   
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                         
        },     

    });
    let data = await response.json();
    if(!response.ok){
      toast.error("Unable to remove item try again later");
    }
    if(data.success === 'Submitted successfully'){  
      
      toast.success('A PDF of the quote has been sent to your email')
      return navigate('/')
    }
  }

  return (
    
    <>
    
    <Navbar />
    <Steps active='review'/>
      <div className='table'>
        <table class="styled-table">
          <thead>
              <tr>
                  <th style={{width:'30%'}}>Name</th>
                  <th>Quantity</th>
                  <th>Unit price</th>
                  <th>Total price</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
            {eventProducts.map(eventproduct => 
              <tr>
                  <td>{eventproduct.name}</td>
                  <td>{eventproduct.quantity}</td>               
                  <td>{eventproduct.price}</td>
                  <td>{eventproduct.total_price}</td>
                  <td onClick={e => DeletProduct(eventproduct.id)}><img src={Delete}/></td>
              </tr>
            )}
            <tr style={{color:'#e6ae48', fontWeight:800}}>
              
              <td></td>
              <td></td>
              <td>Total Cost</td>
              <td>{eventPrice}</td>
              <td></td>
            </tr>
            <tr style={{color:'#e6ae48', fontWeight:800}}>
              
              <td></td>
              <td></td>
              <td>Budget Left</td>
              <td>{moneyLeft}</td>
              <td></td>
            </tr>
            
          </tbody>
        </table>
        
      </div>
      <div className='submit-quote' >
          <button onClick={e => SubmitQuote()}>Finish</button>
      </div>

    </>
  )
}

export default Review
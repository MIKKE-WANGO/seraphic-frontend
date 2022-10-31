import React,{useEffect,useState} from 'react'
import Steps from '../components/Steps'

import "../css/review.css"
import Navbar from '../components/Navbar'

import { Link, useNavigate,useParams } from "react-router-dom"


const Quote = (props) => {

    
    const quoteId = useParams(props.id)
    
  const [eventProducts, setEventProducts] = useState([]) 
  const [eventPrice,setEventPrice] = useState(0)

  
  useEffect(() => {
    getEventProducts()
}, []);

  
  async function getEventProducts() {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/quote-view`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,              
            
        },     
        body:JSON.stringify({'id':quoteId.id})
    });
    let data = await response.json();   
    setEventProducts(data.event_products)
    setEventPrice(data.total_price)
    
  }

  return (
    
    <>
    <Navbar />
      <div className='table' style={{marginTop:100}}>
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
                  <td></td>
                  
              </tr>
            )}
            <tr style={{color:'#e6ae48', fontWeight:800}}>
              
              <td><Link to='/' style={{textAlign:'centre'}}>BACK HOME</Link></td>
              <td></td>
              <td>Total Cost</td>
              <td>{eventPrice}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        </div>

    </>
  )
}

export default Quote
import React,{useEffect,useState} from 'react'
import Steps from '../components/Steps'

import { Link, useNavigate,useParams } from "react-router-dom"

import Navbar from '../components/Navbar'

import { toast } from 'react-toastify';

const DecorProduct = (props) => {

    const decorId = useParams(props.id)    
    const [decor, setDecor] = useState("")   
    const [budget, setBudget] = useState("")   
    const [moneyLeft, setMoneyLeft] = useState(0)
    const [proxyMoneyLeft, setProxyMoneyLeft] = useState(0)   
    const [guests, setGuests] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const[totalPrice, setTotalPrice] = useState(0)

    
    const [addToEventSent, setAddToEventSent] = useState(false)
    useEffect(() => {
        getDecor()
        getbudget()
        
    }, [decorId]);

    async function getDecor() {
        let response = await fetch(`https://seraphic-0kq8.onrender.com/quotation/decor/${decorId.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',           
                
            },     
        });
        let data = await response.json();   
        setDecor(data.decor)
        
    }

    async function getbudget() {
        let response = await fetch(`https://seraphic-0kq8.onrender.com/quotation/budget`, {
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
        
        setProxyMoneyLeft(data.money_left)    
        setBudget(data.budget)
        
      }

      async function AddToEvent(id,quantity) {
        let response = await fetch(`https://seraphic-0kq8.onrender.com/quotation/addeventproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',   
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                            
            },     
            body: JSON.stringify({'productId':id,'quantity':quantity,})
        });
        let data = await response.json();   
        if(!response.ok){
          toast.error('Unable to add try again later')
        } else{
          toast.success('decor added successfuly')
          setAddToEventSent(false)
        }
             
      }
    
    const callAddToEvent = () => {
        if(quantity === 0){
            return toast.warning('Set quantity')
        }
        if(addToEventSent === false){
          setAddToEventSent(true)
          if (localStorage.getItem('access')){
              AddToEvent(decorId.id,quantity)
          }
        } else{
          toast.warning('Ypour request is being processed please wait')
        }
    }

  const onChange = (e) => {  
    setQuantity( e.target.value);
    calculateTotalPrice(e.target.value)
  }

  
  const calculateTotalPrice = (quantity) => {
    let price = decor.price * quantity
    let left = moneyLeft - price
    if(quantity <= 0){
      setTotalPrice(0)
      setProxyMoneyLeft(moneyLeft)     
      return true
    }
    
    setTotalPrice(price)
    setProxyMoneyLeft(left)
  }

  return (
    <>
    <Navbar />
    <Steps active='decor'/>
    <div className='product'>
      <div className='product-images'>               
        <img src={`https://res.cloudinary.com/dywxtjhkl/${decor.image}`}  alt={decor.name}/> 

      </div>

      <div className='product-details'>
                      
        <p className='pname' style={{marginTop:0,paddingTop:8}}>{decor.name}</p>
        
        <p className='pbrand' style={{fontWeight:700,marginTop:10}}>{decor.price} ksh</p>                
                            
        <p className='pbrand' style={{color:'black', paddingTop:8, fontSize:14, textAlign:'justify', lineHeight:1.5}}>{decor.description}</p>            

        <hr className='pspace'></hr>

        <div className='quantity'>     
        <label>Quantity</label>                                 
            <input
            name="number"  
            type="number"
            value={quantity}
            onChange={e => onChange(e)}                        
            />                                  
          </div>

          <div className='total-price'>
            <p className='pbrand'>Total Price: {totalPrice}</p>
            {localStorage.getItem('access') ? <p className='pbrand'>Budget Left: {proxyMoneyLeft}</p>: <></>}
          </div>

          <div className='addtocart'>
              <button onClick={e => callAddToEvent()}>Add to quote</button>
          </div>

          <div className='next-back'>
              <Link to='/decor' className='next-back-child'><button >Add more Decor</button></Link>
          
              <Link to='/review' className='next-back-child'><button >Next</button></Link>
          </div>
        </div>
    </div>

    </>

  )
}

export default DecorProduct
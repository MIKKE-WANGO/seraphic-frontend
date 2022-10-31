import Navbar from '../components/Navbar'
import React, {useState, useEffect} from 'react'
import { useParams, Link , useNavigate} from "react-router-dom";
import Steps from '../components/Steps'

import "../css/tent.css"

import { toast } from 'react-toastify';

const TentProduct = (props) => {

  
  const tentId = useParams(props.id)
  const [tent, setTent] = useState("") 
  
  const [capacity, setCapacity] = useState(false) 
  const [sittingStyle, setSittingStyle] = useState('restaurant')
  
  const [draping, setDraping] = useState(true) 
  const [usedraping, setUseDraping] = useState(true)  

  const [budget, setBudget] = useState("")   
  const [moneyLeft, setMoneyLeft] = useState(0)
  const [proxyMoneyLeft, setProxyMoneyLeft] = useState(0)   
  const [guests, setGuests] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [recommendedNoTents ,setReccomendedNoTents] = useState(0)
  const[totalPrice, setTotalPrice] = useState(0)
  
  const [addToEventSent, setAddToEventSent] = useState(false)

  useEffect(() => {
      getTent()
      getbudget()
      
  }, [tentId]);
  useEffect(() => {
   calculateTotalPrice(quantity)
    
}, [usedraping]);

  useEffect(() => {
    
  }, [draping,capacity,usedraping,recommendedNoTents]);

  async function getTent() {
      let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/tent/${tentId.id}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',           
              
          },     
      });
      let data = await response.json();   
      setTent(data.tent)   
      setCapacity(data.capacity)
      setDraping(data.draping)     
      if(data.draping === false){
        setUseDraping(false)
      }   
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
    
    setProxyMoneyLeft(data.money_left)    
    setBudget(data.budget)
    
    calculateNoTents('restaurant',data.guests)
  }

  async function AddToEvent(id,quantity) {
    let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/addeventproduct`, {
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
      toast.success('Tent added successfuly')
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
        if (usedraping===true){
        AddToEvent(tentId.id,quantity)
        AddToEvent(draping.id,quantity)
        } else{
          AddToEvent(tentId.id,quantity)
        }
      } else {
        return toast.warning('Login to add products')
      }
    }else{
      toast.warning('your request is being processed please wait')
    }

  }

  const calculateTotalPrice = (quantity) => {
    let price = tent.price * quantity
    let left = moneyLeft - price
    if(quantity <= 0){
      setTotalPrice(0)
      setProxyMoneyLeft(moneyLeft)
      
      return true
    }
    if (usedraping === true){
      let drape = draping.price*quantity
      setProxyMoneyLeft(left-drape)
      setTotalPrice(price + drape)
      
      return true
    } else{
      setProxyMoneyLeft(left)
      setTotalPrice(price)
     
      return true
    }
  }
  const onChange = (e) => {
    
    setQuantity( e.target.value);
    calculateTotalPrice(e.target.value)
    calculateNoTents(sittingStyle,guests)
    
  }
 
  const clickDraping = (e) => {
    if (usedraping === true){
      setUseDraping(false)     
    }
    else{
      setUseDraping(true)      
    }
  }

  const chooseSittingStyle = (style) => {
    if (style === 'restaurant'){
      setSittingStyle('restaurant')  
      calculateNoTents('restaurant',guests)   
    }
    else{
      setSittingStyle('theatre')    
      calculateNoTents('theatre',guests)  
    }
  }

  const calculateNoTents = (style,guests) => {
    if(capacity === false){
      return false
    }
    if(style === 'restaurant'){
      let no = guests/capacity.restaurant
      no = Math.ceil(no)     
      setReccomendedNoTents(no)
    } else{
      let no = guests/capacity.theatre
      no = Math.ceil(no)
      setReccomendedNoTents(no)
    }
  }
 
  
  return (
    <>
      <Navbar />
      <Steps active='tents'/>

      <div className='product'>
        <div className='product-images'>               
          <img src={`https://res.cloudinary.com/dgcbtjq3c/${tent.image}`}  alt={tent.name}/> 

        </div>

        <div className='product-details'>
                        
          <p className='pname' style={{marginTop:0,paddingTop:8}}>{tent.name}</p>
          
          <p className='pbrand' style={{fontWeight:700,marginTop:10}}>{tent.price} ksh</p>                
                              
          <p className='pbrand' style={{color:'black', paddingTop:8, fontSize:14, textAlign:'justify', lineHeight:1.5}}>{tent.description}</p>            

          <hr className='pspace'></hr>

          {draping 
            ?
              <>
                {usedraping ?
                  <>
                  <p className='pbrand' style={{fontWeight:700, marginBottom:5}}>Add draping?</p>
                  <div className='add-draping'>
                     
                    <div className='add-draping-child chosen' onClick={e => clickDraping(e)}>
                      Yes
                    </div>
                    <div className='add-draping-child' onClick={e => clickDraping(e)}>
                      No
                    </div>
                                                           
                  </div>
                  <p className='pbrand' style={{marginTop:5}}>+{draping.price} ksh</p>
                  </>
                  :
                  <>
                  <p className='pbrand' style={{fontWeight:700,marginBottom:5}}>Add draping?</p>
                  <div className='add-draping'>
                    
                    <div className='add-draping-child' onClick={e => clickDraping(e)}>
                      Yes
                    </div>
                    <div className='add-draping-child chosen' onClick={e => clickDraping(e)}>
                      No
                    </div>

                  </div>
                  </>

                }
              </>
            :
              <>
              </> 
          }

          {capacity
            ?
              <>                                 
                <p className='pbrand' style={{fontWeight:700,marginBottom:5}}>Choose sitting style</p>
                {sittingStyle === 'restaurant' ? 
                <>
                <div className='add-draping'>
                    
                  <div className='add-draping-child chosen' onClick={e => chooseSittingStyle('restaurant')}>
                    Restaurant
                  </div>
                  <div className='add-draping-child' onClick={e => chooseSittingStyle('theatre')}>
                    Theatre
                  </div>
                                                          
                </div>
                
                {recommendedNoTents === 0 ?<></>:
                <p className='pbrand' style={{marginTop:5}}>Recommended number of tents to fit all guests is <span>{recommendedNoTents}</span></p>
                }
                
                </>
                :
                <>
               
                <div className='add-draping'>
                    
                  <div className='add-draping-child ' onClick={e => chooseSittingStyle('restaurant')}>
                    Restaurant
                  </div>
                  <div className='add-draping-child chosen' onClick={e => chooseSittingStyle('theatre')}>
                    Theatre
                  </div>
                                                          
                </div>
                {recommendedNoTents === 0 ?<></>:
                <p className='pbrand' style={{marginTop:5}}>Recommended number of tents to fit all guests is <span>{recommendedNoTents}</span></p>
                }
                 </>
                }
                
              </>
            :
              <>
              </> 
          }


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
              <Link to='/tents' className='next-back-child'><button >Add more Tents</button></Link>
          
              <Link to='/chairs' className='next-back-child'><button >Next</button></Link>
          </div>
      
          
          
        </div>

      </div>
    </>
  )
}

export default TentProduct
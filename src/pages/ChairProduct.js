import React,{useEffect,useState} from 'react'
import Steps from '../components/Steps'

import { Link, useNavigate, useParams } from "react-router-dom"

import Navbar from '../components/Navbar'

import { toast } from 'react-toastify';

import "../css/chair.css"

const ChairProduct = (props) => {

    
    const chairId = useParams(props.id)
    
    const [chair, setChair] = useState("") 

    const [addToEventSent, setAddToEventSent] = useState(false)
    
    const [sitcovers, setSitCovers] = useState([]) 
    const [tiebacks, setTiebacks] = useState([]) 
    const [chosensitcover, setChosenSitCover] = useState(false) 
    const [chosentieback, setChosenTieback] = useState(false) 
    const [sitcoverPrice,setSitCoverPrice] = useState(0)
    const [tiebackPrice, setTieBackPrice] = useState(0)
    const [budget, setBudget] = useState("")   
    const [moneyLeft, setMoneyLeft] = useState(0)
    const [proxyMoneyLeft, setProxyMoneyLeft] = useState(0)   
    const [guests, setGuests] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const[totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        getChair()
        getbudget()
        
    }, [chairId]);
    useEffect(() => {     
        calculateTotalPrice(quantity)
    }, [chosensitcover,chosentieback,]);

    
    
    async function getChair() {
        let response = await fetch(`https://seraphic-0kq8.onrender.com/quotation/chair/${chairId.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',           
                
            },     
        });
        let data = await response.json();   
        setChair(data.chair)
        setTiebacks(data.tiebacks)
        setSitCovers(data.sitcovers)

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
        toast.success('Chair added successfuly')
        setAddToEventSent(false)
      }
           
    }

    
  const callAddToEvent = () => {
    if(quantity === 0){
      return toast.warning('Set quantity')
    }
    if (addToEventSent === false){
      setAddToEventSent(true)
    
      if (localStorage.getItem('access')){
          if(chosensitcover != false && chosentieback != false){
              AddToEvent(chairId.id,quantity)
              AddToEvent(chosensitcover,quantity)
              AddToEvent(chosentieback,quantity)
              return true
          }
          if(chosensitcover != false){
              AddToEvent(chairId.id,quantity)
              AddToEvent(chosensitcover,quantity)
              return true
          }
          if( chosentieback != false){
              AddToEvent(chairId.id,quantity)
              AddToEvent(chosentieback,quantity)
              return true
          }         
          AddToEvent(chairId.id,quantity)

      } else {
        return toast.warning('Login to add products')
      }
    }else{
      toast.warning('Your request is still being processed please wait')
    }
  }

  
  const onChange = (e) => {  
    setQuantity( e.target.value);
    calculateTotalPrice(e.target.value)
  }

  const calculateTotalPrice = (quantity) => {
    let price = chair.price * quantity
    let left = moneyLeft - price
    if(quantity <= 0){
      setTotalPrice(0)
      setProxyMoneyLeft(moneyLeft)     
      return true
    }

    if(chosensitcover != false && chosentieback != false){
        let sitcoverprice = sitcoverPrice * quantity
        let tiebackprice = tiebackPrice * quantity
        price = price + sitcoverprice + tiebackprice
        left = moneyLeft - price
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }

    if(chosensitcover != false){
        let sitcoverprice = sitcoverPrice * quantity
        price = price + sitcoverprice
        left = moneyLeft - price     
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }

    if(chosentieback != false){
        let tiebackprice = tiebackPrice * quantity
        price = price + tiebackprice
        left = moneyLeft - price
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }

    setTotalPrice(price)
    setProxyMoneyLeft(left)
  }

  
    let showSitCovers = () => {
        document.getElementById("drop").classList.toggle("show");
    }
    let showTiebacks = () => {
        document.getElementById("drop1").classList.toggle("show");
    }

    const addSitCover = (id,price) => {
        if (chosensitcover === id){
            setSitCoverPrice(0)
            return setChosenSitCover(false)
        }
        setSitCoverPrice(price)
        setChosenSitCover(id)

    }

    const addTieback = (id,price) => {
        if (chosentieback === id){
            setTieBackPrice(0)
           return setChosenTieback(false)
        }
        setTieBackPrice(price)
        setChosenTieback(id)
    }

  
  return (
    <>
      <Navbar />
      <Steps active='chairs'/>
      <div className='product'>
        <div className='product-images'>               
          <img src={`https://res.cloudinary.com/dywxtjhkl/${chair.image}`}  alt={chair.name}/> 

        </div>

        <div className='product-details'>
                        
          <p className='pname' style={{marginTop:0,paddingTop:8}}>{chair.name}</p>
          
          <p className='pbrand' style={{fontWeight:700,marginTop:10}}>{chair.price} ksh</p>                
                              
          <p className='pbrand' style={{color:'black', paddingTop:8, fontSize:14, textAlign:'justify', lineHeight:1.5}}>{chair.description}</p>            

          <hr className='pspace'></hr>

        {sitcovers != false ? 
          <div className='sitcovers'>
            <button onClick={ showSitCovers} style={{ marginBottom:20,marginTop:10}}>CHOOSE SITCOVERS &darr;</button>
            <div className='sitcover' id='drop'>
                {sitcovers.map(sitcover =>
                        
                    <div className='sitcover-child' key={sitcover.id}>
                    
                        <img src={`https://res.cloudinary.com/dywxtjhkl/${sitcover.image}`}  alt={sitcover.name}/>
                        
                        <p className='sitcover-name'>{sitcover.name}</p>
                        <p className='sitcover-price'>{sitcover.price} ksh</p>
                        {chosensitcover === sitcover.id ? <button onClick={e => addSitCover(sitcover.id,sitcover.price)} style={{backgroundColor:'#e6ae48'}}>Choosen</button> : <button onClick={e => addSitCover(sitcover.id,sitcover.price)}>Choose</button>}
                    
                    </div>
                )}
                    
            </div>           

          </div>
          : <></>
        }

        {tiebacks != false ?
          <div className='sitcovers'>
            <button onClick={ showTiebacks} style={{backgroundColor: '#e6ae48'}}>CHOOSE TIEBACKS &darr;</button>
            <div className='sitcover' id='drop1'>
                <p style={{paddingLeft:5}}>All colors are available</p>
                {tiebacks.map(sitcover =>
                        
                    <div className='sitcover-child' key={sitcover.id}>
                    
                        <img src={`https://res.cloudinary.com/dywxtjhkl/${sitcover.image}`}  alt={sitcover.name}/>
                        
                        <p className='sitcover-name'>{sitcover.name}</p>
                        <p className='sitcover-price'>{sitcover.price} ksh</p>
                        {chosentieback === sitcover.id ? <button onClick={e => addTieback(sitcover.id,sitcover.price)} style={{backgroundColor:'#e6ae48'}}>Choosen</button> : <button onClick={e => addTieback(sitcover.id,sitcover.price)}>Choose</button> }
                    
                    </div>
                )}
                    
            </div>           

          </div>:<></>
        }

          <hr className='pspace'></hr>

          <p className='pbrand' style={{marginTop:5}}>You have {guests} guests</p>
          <div className='quantity'>    
          <label>Quantity: </label>                                  
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
              <Link to='/chairs' className='next-back-child'><button >Add more chairs</button></Link>
          
              <Link to='/tables' className='next-back-child'><button >Next</button></Link>
          </div>
        </div>
    </div>

    </>
  )
}

export default ChairProduct
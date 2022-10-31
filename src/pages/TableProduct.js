import React,{useEffect,useState} from 'react'
import Steps from '../components/Steps'

import { Link, useNavigate, useParams } from "react-router-dom"

import Navbar from '../components/Navbar'

import "../css/chair.css"

import { toast } from 'react-toastify';

const TableProduct = (props) => {
    
    const tableId = useParams(props.id)   
    const [table, setTable] = useState("")   
    const [overlay, setOverlay] = useState([])    
    const [tablecloths, setTablecloths] = useState([])  
    const [chosenTablecloth, setChosenTablecloth] = useState(false)
    const [chosenOverlay, setChosenOverlay] = useState(false)
    const [tableclothPrice, setTableclothPrice] = useState(0)
    const [overlayPrice, setOverlayPrice] = useState(0)
    const [budget, setBudget] = useState("")   
    const [moneyLeft, setMoneyLeft] = useState(0)
    const [proxyMoneyLeft, setProxyMoneyLeft] = useState(0)   
    const [guests, setGuests] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const[totalPrice, setTotalPrice] = useState(0)
    const [reccomendedNoTables,setReccomendedNoTables] = useState(0)
    
    const [addToEventSent, setAddToEventSent] = useState(false)

    useEffect(() => {
        getTable()
        
        
    }, [tableId]);

    
    useEffect(() => {     
        calculateTotalPrice(quantity)
    }, [chosenTablecloth,chosenOverlay,]);
 
    async function getTable() {
        let response = await fetch(`https://seraphic-wango.herokuapp.com/quotation/table/${tableId.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',                         
            },     
        });
        let data = await response.json();   
        setTable(data.table)
        setOverlay(data.overlay)
        setTablecloths(data.tablecloth)
        getbudget(data.table.name)
    }
  
    async function getbudget(name) {
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
      calculateNoTables(name,data.guests)
      
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
        toast.success('Chair added successfuly')
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
          if(chosenTablecloth != false && chosenOverlay != false){
              AddToEvent(tableId.id,quantity)
              AddToEvent(chosenTablecloth,quantity)
              AddToEvent(chosenOverlay,quantity)
              return true
          }
          if(chosenTablecloth != false){
              AddToEvent(tableId.id,quantity)
              AddToEvent(chosenTablecloth,quantity)
              return true
          }
          if( chosenOverlay != false){
              AddToEvent(tableId.id,quantity)
              AddToEvent(chosenOverlay,quantity)
              return true
          }        
        
          AddToEvent(tableId.id,quantity)
      }else{
        toast.warning('your request is being processed please wait')
      }

    } else {
      return toast.warning('Login to add products')
    }
  }

  
  const onChange = (e) => {  
    setQuantity( e.target.value);
    calculateTotalPrice(e.target.value)
  }

  const calculateTotalPrice = (quantity) => {
    let price = table.price * quantity
    let left = moneyLeft - price
    if(quantity <= 0){
      setTotalPrice(0)
      setProxyMoneyLeft(moneyLeft)     
      return true
    }
    
    if(chosenTablecloth != false && chosenOverlay != false){
        let overlayprice = overlayPrice * quantity
        let tableclothprice = tableclothPrice * quantity
        price = price + overlayprice + tableclothprice
        left = moneyLeft - price
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }

    if(chosenTablecloth != false){
        let tableclothprice = tableclothPrice * quantity
        price = price + tableclothprice
        left = moneyLeft - price     
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }

    if(chosenOverlay != false){
        let overlayprice = overlayPrice * quantity
        price = price + overlayprice
        left = moneyLeft - price
        setTotalPrice(price)
        setProxyMoneyLeft(left)
        return true
    }
    setTotalPrice(price)
    setProxyMoneyLeft(left)
  }
 
    let showTablecloths = () => {
        document.getElementById("drop").classList.toggle("show");
    }
    let showOverlays = () => {
        document.getElementById("drop1").classList.toggle("show");
    }
    const addTablecloth = (id,price) => {
        if (chosenTablecloth === id){
            setTableclothPrice(0)
            return setChosenTablecloth(false)
        }
        setTableclothPrice(price)
        setChosenTablecloth(id)
    }
    const addOverlay = (id,price) => {
        if (chosenOverlay === id){
            setOverlayPrice(0)
            return setChosenOverlay(false)
        }
        setOverlayPrice(price)
        setChosenOverlay(id)
    }

    const calculateNoTables = (name,guests) => {
      
      if(name === 'Round Table'){
        let no = guests/8
        no = Math.ceil(no)     
        return setReccomendedNoTables(no)
      } else if(name === 'Rectangle Table'){
        let no = guests/5
        no = Math.ceil(no)
        setReccomendedNoTables(no)
      }
    }

    
  return (
    <>
      <Navbar />
      <Steps active='tables'/>
      <div className='product'>
        <div className='product-images'>               
          <img src={`https://res.cloudinary.com/dgcbtjq3c/${table.image}`}  alt={table.name}/> 

        </div>

        <div className='product-details'>
                        
          <p className='pname' style={{marginTop:0,paddingTop:8}}>{table.name}</p>
          
          <p className='pbrand' style={{fontWeight:700,marginTop:10}}>{table.price} ksh</p>                
                              
          <p className='pbrand' style={{color:'black', paddingTop:8, fontSize:14, textAlign:'justify', lineHeight:1.5}}>{table.description}</p>            

          <hr className='pspace'></hr>

          <div className='sitcovers'>
            <button onClick={ showTablecloths} style={{marginBottom:20, marginTop:10}}>CHOOSE TABLECLOTH &darr;</button>
            <div className='sitcover' id='drop'>
            <p style={{paddingLeft:5}}>All colors are available</p>
                {tablecloths.map(tablecloth =>
                        
                    <div className='sitcover-child' key={tablecloth.id}>
                    
                        <img src={`https://res.cloudinary.com/dgcbtjq3c/${tablecloth.image}`}  alt={tablecloth.name}/>
                        
                        <p className='sitcover-name'>{tablecloth.name}</p>
                        <p className='sitcover-price'>{tablecloth.price} ksh</p>
                        {chosenTablecloth === tablecloth.id ? <button onClick={e => addTablecloth(tablecloth.id,tablecloth.price)} style={{backgroundColor:'#e6ae48'}}>Choosen</button> : <button onClick={e => addTablecloth(tablecloth.id,tablecloth.price)}>Choose</button>}
                    
                    </div>
                )}
                    
            </div>           

          </div>

          <div className='sitcovers'>
            <button onClick={ showOverlays} style={{backgroundColor: '#e6ae48'}}>CHOOSE OVERLAYS &darr;</button>
            <div className='sitcover' id='drop1'>
            <p style={{paddingLeft:5}}>All colors are available</p>
                {overlay.map(overlay =>
                        
                    <div className='sitcover-child' key={overlay.id}>
                    
                        <img src={`https://res.cloudinary.com/dgcbtjq3c/${overlay.image}`}  alt={overlay.name}/>
                        
                        <p className='sitcover-name'>{overlay.name}</p>
                        <p className='sitcover-price'>{overlay.price} ksh</p>
                        {chosenOverlay === overlay.id ? <button onClick={e => addOverlay(overlay.id,overlay.price)} style={{backgroundColor:'#e6ae48'}}>Choosen</button> : <button onClick={e => addOverlay(overlay.id,overlay.price)}>Choose</button>}
                    
                    </div>
                )}
                    
            </div>           

          </div>
       
          <hr className='pspace'></hr>

          <p className='pbrand' style={{marginTop:5}}>Recommended number of tables to fit all guets is <span>{reccomendedNoTables}</span></p>
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
              <Link to='/tables' className='next-back-child'><button >Add more tables</button></Link>
          
              <Link to='/decor' className='next-back-child'><button >Next</button></Link>
          </div>
        </div>
    </div>

    </>
  )
}

export default TableProduct
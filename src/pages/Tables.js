import React,{useEffect,useState}  from 'react'
import Steps from '../components/Steps'
import Navbar from '../components/Navbar'
import { Link } from "react-router-dom"

const Tables = () => {

  
  const [products, setProducts] = useState([])
    
  useEffect(() => {
      getProducts('table')
    }, []);
  
  async function getProducts(category) {
      let response = await fetch('https://seraphic-0kq8.onrender.com/quotation/products', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',             
          },                    
          body: JSON.stringify({category: category})
      });
      let data = await response.json();       
      setProducts(data.products);  
  }

  return (
    <>
    
    <Navbar />
    <Steps active='tables'/>
    <div className='col'>

      {products.map(product =>
                      
        <div className='col-child' key={product.id}>
          <Link to={`/table/${product.id}`}>
            <img src={`https://res.cloudinary.com/dywxtjhkl/${product.image}`}  alt={product.name}/>
            
            <p className='pname'>{product.name}</p>
            <p className='pprice'>{product.price} ksh</p>
          </Link>
        </div>
      )}

</div>
    </>
  )
}

export default Tables
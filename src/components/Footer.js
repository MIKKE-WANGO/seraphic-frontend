import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import FooterImg from "../assets/seraphic footer2.png"

import "../css/footer.css"
const Footer = () => {

  let navigate = useNavigate()
let logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('username')
  localStorage.removeItem('useremail')
  scrollToTop()
  return navigate('/')
  
}


const scrollToTop = () => {
  window.scrollTo(0,0)
}

  return (
   
        <footer>

            <div className='foot'>
                <img src={FooterImg}/>

                <div className='info'>
                  <div className='info-child'>
                    <h3>OUR ADDRESS</h3>
                    <h4>Head office</h4>
                    <p>Seraphic Grounds – Kiambu rd <br/> Four Way Junction Estate entrance<br/>Oppossite New Breed City Chapel.</p>

                  </div>
                  <div className='info-child'>
                    
                    <Link to="#" onClick={ logout}>&rarr;  Logout</Link>
                    <Link to='/Login'  onClick={e => scrollToTop(e)}>&rarr;  Login</Link>
                    <Link to='/start' onClick={e => scrollToTop(e)}> &rarr;  Create new quote</Link>
                    <Link to='/'  onClick={e => scrollToTop(e)}>&rarr;  Home</Link>
                   
                    
                  </div>
                  <div className='info-child'>
                    <Link to='/tents'  onClick={e => scrollToTop(e)}>&rarr;  Tents</Link>
                    <Link to='/chairs' onClick={e => scrollToTop(e)}>&rarr;  Chairs</Link>
                    <Link to='/tables' onClick={e => scrollToTop(e)}>&rarr;  Tables</Link>
                    <Link to='/decor' onClick={e => scrollToTop(e)}>&rarr;  Decor</Link>
                    <Link to='/review' onClick={e => scrollToTop(e)}>&rarr;  Review</Link>
                  </div>
                  
                  

                </div>

                <hr/>

                <div className='copyright'>
                  <p><i class="fa fa-copyright"></i> 2022 Seraphic Events Management. All Rights Reserved.</p>
                  <p>Developed by <a href='https://mikewango.com/' target="_blank" rel="noopener noreferrer">WANGO</a></p>
                </div>

            </div>
        </footer>
    
  )
}

export default Footer
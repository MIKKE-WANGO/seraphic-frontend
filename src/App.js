
import React ,{useState,useEffect}from 'react'

import {
  //BrowserRouter as Router,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Zoom} from 'react-toastify';

import Start from './pages/Start';
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import Steps from './components/Steps';
import Tents from './pages/Tents';
import Chairs from './pages/Chairs';
import Review from './pages/Review';
import Tables from './pages/Tables';
import Decor from './pages/Decor';
import TentProduct from './pages/TentProduct';

import ChairProduct from './pages/ChairProduct';
import TableProduct from './pages/TableProduct';
import Flower from './pages/Flower';
import Stage from './pages/Stage';
import Lighting from './pages/Lighting';
import DecorProduct from './pages/DecorProduct';
import Home from './pages/Home';
import Quote from './pages/Quote';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
       <Router>         
          <Routes>
          
            <Route path="/" element={<Home />}/>     
            <Route path="/start" element={<Start />}/>       
            <Route path="/reset-password" element={<RequestPasswordReset/>}/>           
            <Route path="/register" element={<Register/> }/>
            <Route path="/login" element={<Login  />}/>
            <Route path="/tents" element={<Tents />}/> 
            <Route path="/chairs" element={<Chairs />}/> 
            <Route path="/review" element={<Review />}/> 
            <Route path="/tables" element={<Tables />}/> 
            <Route path="/decor" element={<Decor />}/> 
            <Route path="/flowers" element={<Flower />}/> 
            <Route path="/stage" element={<Stage />}/> 
            <Route path="/lighting" element={<Lighting />}/> 

            <Route path="/tent/:id" element={<TentProduct />}/>
            
            <Route path="/quote/:id" element={<Quote />}/>
            <Route path="/chair/:id" element={<ChairProduct />}/>
            <Route path="/table/:id" element={<TableProduct />}/>
      
            <Route path="/decor/:id" element={<DecorProduct />}/>
            


            
                        
          </Routes>  
          
          <ToastContainer theme='dark' transition={Zoom} autoClose={1500} /> 
          <Footer/>                  
        </Router>
        
   

    </div>
  );
}

export default App;

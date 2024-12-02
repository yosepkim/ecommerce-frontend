import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import OrderConfirmation from './OrderConfirmation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='/products' exact={true} element={<ProductList/>}/>
        <Route path='/products/:id' element={<ProductDetail/>}/>
        <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
      </Routes>
    </Router>
  )
}

export default App;
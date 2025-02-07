import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes } from "react-router"

import Home from './Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import AddProduct from './AddProduct.jsx'
import EditProduct from './EditProduct.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* protected routes logged in user route  */}
        <Route>
          <Route
          path = "/" element = {<Home />}> 
          </Route>
          <Route
          path = "/add-product" element = {<AddProduct />}> 
          </Route>

          <Route
          path = "/edit-product" element = {<EditProduct />}> 
          </Route>
        </Route>


      {/* public route  */}
      <Route>
        <Route path = "/login" element = {<Login />}></Route>
        <Route path = "/register" element = {<Register />}></Route>
      </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

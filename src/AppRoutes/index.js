import React from 'react'
import UserForm from '../Pages/UserForm'
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";

import '../assets/css/bootstrap.css';
import '../assets/css/newstep-form.css';
import '../assets/css/custom.css';
const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserForm />} />
      <Route path='/:name' element={<UserForm />} />
    </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes
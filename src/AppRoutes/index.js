import React from 'react'
import UserForm from '../Pages/UserForm'
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
  import ScrollToTop from './../ScrollToTop';

import '../assets/css/bootstrap.css';
import '../assets/css/newstep-form.css';
import '../assets/css/custom.css';
const AppRoutes = () => {
  return (
    <BrowserRouter>
    <ScrollToTop>
      <Routes>
        <Route path='/' element={<UserForm />} />
        <Route path='/:name' element={<UserForm />} />
      </Routes>
    </ScrollToTop>
  </BrowserRouter>
  )
}

export default AppRoutes
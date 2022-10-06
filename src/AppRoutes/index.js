import React from 'react'
import UserForm from '../Pages/UserForm'
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<UserForm />} />
    </Routes>
  </BrowserRouter>
  )
}

export default AppRoutes
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import VoucherGenerator from "./pages/VoucherGenerator";

export default function App(){
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("auth")==="true");

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <VoucherGenerator onLogout={handleLogout}/> : <Login onLogin={handleLogin}/>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./Login";
import Register from './Register';
import Profile from './Profile';
import Dashboard from "./Dashboard";
import MySubGreddiit from "./MySubGreddiit";
import AllSubGreddiit from "./AllSubGreddiit";
import Page from "./Page";
import User from "./User";
import Requests from "./Requests";
import Stats from "./Stats";
import Reports from "./Reports";
import Saved from "./Saved";

function App() {
  const [currentForm, setCurrentForm] = useState("Login");
  
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="setForm">
      {
        <Routes>
        <Route path="/" element={currentForm === "Login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/MySubGreddiit" element={<MySubGreddiit/>}/>
        <Route path="/AllSubGreddiit" element={<AllSubGreddiit/>}/>
        <Route path="/subgreddiit/:subGreddiitId" element={<Page />} />
        <Route path="/subgreddiit/:subGreddiitId/users" element={<User/>}/>
        <Route path="/subgreddiit/:subGreddiitId/requests" element={<Requests/>}/>
        <Route path="/subgreddiit/:subGreddiitId/reports" element={<Reports/>}/>
        <Route path="/subgreddiit/:subGreddiitId/stats" element={<Stats/>}/>
        <Route path="/Saved" element={<Saved/>}/>
        </Routes>
      }
    </div>
    </BrowserRouter>
  );
}

export default App;
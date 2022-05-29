import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import PageNotFound from "./pages/404";
import ArcivePage from "./pages/arcive";
import RegisterPage from "./pages/register";
import Footer from "./components/footer";


import './App.css';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="/arcive" element={ <ArcivePage/> }/>
          <Route path="/register" element={ <RegisterPage/> }/>
          <Route path="*" element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;

import React from "react";
import "../stylesheets/Header.css";
import { Link } from "react-router-dom";
import { LogIn, Menu } from "lucide-react";

const Header = () => {
  return (
    <div className="header" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px",boxShadow:"0 2px 4px rgba(0,0,0,0.1)"}}>
     <Link to={"/profile"} style={{textDecoration:"none",color:"black"}}>
     <img src="https://img.icons8.com/?size=30&id=7820&format=png&color=000000"></img>
     </Link> 
      <h1>CivicOne</h1>
      <div>
      <span> <Link to={"/notifications"} style={{textDecoration:"none",color:"black"}}>
     <img src="https://img.icons8.com/?size=28&id=11642&format=png&color=000000"></img>
     </Link> </span>
      </div>
    </div>
  );
};

export default Header;

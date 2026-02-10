import React from "react";
import "../stylesheets/CategoryIcons.css";
import { Route, Trash2, Droplet, Lightbulb, Bell, Camera, House } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { label: "Capture", icon: <Camera size={28} />, path: "/report" },
  { label: "Garbage", icon: <Trash2 size={28} />, path: "/home" },
  { label: "Notifications", icon: <Bell size={28} />, path: "/notifications" },
  { label: "Nearby Issue", icon: <House size={28} />, path: "/feed" },
];

const CategoryIcons = () => {
  return (<>
  <center>
  <Link  to={"/report"} style={{textDecoration:"none"}}> <div className="report-button">
   
    <img src="https://img.icons8.com/?size=30&id=24717&format=png&color=000000"></img>
    <span style={{}}><b>Report an Issue</b></span>
   
  </div> </Link></center>
    <div className="categories">
      {categories.map((cat, idx) => (
        <Link to={cat.path} className="category" key={idx}>
          <div className="icon-wrapper">{cat.icon}</div>
          <p>{cat.label}</p>
        </Link>
      ))}
    </div>
    </>

  );
};

export default CategoryIcons;

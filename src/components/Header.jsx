import React from "react";
import { Link } from "react-router-dom";

const Header = ({ title }) => {
  return (
    <nav className="nav">
      <h2>{title}</h2>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Header;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Map from "./pages/Map.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Map />} />
    </Routes>
  );
};

export default App;

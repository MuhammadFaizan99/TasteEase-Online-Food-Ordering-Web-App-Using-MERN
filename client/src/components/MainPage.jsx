import React from "react";
import Navbar from "./Header/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";

export default function MainPage() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import { AuthContext } from "@/context/AuthContext";
import AuthGaurd from "@/gaurd/AuthGaurd";
import Profile from "@/pages/Profile";
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  
  return (
    <AuthGaurd>
     
      <div className="flex min-h-screen w-full flex-col ">
        <Navbar />
        <Outlet />
      </div>
    </AuthGaurd>
  );
};

export default MainLayout;

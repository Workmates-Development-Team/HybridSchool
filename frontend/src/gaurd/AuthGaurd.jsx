import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthGaurd = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      }

      
    
    }
     }, [loading, user]);
  return <>{children}</>;
};

export default AuthGaurd;

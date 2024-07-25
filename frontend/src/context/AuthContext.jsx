import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("api/v1/user/me");
      console.log(data);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("token");
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer ";
  };

  const getMentors = async () => {
    try {
      const { data } = await axiosInstance.get("api/v1/user/mentors");
      setMentors(data);

      console.log(data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    getMentors()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        getProfile,
        handleLogout,
        mentors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

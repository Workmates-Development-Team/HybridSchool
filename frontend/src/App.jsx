import React, { useContext } from "react";
import { Button } from "./components/ui/button";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import Content from "./pages/Content";
import Create from "./pages/Create";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';


import MyNotes from "./pages/MyNotes";
import QuizComponent from "./components/QuizComponent";
import RVR from "./components/ReactVideoRecorder";
import VideoRecorder from "./components/VideoRecorder";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          <Route path="" element={<Navigate to='/courses' />} />
          <Route path="courses" element={<Courses />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="courses/:id" element={<Content />} />
          <Route path="create/:id" element={<Create />} />

          <Route path="all-Notes" element={<MyNotes />} />
          
          <Route path="profile" element={<Profile />} />
          <Route path="quiz" element={<QuizComponent />} />
          
         
          
          
        </Route>
        <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          <Route path="/rvr" element={<RVR />} />
          <Route path="/video" element={<VideoRecorder />} />
      </Routes>
    </>
  );
};

export default App;

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import RecordRTC from "recordrtc";
import axios from "axios";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Lottie from "react-lottie";
import animationData from "../icon/Animation - 1716446246120.json";
import startRec from "../icon/startpng.png";

import { BHASHINI, MAIN_API } from "@/constants/path";



export default function HandleAudio() {
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalText, setTotaltext] = useState("");
  const [toggle, setToggle] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  //const [noteid, setNoteId] = useState();
  const { id } = useParams();

  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        if (recorderRef.current) {
          recorderRef.current.stopRecording(() => {
            const blob = recorderRef.current.getBlob();
            setChunks((prevChunks) => [...prevChunks, blob]);
            recorderRef.current.destroy(); // Destroy current recorder instance
            initializeRecorder(); // Initialize a new recorder instance
          });
        }
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isRecording]);

  useEffect(() => {
    if (chunks.length > 0) {
      const sendAudioToServer = async () => {
        const formData = new FormData();
        formData.append(`mp3File`, chunks[currentIndex], `audio.mp3`);
        setCurrentIndex((prev) => prev + 1);

        try {
          const languageCode = "en"; // This should be dynamically set based on your requirements

          const response = await axios.post(
            `${BHASHINI}voice-to-text-check?lang=${languageCode}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: false,
            }
          );

          console.log("API Response:", response.data);
          setTotaltext(totalText + " " + response.data.result);
        } catch (error) {
          console.error("Error sending audio to server:", error);
        }
      };

      sendAudioToServer();
    }
  }, [chunks]);

  const initializeRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error initializing recorder:", error);
    }
  };

  const startRecording = async () => {
    setOpenButton(false);
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });
      if (permissionStatus.state === "denied") {
        alert("Microphone Permission is required");
        return;
      }
      setToggle(true);
      initializeRecorder(); // Start a new recording
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setToggle(false);
    setOpenButton(true);
    if (recorderRef.current) {
      recorderRef.current.stopRecording(async () => {
        const blob = recorderRef.current.getBlob();
        setChunks((prevChunks) => [...prevChunks, blob]);
        recorderRef.current.destroy(); // Destroy current recorder instance
      });
    }
  };

  const saveContent = async () => {
    
    try {
        
        const response = await axios.post(MAIN_API+'api/v1/collections/'+id, {
            rawNotes: totalText, // Replace with actual data
            type: "voice" // Replace with actual data
        });

        // Handle the response
        console.log("Response data:", response.data);
        alert("file saved successfully");
    } catch (error) {
        // Handle errors
        console.error("Error posting data:", error);
    }
    



    setOpenButton(false);
    setTotaltext("");

    
    
        
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        
      }}

      className="h-full"

    >
      
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
         // height: "50%",
        }}
      >
        {toggle ? (
          <span onClick={stopRecording}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              style={{ objectFit: "contain" }}
              height={"40%"}
            width={"75%"}

            />
          </span>
        ) : (
          <img
            src={startRec}
            // height={"30%"}
            width={"20%"}
            alt="start"
            style={{ display: "block", objectFit: "contain" }}
            onClick={startRecording}
          />
        )}
        {openButton ? (
          <div>
            <button className="btn btn-success" onClick={saveContent}>
              Save your Content
            </button>
          </div>
        ) : null}
      </div>

      

      

      <div
        style={{
          flex: 1,
          backgroundColor: "lightpink",
          padding: "20px",
          height: "50%",
        }}
      >
        <textarea
          value={totalText}
          style={{
            width: "100%", // Full width
            height: "100%", // Set desired height
            padding: "10px", // Add padding for better readability
            border: "2px solid #ccc", // Add border
            borderRadius: "5px", // Add border radius for rounded corners
            backgroundColor: "black", // Set background color
            fontFamily: "Arial, sans-serif", // Set font family
            fontSize: "16px", // Set font size
            color: "white", // Set text color
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", // Add box shadow for depth
            resize: "none", // Disable textarea resizing
            outline: "none", // Disable outline
          }}
        >
          {totalText}
        </textarea>
      </div>
    </div>
  );
}

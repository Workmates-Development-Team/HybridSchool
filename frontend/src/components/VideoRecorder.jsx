import { MAIN_API } from "@/constants/path";
import React, { useState, useRef } from "react";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    // Create the video blob from recorded chunks
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    chunksRef.current = [];

    // Create a link element and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    // document.body.appendChild(a);
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");
    formData.append("rawNotes", "ffytfy");
    formData.append("type", "video");
    const id = "668d07f94a886e3ee7fd4d71";
    try {
      const response = await fetch(MAIN_API + "api/v1/collections/" + id, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Video uploaded successfully");
        alert("file saved successfully");
      } else {
        console.error("Video upload failed");
      }
    } catch (error) {
      console.error("Error uploading video: ", error);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <div>
        {!isRecording && (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {isRecording && <button onClick={stopRecording}>Stop Recording</button>}
      </div>
    </div>
  );
};

export default VideoRecorder;

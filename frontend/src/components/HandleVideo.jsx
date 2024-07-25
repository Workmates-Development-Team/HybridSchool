import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { MAIN_API } from '@/constants/path';
import { useParams } from 'react-router-dom';

const HandleVideo = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [chunks, setChunks] = useState([]);
  const {id} = useParams();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript((prevTranscript) => prevTranscript + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      console.log('Interim Transcript:', interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition:', event.error);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleListen = () => {
    setIsListening((prevState) => !prevState);
  };




  
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setChunks((prev) => [...prev, event.data]);
          }
        };
        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error('Error accessing webcam: ', err);
      }
    };

    getUserMedia();
  }, []);

  useEffect(() => {
    let timerInterval;
    if (recording) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
      setTimer(0);
    }
    return () => clearInterval(timerInterval);
  }, [recording]);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      console.log(transcript);
      saveVideo();
    }
  };

  const saveVideo = async () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    formData.append('rawNotes',transcript);
    formData.append('type', 'video');

    try {
      const response = await fetch(MAIN_API+'api/v1/collections/'+id, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('Video uploaded successfully');
        alert("file saved successfully");
      } else {
        console.error('Video upload failed');
      }
    } catch (error) {
      console.error('Error uploading video: ', error);
    }
    setChunks([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', position: 'relative' }}>
      <div style={{ marginBottom: '10px', zIndex: 1 }}>
        {!recording ? (
          <FontAwesomeIcon icon={faPlay} size="2x" onClick={()=>{startRecording(),handleListen()}} />
        ) : (
          <FontAwesomeIcon icon={faStop} size="2x" onClick={()=>{handleListen(),stopRecording()}} />
        )}
      </div>
    
      <div style={{ position: 'relative', width: '50%', height: '50%', zIndex: 0 }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%' }}></video>
      </div>
      {recording && (
        <div style={{ color: 'red', fontSize: '20px', position: 'relative', top: '10px', zIndex: 2 }}>
          {formatTime(timer)}
        </div>
      )}
      <p> <u>The class Trascript</u> </p>
      <p>{transcript}</p>
    </div>
  );
};

export default HandleVideo;

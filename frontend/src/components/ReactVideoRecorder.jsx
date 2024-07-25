import React from 'react'
import VideoRecorder from 'react-video-recorder'

const RVR = () => (
  <VideoRecorder
    onRecordingComplete={(videoBlob) => {
      // Do something with the video...
      
      console.log('videoBlob', videoBlob)
    }}

    
  />
)

export default RVR
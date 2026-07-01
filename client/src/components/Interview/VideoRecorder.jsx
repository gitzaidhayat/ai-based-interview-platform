import React, { useState, useRef, useEffect } from 'react';
import './VideoRecorder.css';

const VideoRecorder = ({ shouldStart = false }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (shouldStart) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [shouldStart]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setIsStreaming(true);
            setError('');
          }).catch(err => {
            console.error('Error playing video:', err);
            setError('Failed to start video playback');
          });
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please enable camera permissions.');
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const toggleCamera = () => {
    if (isStreaming) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="video-recorder">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
          style={{ display: isStreaming ? 'block' : 'none' }}
        />
        {!isStreaming && (
          <div className="video-placeholder">
            <div className="placeholder-icon">📹</div>
            <p>Camera {error ? 'disabled' : 'off'}</p>
            {error && <p className="error-text">{error}</p>}
          </div>
        )}
      </div>
      
      <div className="video-controls">
        <button 
          onClick={toggleCamera}
          className={`camera-toggle ${isStreaming ? 'active' : ''}`}
        >
          {isStreaming ? '📹 Camera On' : '📹 Camera Off'}
        </button>
      </div>
      
      <div className="video-info">
        <p className="info-text">
          {isStreaming ? 'Recording enabled for practice' : 'Camera is optional'}
        </p>
      </div>
    </div>
  );
};

export default VideoRecorder;

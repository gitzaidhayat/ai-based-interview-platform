import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognition = ({ isRecording, onTranscriptChange, transcript, shouldStart = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition once
  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        setInterimTranscript(interim);
        
        if (finalTranscript.trim()) {
          onTranscriptChange((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isRecording) {
          // Restart if still recording
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch (error) {
            console.log('Failed to restart speech recognition');
          }
        }
      };
    } else {
      setIsSupported(false);
    }
  }, [isRecording, onTranscriptChange, shouldStart]);

  // Start/stop speech recognition
  useEffect(() => {
    if (isSupported && recognitionRef.current) {
      if (isRecording) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          console.log('Speech recognition started');
        } catch (error) {
          console.log('Failed to start speech recognition:', error);
          setIsListening(false);
        }
      } else {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
          setInterimTranscript('');
          console.log('Speech recognition stopped');
        } catch (error) {
          console.log('Failed to stop speech recognition:', error);
        }
      }
    }
  }, [isRecording, isSupported]);

  const handleManualInput = (e) => {
    onTranscriptChange(e.target.value);
  };

  if (!isSupported) {
    return (
      <div className="speech-recognition">
        <div className="manual-input">
          <label htmlFor="manual-answer">Type your answer:</label>
          <textarea
            id="manual-answer"
            value={transcript}
            onChange={handleManualInput}
            placeholder="Type your answer here..."
            className="answer-textarea"
            rows="6"
          />
          <p className="speech-note">
            Speech recognition is not supported in your browser. Please type your answer manually.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="speech-recognition">
      <div className="recording-status">
        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot"></span>
            {isListening ? 'Listening...' : 'Starting...'}
          </div>
        )}
      </div>
      
      <div className="transcript-section">
        <label htmlFor="answer-input">Your Answer:</label>
        <textarea
          id="answer-input"
          value={transcript}
          onChange={handleManualInput}
          placeholder={isRecording ? "Speak your answer or type here..." : "Type your answer here..."}
          className="answer-textarea"
          rows="6"
        />
        
        {interimTranscript && (
          <div className="interim-transcript">
            <small>Heard: {interimTranscript}</small>
          </div>
        )}
      </div>
      
      <div className="speech-tips">
        <p className="tip">
          💡 Speak clearly and at a moderate pace for best results
        </p>
        <p className="tip">
          🎤 You can also type your answer if you prefer
        </p>
        {!isListening && isRecording && (
          <p className="tip text-amber-600">
            ⚠️ Microphone not working - please use manual input
          </p>
        )}
      </div>
    </div>
  );
};

export default SpeechRecognition;

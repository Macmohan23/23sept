import { useState, useRef, useCallback } from 'react';
import { apiUpload } from '@/api/client';

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = useCallback((stream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { 
          type: 'video/webm' 
        });
        setRecordedBlob(blob);
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Capture data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const uploadRecording = useCallback(async (
    candidateId, 
    interviewId
  ) => {
    if (!recordedBlob) return null;

    try {
      // Use backend upload endpoint
      const file = new File([recordedBlob], `interview-${interviewId || 'na'}-${Date.now()}.webm`, { type: 'video/webm' });
      const res = await apiUpload('/api/upload', file, 'video');
      // res.path is like /uploads/<file>
      return res.path;
    } catch (error) {
      console.error('Error uploading recording:', error);
      return null;
    }
  }, [recordedBlob]);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
    recordedChunksRef.current = [];
  }, []);

  return {
    isRecording,
    recordedBlob,
    startRecording,
    stopRecording,
    uploadRecording,
    resetRecording
  };
};
import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StopIcon from "@mui/icons-material/Stop";

function CameraVideoCapture({ handleFileUpload }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]); 
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    let interval = null;
    if (recording) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const startCamera = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);
      chunksRef.current = [];
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];  
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      if (blob.size === 0) {
        console.warn("Recorded blob size is 0. No data recorded.");
        setRecording(false);
        return;
      }
      const file = new File([blob], `recorded_${Date.now()}.webm`, {
        type: "video/webm",
      });
handleFileUpload({
  target: {
    name: "uploadVideo",
    files: [file],
  },
});
      setRecording(false);
      setElapsedTime(0);
      chunksRef.current = [];
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setRecording(false);
      setElapsedTime(0);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  return (
    <Box sx={{ my: 2 }}>
      {!stream ? (
        <IconButton onClick={startCamera} color="action" aria-label="Start Camera">
          <VideoCameraFrontIcon fontSize="large" />
        </IconButton>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", maxHeight: 300, marginBottom: 10 }}
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {!recording ? (
              <IconButton color="error" onClick={startRecording}>
                <FiberManualRecordIcon fontSize="large" />
              </IconButton>
            ) : (
              <>
                <IconButton color="primary" onClick={stopRecording}>
                  <StopIcon fontSize="large" />
                </IconButton>
                <Typography variant="body1" color="error" sx={{ ml: 1, fontWeight: "bold" }}>
                  {formatTime(elapsedTime)}
                </Typography>
              </>
            )}
            <IconButton onClick={stopCamera} color="default">
              <VideocamOffIcon fontSize="large" />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}

export default CameraVideoCapture;

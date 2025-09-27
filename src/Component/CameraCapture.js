import { useRef, useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import piexif from 'piexifjs';

function CameraCapture({ handleFileUpload }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); 

  useEffect(() => {
    if (streaming) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Camera access error:', err);
        });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }
  }, [streaming, facingMode]);

  const handleDoubleClick = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    console.log(facingMode)
  };

  const capturePhoto = async () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg')
  );

  if (!blob) {
    alert("Failed to capture image blob.");
    return;
  }

  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });


  const gps = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: true }
    );
  });

  if (!gps) {
    alert("Could not retrieve GPS location.");
    return;
  }

  const degToDms = (deg) => {
    const d = Math.floor(deg);
    const minFloat = (deg - d) * 60;
    const m = Math.floor(minFloat);
    const s = (minFloat - m) * 60;
    return [[d, 1], [m, 1], [Math.round(s * 100), 100]];
  };

  const latRef = gps.latitude >= 0 ? "N" : "S";
  const lonRef = gps.longitude >= 0 ? "E" : "W";

  let exifObj = piexif.load(base64);
  exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef] = latRef;
  exifObj["GPS"][piexif.GPSIFD.GPSLatitude] = degToDms(Math.abs(gps.latitude));
  exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef] = lonRef;
  exifObj["GPS"][piexif.GPSIFD.GPSLongitude] = degToDms(Math.abs(gps.longitude));

  const exifBytes = piexif.dump(exifObj);
  const newData = piexif.insert(exifBytes, base64);

  const byteString = atob(newData.split(",")[1]);
  const mimeString = newData.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const geotaggedBlob = new Blob([ab], { type: mimeString });
  const file = new File([geotaggedBlob], `geotagged_${Date.now()}.jpg`, {
    type: "image/jpeg",
  });

  handleFileUpload(
    {
      target: {
        name: "uploadImage",
        files: [file],
      },
    },
    gps
  );
};



  return (
    <Box sx={{ my: 2 }}>
      {!streaming ? (
        <IconButton onClick={() => setStreaming(true)} color="action" aria-label="Start Camera">
          <VideoCameraFrontIcon fontSize="large" />
        </IconButton>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onDoubleClick={handleDoubleClick}
            style={{ width: '100%', maxHeight: 300, marginBottom: 10 }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="success" onClick={capturePhoto}>
              <CameraAltIcon fontSize="large" />
            </IconButton>
            <IconButton color="error" onClick={() => setStreaming(false)}>
              <VideocamOffIcon fontSize="large" />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}

export default CameraCapture;

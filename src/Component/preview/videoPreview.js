import React, { useEffect, useState } from "react";
import { Box } from "@mui/material"; // assuming you're using MUI

function VideoPreview({ videos, onRemove, handleOpen }) {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const newUrls = videos.map(file => URL.createObjectURL(file));
    setUrls(newUrls);

    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [videos]);

  return (
    <>
      {urls.map((url, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            width: 100,
            height: 80,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #ddd',
          }}
        >
          <video
          onClick={() => handleOpen({url:url, type:"video"})}
            src={url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
            // controls
          />
          <Box
            onClick={() => onRemove(index)}
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '50%',
              width: 20,
              height: 20,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '20px',
              cursor: 'pointer',
            }}
          >
            &times;
          </Box>
        </Box>
      ))}
    </>
  );
}

export default VideoPreview;

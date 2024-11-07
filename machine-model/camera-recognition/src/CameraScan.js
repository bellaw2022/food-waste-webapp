import React, { useRef, useEffect, useState } from 'react';

const CameraScan = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraAvailable(true);
        }
      } catch (err) {
        console.error("Unable to access camera:", err);
        setIsCameraAvailable(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!isCameraAvailable) {
      alert("Camera isn't available");
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas load failed");
      setIsScanning(false);
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      console.error("Unable to load Canvas context");
      setIsScanning(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Set central box
    const boxSize = Math.min(canvas.width, canvas.height) * 0.6;
    const startX = (canvas.width - boxSize) / 2;
    const startY = (canvas.height - boxSize) / 2;

    const imageData = context.getImageData(startX, startY, boxSize, boxSize);

    // Save cropped picture in box
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = boxSize;
    cropCanvas.height = boxSize;
    const cropContext = cropCanvas.getContext('2d');
    cropContext.putImageData(imageData, 0, 0);

    cropCanvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to get image from Canvas");
        setIsScanning(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      try {
        const response = await fetch('http://localhost:8000/scan', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed reason: ${response.statusText}`);
        }

        const data = await response.json();
        setScanResult(data);
        setCapturedImage(URL.createObjectURL(blob));

        // Pause video when view the scan result
        video.pause();
      } catch (error) {
        console.error("Failed to scan:", error);
        alert("Failed to scan, please try again");
      } finally {
        setIsScanning(false);
      }
    }, 'image/jpeg');
  };

  const handleConfirm = () => {
    // Clean captured image, resume video
    setCapturedImage(null);
    setScanResult(null);
    const video = videoRef.current;
    if (video) {
      video.play();
    }
  };

  const handleRetake = () => {
    // Cancel captured image, resume video
    setCapturedImage(null);
    setScanResult(null);
    const video = videoRef.current;
    if (video) {
      video.play();
    }
  };

  return (
    <div style={styles.container}>
      <h1>Scan grocery</h1>
      <div style={styles.videoContainer}>
        <video ref={videoRef} style={styles.video} autoPlay playsInline />
        <div style={styles.overlay}>
          <div style={styles.box}></div>
        </div>

      </div>
      {!capturedImage && (
        <button onClick={handleScan} style={styles.button} disabled={isScanning || !isCameraAvailable}>
          {isScanning ? 'Scanning...' : 'Scan'}
        </button>
      )}
      {capturedImage && (
        <div style={styles.confirmContainer}>
          <button onClick={handleConfirm} style={styles.confirmButton}>OK</button>
          <button onClick={handleRetake} style={styles.retakeButton}>Scan Again</button>
        </div>
      )}
      {scanResult && (
        <div style={styles.resultContainer}>
          <h2>Result:</h2>
          <pre>{JSON.stringify(scanResult, null, 2)}</pre>
        </div>
      )}

      <canvas ref={canvasRef} style={styles.hiddenCanvas} />
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  videoContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px',
  },
  video: {
    width: '640px',
    height: '480px',
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '640px',
    height: '480px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  box: {
    width: '60%',
    height: '60%',
    border: '4px solid #00FFFF',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  hiddenCanvas: {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
  },
  confirmContainer: {
    marginTop: '20px',
  },
  confirmButton: {
    padding: '10px 20px',
    fontSize: '16px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  retakeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  capturedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '640px',
    height: '480px',
    objectFit: 'cover',
    opacity: 0.7,
    pointerEvents: 'none',
  },
  resultContainer: {
    marginTop: '20px',
    textAlign: 'left',
    display: 'inline-block',
    maxWidth: '640px',
    wordBreak: 'break-word',
  },
};

export default CameraScan;

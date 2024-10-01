import React, { useState } from 'react';

const FoodScanningPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [scanResult, setScanResult] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleScan = async () => {
        if (!selectedFile) {
            alert('Please upload a food image');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/scan', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setScanResult(data.result);
        } catch (error) {
            console.error('Error scanning food:', error);
        }
    };

    return (
        <div>
            <h2>Food Scanning</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleScan}>Scan Food</button>
            {scanResult && <p>Scanned Food: {scanResult}</p>}
        </div>
    );
};

export default FoodScanningPage;

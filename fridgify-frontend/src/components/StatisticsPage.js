import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsPage = () => {
  const [wasteSavings, setWasteSavings] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/user/1/wastesaving')
      .then(response => {
        
        console.log(response.data);
        setWasteSavings(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the waste savings data!", error);
      });
  }, []);

  return (
    <div>
      <h2>Waste Savings Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount Saved (kg)</th>
            <th>CO2 Saved (kg)</th>
          </tr>
        </thead>
        <tbody>
          {wasteSavings.length > 0 ? (
            wasteSavings.map((saving) => (
              <tr key={saving.user_waste_id}>
                <td>{saving.date}</td>
                <td>{saving.amount_saved}</td>
                <td>{saving.co2_saved}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No waste savings data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsPage;

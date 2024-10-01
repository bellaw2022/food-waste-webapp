import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './components/ProfilePage';
import Statistics from './components/StatisticsPage';
import ReceiptRecommendation from './components/ReceiptRecommendationPage';
import InventoryPage from './components/InventoryPage';
import ScanningPage from './components/FoodScanningPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li>
              <Link to="/statistics">Statistics</Link>
            </li>
            <li>
              <Link to="/receipt-recommendation">Receipt Recommendation</Link>
            </li>
            <li>
              <Link to="/scanning">Food Scanning</Link> {/* Link for Scanning Page */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/receipt-recommendation" element={<ReceiptRecommendation />} />
          <Route path="/scanning" element={<ScanningPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Welcome to Fridgify!</h2>;
}

export default App;

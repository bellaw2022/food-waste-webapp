import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScanningPage from './pages/scanning';

function App() {
  return (
    <Router>
      <div className="m-0">
          {/* <nav>
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
                      <Link to="/scanning">Food Scanning</Link>
                  </li>
              </ul>
          </nav> */}

          <Routes>
              {/* <Route path="/" element={<Home profile={profile} login={login} logOut={logOut} />} /> */}
              {/* <Route path="/profile" element={<Profile />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/receipt-recommendation" element={<ReceiptRecommendation />} /> */}
              <Route path="/scanning" element={<ScanningPage />} />
          </Routes>
      </div>
    </Router>
  )
}

export default App;

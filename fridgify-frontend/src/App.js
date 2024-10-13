// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Profile from './components/ProfilePage';
// import Statistics from './components/StatisticsPage';
// import ReceiptRecommendation from './components/ReceiptRecommendationPage';
// import InventoryPage from './components/InventoryPage';
// import ScanningPage from './components/FoodScanningPage';
// import { GoogleLogin } from '@react-oauth/google';
// function App() {
//   const responseMessage = (response) => {
//     console.log(response);
//   };
//   const errorMessage = (error) => {
//       console.log(error);
//   };
//   return (
//     <Router>
//       <div className="App">
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/profile">Profile</Link>
//             </li>
//             <li>
//               <Link to="/inventory">Inventory</Link>
//             </li>
//             <li>
//               <Link to="/statistics">Statistics</Link>
//             </li>
//             <li>
//               <Link to="/receipt-recommendation">Receipt Recommendation</Link>
//             </li>
//             <li>
//               <Link to="/scanning">Food Scanning</Link> {/* Link for Scanning Page */}
//             </li>
//           </ul>
//         </nav>

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/inventory" element={<InventoryPage />} />
//           <Route path="/statistics" element={<Statistics />} />
//           <Route path="/receipt-recommendation" element={<ReceiptRecommendation />} />
//           <Route path="/scanning" element={<ScanningPage />} /> 
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function Home() {
//   return <h2>Welcome to Fridgify!</h2>;
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

import Profile from './components/ProfilePage';
import Statistics from './components/StatisticsPage';
import ReceiptRecommendation from './components/ReceiptRecommendationPage';
import InventoryPage from './components/InventoryPage';
import ScanningPage from './components/FoodScanningPage';

function App() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log('Login Success:', codeResponse);
            setUser(codeResponse);
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
    });

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    console.log('Profile Data:', res.data);
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
    };

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
                            <Link to="/scanning">Food Scanning</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home profile={profile} login={login} logOut={logOut} />} />
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

function Home({ profile, login, logOut }) {
    return (
        <div>
            <h2>Welcome to Fridgify!</h2>
            <br />
            {profile ? (
                <div>
                    <img src={profile.picture} alt="User" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google </button>
            )}
        </div>
    );
}

function Root() {
    return (
        <GoogleOAuthProvider clientId="647856339439-ch1qle9m7uqdu41f5fsen6soqd019cua.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    );
}

export default Root;

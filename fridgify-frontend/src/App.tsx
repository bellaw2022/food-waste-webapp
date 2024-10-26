import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import ScanningPage from './pages/scanning';
import { useEffect, useState } from 'react';
import Home from './pages/home';
import axios from 'axios';

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
                    <Route path="/" element={<Home profile={profile} login={login} logOut={logOut} />} />
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

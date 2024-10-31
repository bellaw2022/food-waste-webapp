import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, ScanningPage, InventoryPage } from '@/pages';
import { useOAuth } from "@/hooks";

function App() {
    const { profile, login, logOut } = useOAuth();

    return (
        <Router>
            <div className="m-0">
                <Routes>
                    <Route path="/" element={<HomePage profile={profile} login={login} logOut={logOut} />} />
                    {/* <Route path="/profile" element={<Profile />} /> */}
                    <Route path="/inventory" element={<InventoryPage />} />
                    {/* <Route path="/statistics" element={<Statistics />} />
                    <Route path="/receipt-recommendation" element={<ReceiptRecommendation />} /> */}
                    <Route path="/scanning" element={<ScanningPage />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App;

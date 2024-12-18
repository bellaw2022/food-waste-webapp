import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage, BeginScanningPage, FinishScanningPage, InventoryPage, RecipePage, ProfilePage} from '@/pages';
import { useOAuth } from "@/hooks";
import { Navbar } from '@/components/shared';
import { Toaster } from '@/components/ui/toaster';
import { ProfileProvider } from "@/context/ProfileContext";

function App() {
    const { profile, login, logOut } = useOAuth();

    return (
        <ProfileProvider>
            <Router>
                <div className="m-0 p-0 relative">
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<HomePage profile={profile} login={login} logOut={logOut} />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/recipe" element={<RecipePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/scan" element={<BeginScanningPage />} />
                        <Route path="/scan/finish" element={<FinishScanningPage />} />
                    </Routes>
                    <Toaster />
                </div>
            </Router>
        </ProfileProvider>
        
    )
}

export default App;

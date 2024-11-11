import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from "@tanstack/react-query";
import { HomePage, BeginScanningPage, FinishScanningPage, InventoryPage, RecipePage, ProfilePage} from '@/pages';
import { useOAuth } from "@/hooks";
import { Navbar } from '@/components/shared';
import { Toaster } from '@/components/ui/sonner';
import APIClient from "@/api";

function App() {
    const { profile, login, logOut } = useOAuth();
    return (
        <QueryClientProvider client={APIClient}>
            <Router>
                <div className="m-0 p-0">
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
        </QueryClientProvider>
    )
}

export default App;

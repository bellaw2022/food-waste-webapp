import { AppProvider } from './AppContext';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage, BeginScanningPage, FinishScanningPage, InventoryPage, RecipePage, ProfilePage} from '@/pages';
import { Navbar } from '@/components/shared';
import { Toaster } from '@/components/ui/toaster';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="m-0 p-0 relative">
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/recipe" element={<RecipePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/scan" element={<BeginScanningPage />} />
                        <Route path="/scan/finish" element={<FinishScanningPage />} />
                    </Routes>
                    <Toaster />
                </div>
            </Router>
        </AppProvider>
    )
}

export default App;

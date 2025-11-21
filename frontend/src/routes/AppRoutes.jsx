import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                {/* Add other routes here e.g., <Route path="bikes" element={<BikesPage />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;

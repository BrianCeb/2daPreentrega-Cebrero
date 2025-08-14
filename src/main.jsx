import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import AlumnosPage from './pages/Alumnospage';
import IngresosPage from './pages/Ingresospage';
import InicioPage from './pages/InicioPage';
import PagosPage from './pages/PagosPage';
import RealTimePage from './pages/RealTimePage';
import UploadImagePage from './pages/UploadImagePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        
        <HashRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<InicioPage />} />
                <Route path="/alumnos" element={<AlumnosPage />} />
                <Route path="/ingresos" element={<IngresosPage />} />
                <Route path="/pagos" element={<PagosPage />} />
                <Route path="/realtimealumnos" element={<RealTimePage />} />
                <Route path="/upload-image" element={<UploadImagePage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
            </HashRouter>
        
            
    </React.StrictMode>
);

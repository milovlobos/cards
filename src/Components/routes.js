import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserAuth } from "./AuthContext"
import Inicio from "../Pages/Inicio";
import Signup from "../Pages/Signup";
import Crear from "../Pages/Crear";
import Practicar from "../Pages/Practicar";
import Editar from "../Pages/Editar";
import ResponsiveAppBar from "./Navbar";
import Loader2 from './loader2';
import { useState, useEffect } from 'react';

export function MyRoutes() {
    const { user } = UserAuth();
    const [loadingUser, setLoadingUser] = useState(true);
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPage(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user !== null) {
            setLoadingUser(false);
        }
    }, [user]);

    const RequireAuth = ({ children }) => {
        return user ? children : <Navigate to="/signup" />;
    }

    return (
        <Router>
            <div className='App'>
                {loadingUser && <Loader2 />}
                {showPage && (
                    <>
                        <ResponsiveAppBar />
                        <Routes>
                            <Route path="*" element={<Loader2 />} />
                            <Route path="/" element={<Loader2 />} />
                            <Route path="/inicio" element={<RequireAuth><Inicio /></RequireAuth>} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/cards" element={<Navigate to="/" />} />
                            <Route path="/crear" element={<RequireAuth><Crear /></RequireAuth>} />
                            <Route path="/practicar" element={<RequireAuth><Practicar /></RequireAuth>} />
                            <Route path="/editar/:userId/:uuid" element={<RequireAuth><Editar /></RequireAuth>} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
}

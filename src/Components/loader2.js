import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from './AuthContext';
import Box from "@mui/material/Box";
import { SpinnerDotted } from 'spinners-react';

const styles = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

function Loader2() {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const timer = setTimeout(() => {
            if (location.pathname === '/' && user) {
                navigate('/inicio');
            } else if (location.pathname === '/' && !user) {
                navigate('/signup');
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [user, location, navigate]);

    return (
        <div className="loader">
            <Box sx={styles} textAlign="center">
                <SpinnerDotted size={250} thickness={100} speed={100} color="rgba(57, 157, 172, 1)" />
            </Box>
        </div>
    );
}

export default Loader2;
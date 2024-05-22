import React from 'react';
import Box from "@mui/material/Box";
import { SpinnerDotted } from 'spinners-react';

const styles = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

function Loader() {

    return (
        <div className="loader">
            <Box sx={styles} textAlign="center">
                <SpinnerDotted size={150} thickness={100} speed={100} color="rgba(57, 157, 172, 1)"/>
            </Box>
        </div>
    );
}

export default Loader;
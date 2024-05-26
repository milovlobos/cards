import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { auth } from "../firebase";
import { UserAuth } from '../Components/AuthContext';

const styles = {
  form: {
    width: "20rem",
    margin: "auto",
    padding: "1rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
  },
  title: {
    textAlign: "center",
  },
};

const Signup = () => {
  const {user, googleSignIn} = UserAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      await googleSignIn();
      console.log('Usuario logueado:', auth.currentUser.uid);
  } catch (error) {
    setError(error.message);
  }
};

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Box sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={styles.title}>Registrieren</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <Box mt={2} textAlign="center">
            <Button variant="contained" color="secondary" onClick={iniciarSesion}>
              Anmelden
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default Signup;
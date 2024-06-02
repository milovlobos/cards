import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { UserAuth } from '../Components/AuthContext';
import { auth } from "../firebase"; // Importiere auth aus deiner Firebase-Konfiguration

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
  const { user, googleSignIn, signInWithEmail } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const anmeldenMitGoogle = async () => {
    try {
      await googleSignIn();
      console.log('Benutzer angemeldet:', auth.currentUser.uid);
    } catch (error) {
      setError(error.message);
    }
  };

  const anmeldenMitEmail = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Box sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={styles.title}>Anmelden</h2>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={anmeldenMitEmail}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Passwort"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box mt={2} textAlign="center">
            <Button type="submit" variant="contained" color="primary">
              Anmelden
            </Button>
          </Box>
        </form>
        <Box mt={2} textAlign="center">
          <Button variant="contained" color="secondary" onClick={anmeldenMitGoogle}>
            Mit Google anmelden
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Signup;

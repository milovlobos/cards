import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { uid } from "uid";
import { set, ref } from "firebase/database";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { UserAuth } from "../Components/AuthContext";
import textElement from "../Components/textFieldElement";

const styles = {
  form: {
    width: "80%",
    margin: "auto",
    padding: "1rem",
    borderRadius: "8px",
  },
  title: {
    textAlign: "center",
  },
};

const currencies = [
  {
    value: 'Nomen',
  },
  {
    value: 'Verb',
  },
  {
    value: 'Adverb/Adjektiv',
  },
];
function Crear() {
  const [formData, setFormData] = useState({
    wordType: "",
    rootWord: "",
    bedeutung: "",
    artikel: "",
    plural: "",
    konjugation: "",
    perfekt: "",
    konjunktiv2: "",
    prateritum: "",
  });

  const navigate = useNavigate();
  const { user } = UserAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const { wordType, ...data } = formData;
    const uuid = uid();
    const userEmail = user.email;
    const userId = user.uid;
    const cardRef = ref(db, `users/${userId}/${uuid}`);
    set(cardRef, {
      wordType,
      ...data,
      userEmail,
      userId,
      uuid,
    });

    setFormData({
      wordType: "",
      rootWord: "",
      bedeutung: "",
      artikel: "",
      plural: "",
      konjugation: "",
      perfekt: "",
      konjunktiv2: "",
      prateritum: "",
    });

    navigate("/inicio");
  };

  return (
    <div>
      <Paper elevation={3} sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={styles.title}>Agregar nueva palabra</h2>
        </div>
        <form onSubmit={handleSubmit} >
          <TextField
            fullWidth
            id="rootWord"
            name="rootWord"
            label="Wort"
            value={formData.rootWord}
            onChange={handleChange}
            variant="outlined"
            autoComplete="off"
          />
          <div>
            <TextField
              id="wordType"
              name="wordType"
              fullWidth
              select
              label="Wortart"
              value={formData.wordType}
              onChange={handleChange}
              variant="outlined"
              sx={{ marginY: "15px" }}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {formData.wordType === "Nomen" && (
            <>
              {textElement("bedeutung", formData, handleChange)}
              {textElement("artikel", formData, handleChange)}
              {textElement("plural", formData, handleChange)}
            </>
          )}
          {formData.wordType === "Verb" && (
            <>
              {textElement("bedeutung", formData, handleChange)}
              {textElement("konjugation", formData, handleChange)}
              {textElement("perfekt", formData, handleChange)}
              {textElement("konjunktiv2", formData, handleChange)}
              {textElement("prateritum", formData, handleChange)}
            </>
          )}
          {formData.wordType === "Adverb/Adjektiv" && (
            <>
              {textElement("bedeutung", formData, handleChange)}
            </>
          )}
          <Box mt={5} textAlign="center">
            <Button variant="contained" color="primary" type="submit">
              Speichern
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
}

export default Crear;
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
    label: 'Nomen',
  },
  {
    value: 'Verb',
    label: 'Verb',
  },
  {
    value: 'Adverb/Adjektiv',
    label: 'Adverb/Adjektiv',
  },
];

function Crear() {
  const [formData, setFormData] = useState({
    wordType: "",
    rootWord: "",
    meaning: "",
    article: "",
    plural: "",
    conjugation: "",
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
      meaning: "",
      article: "",
      plural: "",
      conjugation: "",
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
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {formData.wordType === "Nomen" && (
            <>
              <TextField
                fullWidth
                id="meaning"
                name="meaning"
                label="Bedeutung"
                value={formData.meaning}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
              />
              <TextField
                fullWidth
                id="article"
                name="article"
                label="Artikel"
                value={formData.article}
                onChange={handleChange}
                sx={{ marginY: "15px" }}
                variant="outlined"
              />
              <TextField
              fullWidth
              id="plural"
              name="plural"
              label="Plural"
              value={formData.plural}
              onChange={handleChange}
              autoComplete="off"
              variant="outlined"
            />
            </>
          )}
          {formData.wordType === "Verb" && (
            <>
              <TextField
                fullWidth
                id="meaning"
                name="meaning"
                label="Bedetung"
                value={formData.meaning}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
              />
              <TextField
                fullWidth
                id="conjugation"
                name="conjugation"
                label="Konjugation"
                value={formData.conjugation}
                onChange={handleChange}
                variant="outlined"
                autoComplete="off"
                sx={{ marginY: "15px" }}
              />
              <TextField
                fullWidth
                id="perfekt"
                name="perfekt"
                label="Perfekt"
                value={formData.perfekt}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
              />
              <TextField
                fullWidth
                id="konjunktiv2"
                name="konjunktiv2"
                label="Konjunktiv II"
                value={formData.konjunktiv2}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
                sx={{ marginY: "15px" }}
              />
              <TextField
                fullWidth
                id="prateritum"
                name="prateritum"
                label="Präteritum"
                value={formData.prateritum}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
              />
            </>
          )}
          {formData.wordType === "Adverb/Adjektiv" && (
            <TextField
              fullWidth
              id="meaning"
              name="meaning"
              label="Bedeutung"
              value={formData.meaning}
              onChange={handleChange}
              variant="outlined"
              autoComplete="off"
            />
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
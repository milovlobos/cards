import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import { MenuItem, TextField, Button, Box, Stack } from "@mui/material";

const styles = {
  form: {
    width: "30rem",
    margin: "auto",
    padding: "1rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
  },
  title: {
    textAlign: "center",
  },
};

const centerStyles = {
  display: 'flex',
  justifyContent: 'center',
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

const Editar = () => {
  const { userId, uuid } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, `users/${userId}/${uuid}`));
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, uuid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      await update(ref(db, `users/${userId}/${uuid}`), {
        ...formData,
      });
      navigate("/inicio");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };


  return (
    <div>
      <Box sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={styles.title}>Editar palabra</h2>
        </div>
        <form onSubmit={handleSubmit}>
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
            />
          )}
          <Stack mt={5} direction={"row"} spacing={2} textAlign="center" style={centerStyles}>
            <Button variant="contained" color="primary" type="submit">
              Speichern
            </Button>
            <Button variant="contained" color="error" href="#/">
              Abbrechen
            </Button>
          </Stack>
        </form>
      </Box>
    </div>
  );
};

export default Editar;

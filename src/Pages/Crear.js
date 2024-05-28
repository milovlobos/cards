import React, { useState } from "react";
import { db } from "../firebase";
import { uid } from "uid";
import { set, ref } from "firebase/database";
import { Paper, Alert, Snackbar } from "@mui/material";
import { UserAuth } from "../Components/AuthContext";
import { formElement, initialData } from "../Components/textFieldElement";

const styles = {
  form: {
    borderRadius: "8px",
    width: "30rem",
    margin: "auto",
    padding: "1rem",
    border: "1px solid #ccc",
  }
};

function Crear() {
  const [formData, setFormData] = useState(initialData);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = UserAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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

    setFormData(initialData);
    setOpenSnackbar(true);
  };

  return (
    <div>
      <Paper elevation={3} sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Neues Wort hinzufügen</h2>
        </div>
        {formElement(handleSubmit, formData, handleChange)}
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        sx={{ top: '30%', transform: 'translateY(-50%)' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Wort erfolgreich hinzugefügt
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Crear;

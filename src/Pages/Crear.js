import React, { useState } from "react";
import { db } from "../firebase";
import { uid } from "uid";
import { set, ref, get, query, orderByChild, equalTo } from "firebase/database";
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
  const [alertMessage, setAlertMessage] = useState('');
  const { user } = UserAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { wordType, rootWord, bedeutung } = formData;

    try {
      const wordsRef = query(ref(db, `users/${user.uid}`), orderByChild('rootWord'), equalTo(rootWord));
      const snapshot = await get(wordsRef);
      let wordExists = false;

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.wordType === wordType && data.bedeutung === bedeutung) {
          wordExists = true;
        }
      });

      if (wordExists) {
        setAlertMessage('Das Wort existiert bereits');
        setOpenSnackbar(true);
      } else {
        const uuid = uid();
        const userEmail = user.email;
        const userId = user.uid;
        const cardRef = ref(db, `users/${userId}/${uuid}`);
        await set(cardRef, {
          wordType,
          rootWord,
          bedeutung,
          userEmail,
          userId,
          uuid,
        });

        setFormData(initialData);
        setAlertMessage('Wort erfolgreich hinzugefügt');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error checking or adding word: ", error);
      setAlertMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setOpenSnackbar(true);
    }
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
        <Alert onClose={() => setOpenSnackbar(false)} severity={alertMessage === 'Wort erfolgreich hinzugefügt' ? 'success' : 'error'}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Crear;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { uid } from "uid";
import { set, ref } from "firebase/database";
import { Paper } from "@mui/material";
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

    setFormData(initialData);

    navigate("/beginn");
  };

  return (
    <div>
      <Paper elevation={3} sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={{textAlign: "center", marginBottom:"15px"}}>Neues Wort hinzufügen</h2>
        </div>
        {formElement(handleSubmit, formData, handleChange)}
      </Paper>
    </div>
  );
}

export default Crear;
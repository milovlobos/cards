import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import { Paper } from "@mui/material";
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

const Editar = () => {
  const { userId, uuid } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);

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
      navigate("/beginn");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <Paper elevation={3} sx={{ ...styles.form, marginTop: "2rem" }}>
        <div>
          <h2 style={{textAlign: "center", marginBottom:"15px"}}>Wort ändern</h2>
        </div>
        {formElement(handleSubmit, formData, handleChange)}
      </Paper>
    </div>
  );
};

export default Editar;
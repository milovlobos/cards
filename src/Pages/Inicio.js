import { useEffect, useState } from "react";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../firebase";
import { UserAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/loader";
import { Button, Grid, Card, CardContent, Typography, CardActions, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ModalElement from "../Components/ModalCard";

function Inicio() {
  const { user } = UserAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const userRef = ref(db, `users/${user.uid}`);
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setCards(Object.values(data));
            } else {
              setCards([]);
            }
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdate = async (uuid) => {
    navigate(`/editar/${user.uid}/${uuid}`);
  };

  const handleDelete = (uuid) => {
    const cardRef = ref(db, `users/${user.uid}/${uuid}`);
    remove(cardRef)
      .then(() => {
        console.log('Card deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting card: ", error);
      });
  };

  const handleOpenModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  if (loading) {
    return (
      <Box sx={{ width: "100vw", height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </Box>
    )
  }

  if (cards.length === 0) {
    return (
      <div>
        <Box mt={3} textAlign="center">
          <h2 style={{ marginTop: 20 }} >Du hast keine Karten</h2>
          <Button variant="contained" color="primary" href="#crear">
            Speichern
          </Button>
        </Box>
      </div>
    )
  }

  return (
    <>
      <Grid container spacing={3} justifyContent="center" mt={2} >
        {cards.map((todo) => (
          <Grid key={todo.uuid} item xs={5.5} sm={4} md={3.5} lg={2.5}>
            <Card variant="elevation" elevation={5} onClick={() => handleOpenModal(todo)}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {todo.rootWord}
                </Typography>
                <Typography variant="body2">
                  {todo.wordType}
                </Typography>
              </CardContent>
              <CardActions>
                <Box width="100%" textAlign="right">
                  <Button onClick={(e) => { e.stopPropagation(); handleUpdate(todo.uuid); }}><EditIcon /></Button>
                  <Button onClick={(e) => { e.stopPropagation(); handleDelete(todo.uuid); }}><DeleteForeverOutlinedIcon color="error" /></Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {ModalElement(selectedCard, handleCloseModal, isModalOpen)}
    </>
  );
}

export default Inicio;

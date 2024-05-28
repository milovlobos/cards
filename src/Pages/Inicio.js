import { useEffect, useState } from "react";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../firebase";
import { UserAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/loader";
import { Button, Grid, Card, CardContent, Typography, CardActions, Box, Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ModalElement from "../Components/ModalCard";
import { currencies } from "../Components/textFieldElement";

function Inicio() {
  const { user } = UserAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [wordTypeFilter, setWordTypeFilter] = useState('');
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
    navigate(`/ändern/${user.uid}/${uuid}`);
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

  const handleOpenModal = (card, index) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIndex(0);
  };

  const filteredCards = cards.filter(todo =>
    todo.rootWord.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
    (wordTypeFilter === '' || todo.wordType === wordTypeFilter)
  );

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
          <Button variant="contained" color="primary" href="#machen">
            Speichern
          </Button>
        </Box>
      </div>
    )
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, marginTop: 2, marginBottom: 2 }}>
        <TextField
          type="text"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          label="Wort suchen..."
          variant="outlined"
          style={{ width: 140 }}
          InputProps={{
            sx: {
              boxShadow: '5px 5px 2px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
            }
          }}
        />
        <FormControl size="small" variant="outlined" style={{ width: 140 }}>
          <InputLabel id="word-type-filter-label">Filter</InputLabel>
          <Select
            labelId="word-type-filter-label"
            value={wordTypeFilter}
            onChange={(e) => setWordTypeFilter(e.target.value)}
            label="Filter"
            sx={{
              boxShadow: '5px 5px 2px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
            }}
          >
            <MenuItem value=""><em>Alles</em></MenuItem>
            {currencies.map((option) => (
              <MenuItem key={option} value={option}>
                <em>{option}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3} justifyContent="center" style={{ paddingBottom: 20 }}>
        {filteredCards.length === 0 ? (
          <Typography mt={5} variant="h5" >Du hast keine Karten dieses Typs</Typography>
        ) : (
          filteredCards.map((todo, index) => (
            <Grid key={todo.uuid} item sm={4} md={3.5} lg={2.5}>
              <Card variant="elevation" elevation={5} onClick={() => handleOpenModal(todo, index)}>
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
          ))
        )
        }
      </Grid>
      {isModalOpen && <ModalElement elements={cards} initialIndex={selectedIndex} functionClose={handleCloseModal} verifyIsOpen={isModalOpen} />}
    </>
  );
}

export default Inicio;

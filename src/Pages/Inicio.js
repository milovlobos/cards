import { useEffect, useState } from "react";
import { ref, remove, onValue } from "firebase/database";
import { db } from "../firebase";
import { UserAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/loader";
import { Button, Grid, Card, CardContent, Typography, CardActions, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ModalElement from "../Components/ModalCard";

function Inicio() {
  const { user } = UserAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [wordTypeFilter, setWordTypeFilter] = useState(''); // Estado para el tipo de palabra
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
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Wort suchen..."
          style={{ borderRadius: 5, paddingLeft: 10, height:40, width:140 }}
        />
        <FormControl size="small" variant="outlined" style={{ width:140 }}>
          <InputLabel id="word-type-filter-label">Filter</InputLabel>
          <Select
            labelId="word-type-filter-label"
            value={wordTypeFilter}
            onChange={(e) => setWordTypeFilter(e.target.value)}
            label="Filter"
          >
            <MenuItem value=""><em>Alles</em></MenuItem>
            <MenuItem value="Nomen">Nomen</MenuItem>
            <MenuItem value="Verb">Verb</MenuItem>
            <MenuItem value="Adverb/Adjektiv">Adverb/Adjektiv</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3} justifyContent="center" style={{ paddingBottom: 20 }}>
        {filteredCards.map((todo, index) => (
          <Grid key={todo.uuid} item xs={5.5} sm={4} md={3.5} lg={2.5}>
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
        ))}
      </Grid>
      {isModalOpen && <ModalElement elements={cards} initialIndex={selectedIndex} functionClose={handleCloseModal} verifyIsOpen={isModalOpen} />}
    </>
  );
}

export default Inicio;

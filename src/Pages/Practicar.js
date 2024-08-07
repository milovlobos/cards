import { useEffect, useState } from "react";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { MenuItem, TextField, Badge, Box, Button, Select, InputLabel, FormControl, Snackbar, Alert, Stack } from "@mui/material";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import Loader from "../Components/loader";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './practicar.css';
import { UserAuth } from "../Components/AuthContext";
import { textElement, initialData, answerData, testExport, currencies } from "../Components/textFieldElement";

const Practicar = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerShown, setAnswerShown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const { user } = UserAuth();
  const [shuffledCards, setShuffledCards] = useState([]);
  const [filterWords, setFilterWords] = useState('Alles');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [practiceMode, setPracticeMode] = useState('de-to-mother');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "wordType") {
      const wordTypeElement = document.getElementById("wordType");
      if (wordTypeElement) {
        wordTypeElement.classList.remove("incorrect-answer");
        wordTypeElement.classList.remove("correct-answer");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        onValue(ref(db, `users/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setCards(Object.values(data));
            setLoading(false);
          } else {
            setCards([]);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.uid]);

  const shuffleCards = (cards) => {
    const shuffled = cards
      .filter(card => filterWords === 'Alles' || card.wordType === filterWords)
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);
    return shuffled;
  };

  const handleStartPractice = () => {
    const shuffled = shuffleCards(cards);
    setShuffledCards(shuffled);
    if (shuffled.length === 0) {
      setOpenSnackbar(true);
    }
    setCurrentIndex(0);
    setFormData({
      ...initialData,
      wordType: filterWords === 'Alles' ? '' : filterWords,
    });
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAnswerShown(false);
  };

  const handleRestartPractice = () => {
    setShuffledCards([]);
    setCurrentIndex(0);
    setFormData(initialData);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAnswerShown(false);
  };

  const handleToggleAnswer = () => {
    setAnswerShown(!answerShown);
  };

  const clearAnswerStyles = () => {
    Object.keys(formData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.classList.remove("incorrect-answer");
        element.classList.remove("correct-answer");
      }
    });
  };

  const handleNextCard = () => {
    setAnswerShown(false);
    clearAnswerStyles();
    setFormData({
      ...initialData,
      wordType: filterWords === 'Alles' ? '' : filterWords,
    });

    if (currentIndex === shuffledCards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevCard = () => {
    setAnswerShown(false);
    clearAnswerStyles();
    setFormData({
      ...initialData,
      wordType: filterWords === 'Alles' ? '' : filterWords,
    });

    if (currentIndex === 0) {
      setCurrentIndex(shuffledCards.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCompareAnswers = () => {
    const currentCard = shuffledCards[currentIndex];
    const correctAnswers = answerData(currentCard);
    const userAnswers = answerData(formData);
    let correct = true;

    const updateClass = (element, isCorrect) => {
      if (isCorrect) {
        element.classList.remove("incorrect-answer");
        element.classList.add("correct-answer");
      } else {
        element.classList.add("incorrect-answer");
        element.classList.remove("correct-answer");
      }
    };

    const normalizeAnswer = (answer) => {
      return answer
        .toLowerCase()
        .split(', ')
        .map(word => word.trim())
        .sort();
    };

    const compareAnswers = (key, correctValue, userValue) => {
      const element = document.getElementById(key);
      if (element) {
        const normalizedCorrectValue = normalizeAnswer(correctValue);
        const normalizedUserValue = normalizeAnswer(userValue);
        const isCorrect = normalizedUserValue.some(value => normalizedCorrectValue.includes(value));
        updateClass(element, isCorrect);
        if (!isCorrect) correct = false;
      }
    };

    if (practiceMode === 'de-to-mother') {
      if (formData.wordType === "") {
        alert("Bitte wählen Sie die Art des Wortes aus");
        return;
      }

      Object.keys(userAnswers).forEach(key => {
        compareAnswers(key, correctAnswers[key], userAnswers[key]);
      });
    } else if (practiceMode === 'mother-to-de') {
      const rootWordKey = "rootWord";
      const correctValue = currentCard.wordType === "Nomen" ? `${currentCard.artikel} ${currentCard.rootWord}` : currentCard.rootWord;
      compareAnswers(rootWordKey, correctValue, formData[rootWordKey]);
    }

    if (correct) {
      setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
    } else {
      setIncorrectAnswers(prevIncorrectAnswers => prevIncorrectAnswers + 1);
    }
  };


  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;
  let answerIcon = 'fas fa-chevron-circle-right mr-2 antwort';

  if (answerShown) {
    answerIcon = 'fas fa-chevron-circle-down mr-2 antwort';
  }

  if (loading) {
    return (
      <Box sx={{ width: "100vw", height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </Box>
    );
  }

  if (cards.length === 0) {
    return (
      <div>
        <h2 style={{ marginTop: 20 }}>Du hast keine Karten</h2>
        <Box mt={3} textAlign="center">
          <Button variant="contained" color="primary" href="#machen">
            Speichern
          </Button>
        </Box>
      </div>
    );
  }

  if (shuffledCards.length === 0) {
    return (
      <Box mt={5} textAlign="center">
        <Stack mt={2} mb={2} direction={"row"} spacing={2} style={{ display: 'flex', justifyContent: 'center', }}>

          <FormControl size="small" variant="outlined" style={{ width: 150 }}>
            <InputLabel id="word-type-filter-label">Art des Wortes</InputLabel>
            <Select
              labelId="word-type-filter-label"
              value={filterWords}
              onChange={(e) => setFilterWords(e.target.value)}
              label="Art des Wortes"
            >
              <MenuItem value="Alles"><em>Alles</em></MenuItem>
              {currencies.map((option) => (
                <MenuItem key={option} value={option}>
                  <em>{option}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" variant="outlined" style={{ width: 200 }}>
            <InputLabel id="practice-mode-label">Übungsmodus</InputLabel>
            <Select
              labelId="practice-mode-label"
              value={practiceMode}
              onChange={(e) => setPracticeMode(e.target.value)}
              label="Practice Mode"
            >
              <MenuItem value="de-to-mother">Deutsch zur Muttersprache</MenuItem>
              <MenuItem value="mother-to-de">Muttersprache zum Deutsch</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Button variant="contained" color="secondary" onClick={handleStartPractice}>
          Los geht's!
        </Button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2500}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          sx={{ top: '30%', transform: 'translateY(-50%)' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="warning">
            Du hast keine Karten dieses Typs
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  const renderAnswer = (wordType, currentIndex, shuffledCards) => {
    if (practiceMode === 'de-to-mother') {
      if (!wordType) return null;

      const wordTypeIndex = currencies.indexOf(wordType);
      const wordTypeData = testExport[wordTypeIndex]?.[wordType];

      if (!wordTypeData) return null;

      return (
        <div className="letra">
          <p>- Typ: {shuffledCards[currentIndex].wordType}</p>
          {wordTypeData.map((element) => (
            shuffledCards[currentIndex][element] && (
              <p key={element}>- {
                (element.toLowerCase() === 'prateritum')
                  ? 'Präteritum'
                  : (element.charAt(element.length - 1) === '2'
                    ? element.charAt(0).toUpperCase() + element.slice(1, -1) + ' II'
                    : element.charAt(0).toUpperCase() + element.slice(1))
              }: {shuffledCards[currentIndex][element]}</p>
            )
          ))}
        </div>
      );
    }

    if (practiceMode === 'mother-to-de') {
      return (
        <div className="letra">
          {filterWords === "Alles" && <p>- Typ: {shuffledCards[currentIndex].wordType}</p>}
          {shuffledCards[currentIndex].artikel
            ? <p>- {shuffledCards[currentIndex].artikel} {shuffledCards[currentIndex].rootWord}</p>
            : <p>- Bedeutung: {shuffledCards[currentIndex].rootWord}</p>
          }
        </div>
      );
    }
  };

  return (
    <div className="container mt-3">
      {shuffledCards.length > 0 && shuffledCards[currentIndex] && (
        <div className="row justify-content-center">
          <div className="col-md-1 col-1 text-center">
            <i className="fas fa-angle-double-left arrowL fa-lg" onClick={handlePrevCard} style={{ cursor: 'pointer' }}></i>
          </div>
          <div className="col-md-8 col-xl-6 col-10">
            <div className="progress">
              <div className="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style={{ width: progress + '%' }}></div>
            </div>
            <div className="card w-100 text-center shadow border-light mt-3">
              <div className="card-body">
                <div className="card-body">
                  <h5 className="card-title mb-4 ">
                    {practiceMode === 'de-to-mother' ? shuffledCards[currentIndex].rootWord : shuffledCards[currentIndex].bedeutung}
                  </h5>
                  <div>
                    {practiceMode === 'de-to-mother' ? (
                      <>
                        <label htmlFor="wordType" className="font-weight-bold mb-2"></label>
                        <TextField
                          id="wordType"
                          name="wordType"
                          fullWidth
                          select
                          label="Wählen Sie die Art"
                          value={formData.wordType}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                        >
                          {currencies.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                        {formData.wordType && (
                          <div>
                            {testExport.find(item => item[formData.wordType])?.[formData.wordType].map((element) => (
                              <div className="form-group mt-4" key={element}>
                                {textElement(element, formData, handleChange, "small", shuffledCards[currentIndex])}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <TextField
                        id="rootWord"
                        name="rootWord"
                        label="Wort"
                        value={formData.rootWord}
                        onChange={handleChange}
                        variant="outlined"
                        autoComplete="off"
                      />
                    )}
                  </div>
                  <div className="form-group mt-4">
                    <button type="button" className="btn btn-primary mt-1 mr-2" onClick={handleCompareAnswers}>
                      <DriveFileRenameOutlineTwoToneIcon />
                    </button>
                  </div>
                  <div className="mt-3 d-flex justify-content-center">
                    <div className="d-flex justify-content-center col-md-2 col-xl-1 col-3">
                      <Badge badgeContent={correctAnswers} color="success" sx={{ mx: "auto" }}>
                        <SentimentVerySatisfiedIcon color="success" fontSize="large" />
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-center col-md-2 col-xl-1 col-3">
                      <Badge badgeContent={incorrectAnswers} color="error" sx={{ mx: "auto" }}>
                        <SentimentVeryDissatisfiedIcon color="error" fontSize="large" />
                      </Badge>
                    </div>
                  </div>
                  <p className="card-text mt-2 letra" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={answerIcon} onClick={handleToggleAnswer} style={{ cursor: 'pointer', width: '24px' }}></i>
                    <span style={{ width: '155px' }}>{answerShown ? "Antwort verstecken" : "Antwort anzeigen"}</span>
                  </p>
                  {answerShown && renderAnswer(shuffledCards[currentIndex].wordType, currentIndex, shuffledCards)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-1 text-center">
            <i className="fas fa-angle-double-right arrowR fa-lg" onClick={handleNextCard} style={{ cursor: 'pointer' }}></i>
          </div>
        </div>
      )}
      <Box mt={2} mb={2} textAlign="center">
        <Button variant="contained" color="secondary" onClick={handleRestartPractice}>
          Neu starten
        </Button>
      </Box>
    </div>
  );
};

export default Practicar;

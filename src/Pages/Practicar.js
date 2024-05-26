import { useEffect, useState } from "react";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { MenuItem, TextField, Badge, Box, Button } from "@mui/material";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import Loader from "../Components/loader";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './practicar.css';
import { UserAuth } from "../Components/AuthContext";
import { textElement, initialData, answerData, testExport, currencies } from "../Components/textFieldElement"


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
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);
    return shuffled;
  };

  const handleStartPractice = () => {
    const shuffled = shuffleCards(cards);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setFormData(initialData);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAnswerShown(false);
  };

  const handleToggleAnswer = () => {
    setAnswerShown(!answerShown);
  };

  const handleNextCard = () => {
    setAnswerShown(false);
    setFormData(initialData);

    if (currentIndex === shuffledCards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevCard = () => {
    setAnswerShown(false);
    setFormData(initialData);

    if (currentIndex === 0) {
      setCurrentIndex(shuffledCards.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCompareAnswers = () => {
    if (formData.wordType === "") {
      alert("Bitte wählen Sie die Art des Wortes aus");
      return;
    }

    const currentCard = shuffledCards[currentIndex];
    const correctAnswers = answerData(currentCard);
    const userAnswers = answerData(formData);
    let correct = true;

    Object.keys(userAnswers).forEach(key => {
      const element = document.getElementById(key);
      if (element && userAnswers[key] !== correctAnswers[key]) {
        element.classList.add("incorrect-answer");
        element.classList.remove("correct-answer");
        correct = false;
      } else if (element) {
        element.classList.remove("incorrect-answer");
        element.classList.add("correct-answer");
      }
    });

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
    )
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
        <Button variant="contained" color="secondary" onClick={handleStartPractice}>
          Los geht's!
        </Button>
      </Box>
    );
  }

  const renderWordTypeDetails = (wordType, currentIndex, shuffledCards) => {
    if (!wordType) return null;

    const wordTypeIndex = currencies.indexOf(wordType);
    const wordTypeData = testExport[wordTypeIndex]?.[wordType];

    if (!wordTypeData) return null;

    return (
      <div className="letra">
        <p>- Typ: {shuffledCards[currentIndex].wordType}</p>
        {wordTypeData.map((element) => (
          <p key={element}>- {
            (element.toLowerCase() === 'prateritum')
              ? 'Präteritum'
              : (element.charAt(element.length - 1) === '2'
                ? element.charAt(0).toUpperCase() + element.slice(1, -1) + ' II'
                : element.charAt(0).toUpperCase() + element.slice(1))
            }: {shuffledCards[currentIndex][element]}</p>
        ))}
      </div>
    );
  };


  return (
    <div className="container mt-5">
      {shuffledCards.length > 0 && shuffledCards[currentIndex] && (
        <div className="row justify-content-center">
          <div className="col-md-1 col-1 text-center">
            <i className="fas fa-angle-double-left arrowL fa-lg" onClick={handlePrevCard} style={{ cursor: 'pointer' }}></i>
          </div>
          <div className="col-md-8 col-10">
            <div className="progress">
              <div className="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" style={{ width: progress + '%' }}></div>
            </div>
            <div className="card w-100 text-center shadow border-light mt-3">
              <div className="card-body">
                <div className="card-body">
                  <h5 className="card-title mt-3">{shuffledCards[currentIndex].rootWord}</h5>
                  <div>
                    <div>
                      <label htmlFor="wordType" className="font-weight-bold mb-2">
                        <b>Art des Wortes</b>
                      </label>
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
                    </div>
                    {formData.wordType && (
                      <div>
                        {testExport.find(item => item[formData.wordType])?.[formData.wordType].map((element) => (
                          <div className="form-group mt-4" key={element}>
                            {textElement(element, formData, handleChange, "small")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-4">
                    <button type="button" className="btn btn-primary mt-4 mr-2" onClick={handleCompareAnswers}>
                      <DriveFileRenameOutlineTwoToneIcon />
                    </button>
                  </div>
                  <div className="mt-3 d-flex justify-content-center">
                    <div className="d-flex justify-content-center col-2">
                      <Badge badgeContent={correctAnswers} color="success" sx={{ mx: "auto" }}>
                        <SentimentVerySatisfiedIcon color="success" fontSize="large" />
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-center col-2">
                      <Badge badgeContent={incorrectAnswers} color="error" sx={{ mx: "auto" }}>
                        <SentimentVeryDissatisfiedIcon color="error" fontSize="large" />
                      </Badge>
                    </div>
                  </div>
                  <p className="card-text mt-4 letra" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={answerIcon} onClick={handleToggleAnswer} style={{ cursor: 'pointer', width: '24px' }}></i>
                    <span style={{ width: '155px' }}>{answerShown ? "Antwort verstecken" : "Antwort anzeigen"}</span>
                  </p>
                  {answerShown && renderWordTypeDetails(shuffledCards[currentIndex].wordType, currentIndex, shuffledCards)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-1 text-center">
            <i className="fas fa-angle-double-right arrowR fa-lg" onClick={handleNextCard} style={{ cursor: 'pointer' }}></i>
          </div>
        </div>
      )}
      <Box mt={5} textAlign="center">
        <Button variant="contained" color="secondary" onClick={handleStartPractice}>
          Neu starten
        </Button>
      </Box>
    </div>
  );
};

export default Practicar;
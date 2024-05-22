import { useEffect, useState } from "react";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { MenuItem, TextField, Badge, Box, Button } from "@mui/material";
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './practicar.css';
import { UserAuth } from "../Components/AuthContext";

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

const Practicar = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerShown, setAnswerShown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [formData, setFormData] = useState({
    wordType: "",
    rootWord: "",
    article: "",
    plural: "",
    meaning: "",
    konjugation: "",
    perfekt: "",
    konjunktiv2: "",
    prateritum: "",

  });

  const { user } = UserAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "wordType" || name === "meaning") {
      const wordTypeElement = document.getElementById("wordType");
      const meaningElement = document.getElementById("meaning");
      if (wordTypeElement) {
        wordTypeElement.classList.remove("incorrect-answer");
      }
      if (meaningElement) {
        meaningElement.classList.remove("incorrect-answer");
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

  const handleToggleAnswer = () => {
    setAnswerShown(!answerShown);
  };

  const handleNextCard = () => {
    setAnswerShown(false);
    setFormData({
      ...formData,
      wordType: "",
      rootWord: "",
      article: "",
      plural: "",
      meaning: "",
      konjugation: "",
      perfekt: "",
      konjunktiv2: "",
      prateritum: "",
    });
    if (currentIndex === cards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevCard = () => {
    setAnswerShown(false);
    setFormData({
      ...formData,
      wordType: "",
      rootWord: "",
      article: "",
      plural: "",
      meaning: "",
      konjugation: "",
      perfekt: "",
      konjunktiv2: "",
      prateritum: "",
    });
    if (currentIndex === 0) {
      setCurrentIndex(cards.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCompareAnswers = () => {
    if (formData.wordType === "") {
      alert("Bitte wählen Sie die Art des Wortes aus");
      return;
    }

    const currentCard = cards[currentIndex];

    const correctAnswers = {
      wordType: currentCard.wordType,
      meaning: currentCard.meaning,
      article: currentCard.article,
      plural: currentCard.plural,
      konjugation: currentCard.conjugation,
      perfekt: currentCard.perfekt,
      konjunktiv2: currentCard.konjunktiv2,
      prateritum: currentCard.prateritum,
    };

    const userAnswers = {
      wordType: formData.wordType,
      meaning: formData.meaning,
      article: formData.article,
      plural: formData.plural,
      konjugation: formData.konjugation,
      perfekt: formData.perfekt,
      konjunktiv2: formData.konjunktiv2,
      prateritum: formData.prateritum,
    };

    let correct = true;

    Object.keys(userAnswers).forEach(key => {
      const element = document.getElementById(key);
      if (element && userAnswers[key] !== correctAnswers[key]) {
        element.classList.add("incorrect-answer");
        correct = false;
      } else if (element) {
        element.classList.remove("incorrect-answer");
      }
    });

    if (correct) {
      setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
    } else {
      setIncorrectAnswers(prevIncorrectAnswers => prevIncorrectAnswers + 1);
    }
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;
  let answerIcon = 'fas fa-chevron-circle-right mr-2 antwort';
  if (answerShown) {
    answerIcon = 'fas fa-chevron-circle-down mr-2 antwort';
  }



  if (loading) {
    return <div>Cargando...</div>;
  }

  if (cards.length === 0) {
    return (
      <div>
        <h2 style={{marginTop: 20}}>Du hast keine Karten</h2>
        <Box mt={3} textAlign="center">
          <Button variant="contained" color="primary" href="#crear">
            Speichern
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {cards.length > 0 && cards[currentIndex] && (
        <div className="row justify-content-center">
          <div className="col-md-1 col-1 text-center">
            <i
              className="fas fa-angle-double-left arrowL fa-lg"
              onClick={handlePrevCard}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          <div className="col-md-8 col-10">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped bg-info progress-bar-animated"
                role="progressbar"
                style={{ width: progress + '%' }}>
              </div>
            </div>
            <div className="card w-100 text-center shadow border-light mt-3">
              <div className="card-body">
                <div className="card-body">
                  <h5 className="card-title mt-3">{cards[currentIndex].rootWord}</h5>
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
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    {formData.wordType === "Nomen" && (
                      <div>
                        <div className="form-group mt-4 ">
                          <TextField
                            fullWidth
                            id="meaning"
                            name="meaning"
                            label="Bedeutung"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.meaning}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="article"
                            name="article"
                            label="Artikel"
                            variant="outlined"
                            size="small"
                            autoComplete="off"
                            value={formData.article}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="plural"
                            name="plural"
                            label="Plural"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.plural}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    )}
                    {formData.wordType === "Verb" && (
                      <div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="meaning"
                            name="meaning"
                            label="Bedeutung"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.meaning}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="konjugation"
                            name="konjugation"
                            label="Konjugation"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.konjugation}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="perfekt"
                            name="perfekt"
                            label="Perfekt"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.perfekt}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="konjunktiv2"
                            name="konjunktiv2"
                            label="Konjunktiv II"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.konjunktiv2}
                            onChange={handleChange}
                          />
                          </div>
                          <div className="form-group mt-4">
                          <TextField
                            fullWidth
                            id="prateritum"
                            name="prateritum"
                            label="Präteritum"
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            value={formData.prateritum}
                            onChange={handleChange}
                          />
                          </div>
                      </div>
                    )}
                    {formData.wordType === "Adverb/Adjektiv" && (
                      <div className="form-group mt-4">
                        <TextField
                          fullWidth
                          id="meaning"
                          name="meaning"
                          label="Bedeutung"
                          variant="outlined"
                          autoComplete="off"
                          size="small"
                          value={formData.meaning}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-4">
                    <button
                      type="button"
                      className="btn btn-primary mt-4 mr-2"
                      onClick={handleCompareAnswers}
                    >
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
                  {answerShown && (
                    <div className="letra">
                      <p>- Typ: {cards[currentIndex].wordType}</p>
                      {cards[currentIndex].wordType === 'Nomen' && (
                        <div>
                          <p>- Bedeutung: {cards[currentIndex].meaning}</p>
                          <p>- Artikel: {cards[currentIndex].article}</p>
                          <p>- Plural: {cards[currentIndex].plural}</p>
                        </div>
                      )}
                      {cards[currentIndex].wordType === 'Verb' && (
                        <div>
                          <p>- Bedeutung: {cards[currentIndex].meaning}</p>
                          <p>- Conjugación: {cards[currentIndex].conjugation}</p>
                          <p>- Perfekt: {cards[currentIndex].perfekt}</p>
                          <p>- Konjunktiv II: {cards[currentIndex].konjunktiv2}</p>
                          <p>- Präteritum: {cards[currentIndex].prateritum}</p>
                        </div>
                      )}
                      {cards[currentIndex].wordType === 'Adverb/Adjektiv' && (
                        <p>- Bedeutung: {cards[currentIndex].meaning}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-1 text-left">
            <i
              className="fas fa-angle-double-right arrowR fa-lg"
              onClick={handleNextCard}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practicar;
import React from 'react';
import { TextField, MenuItem, Button, Stack } from '@mui/material';

const currencies =['Nomen', 'Verb', 'Adverb/Adjektiv']

const testExport = [
  {"Nomen":["bedeutung", "artikel", "plural"]},
  {"Verb":["bedeutung", "konjugation", "perfekt", "konjunktiv2", "prateritum"]},
  {"Adverb/Adjektiv":["bedeutung"]}
]

const initialData = {
  wordType: "",
  rootWord: "",
  bedeutung: "",
  artikel: "",
  plural: "",
  konjugation: "",
  perfekt: "",
  konjunktiv2: "",
  prateritum: "",
};

const answerData = (source) => {
  const data = {};
  Object.keys(initialData).forEach(key => {
    if (source.hasOwnProperty(key)) {
      data[key] = source[key];
    }
  });
  return data;
};

const textElement = (element, functionData, functionChange, sizeElement) => (
  <TextField
    fullWidth
    id={element}
    name={element}
    label={(element.toLowerCase() === 'prateritum')
      ? 'Präteritum'
      : (element.charAt(element.length - 1) === '2'
        ? element.charAt(0).toUpperCase() + element.slice(1, -1) + ' II'
        : element.charAt(0).toUpperCase() + element.slice(1))}
    value={functionData[element]}
    onChange={functionChange}
    variant="outlined"
    autoComplete="off"
    size={sizeElement}
    sx={{ marginTop: sizeElement === "small" ? 0 : "12px" }}
  />
);

const formElement = (functionSubmit, functionData, functionChange, sizeElement) =>(
  <form onSubmit={functionSubmit} >
          <TextField
            fullWidth
            id="rootWord"
            name="rootWord"
            label="Wort"
            value={functionData.rootWord}
            onChange={functionChange}
            variant="outlined"
            autoComplete="off"
          />
          <div>
            <TextField
              id="wordType"
              name="wordType"
              fullWidth
              select
              label="Wortart"
              value={functionData.wordType}
              onChange={functionChange}
              variant="outlined"
              sx={{ marginTop: "15px" }}
            >
            {currencies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
            </TextField>
          </div>
          {functionData.wordType === "Nomen" && (
            <>
              {testExport[0].Nomen.map((element) => textElement(element, functionData, functionChange, sizeElement))}
            </>
          )}
          {functionData.wordType === "Verb" && (
            <>
              {testExport[1].Verb.map((element) => textElement(element, functionData, functionChange, sizeElement))}
            </>
          )}
          {functionData.wordType === "Adverb/Adjektiv" && (
            <>
              {testExport[2]["Adverb/Adjektiv"].map((element) => textElement(element, functionData, functionChange, sizeElement))}
            </>
          )}
          <Stack mt={2} direction={"row"} spacing={2} style={{display: 'flex', justifyContent: 'center',}}>
            <Button variant="contained" color="primary" type="submit">
              Speichern
            </Button>
            <Button variant="contained" color="error" href="#/beginn">
              Abbrechen
            </Button>
          </Stack>
        </form>
);

export { textElement, formElement, initialData, answerData, testExport };
import React from 'react';
import { CardContent, TextField, Box, Modal, Backdrop, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};



const cardElement = (element) => (
  <CardContent>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography sx={{ marginBottom: "15px" }} id="modal-modal-title" variant="h8" component="h2">
        {element.rootWord}
      </Typography>
    </Box>
    <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="wordType" name="wordType" label="Typ" value={element.wordType} variant="outlined" autoComplete="off" fullWidth />
    <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="bedeutung" name="bedeutung" label="Bedeutung" value={element.bedeutung} variant="outlined" autoComplete="off" fullWidth />
    {element.artikel && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="artikel" name="artikel" label="Artikel" value={element.artikel} variant="outlined" autoComplete="off" fullWidth />
    )}
    {element.plural && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="plural" name="plural" label="Plural" value={element.plural} variant="outlined" autoComplete="off" fullWidth />
    )}
    {element.konjugation && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="konjugation" name="konjugation" label="Konjugation" value={element.konjugation} variant="outlined" autoComplete="off" fullWidth />
    )}
    {element.perfekt && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="perfekt" name="perfekt" label="Perfekt" value={element.perfekt} variant="outlined" autoComplete="off" fullWidth />
    )}
    {element.konjunktiv2 && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="konjunktiv2" name="konjunktiv2" label="Konjunktiv II" value={element.konjunktiv2} variant="outlined" autoComplete="off" fullWidth />
    )}
    {element.prateritum && (
      <TextField InputLabelProps={{ style: { color: 'blue' } }} InputProps={{ readOnly: true }} sx={{ marginTop: "15px" }} id="prateritum" name="prateritum" label="Präteritum" value={element.prateritum} variant="outlined" autoComplete="off" fullWidth />
    )}
  </CardContent>
);

function ModalElement({ elements, initialIndex, functionClose, verifyIsOpen }) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={verifyIsOpen}
      onClose={functionClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Box sx={style}>
        {elements && elements.length > 0 && (
          <Carousel
            autoPlay={false}
            indicators={false}
            index={initialIndex}
            navButtonsAlwaysVisible
            animation="slide"
            swipe={true}
          >
            {elements.map((element, index) => (
              <Box paddingX={5} key={index}>
                {cardElement(element)}
              </Box>
            ))}
          </Carousel>
        )}
      </Box>
    </Modal>
  );
}

export default ModalElement;


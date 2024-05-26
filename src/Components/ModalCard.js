import React from 'react';
import { CardContent, TextField, Box, Modal, Backdrop, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import {initialData} from './textFieldElement';

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

const renderTextField = (key, label, value) => (
  <TextField
    key={key}
    InputLabelProps={{ style: { color: 'blue' } }}
    InputProps={{ readOnly: true }}
    sx={{ marginTop: "15px" }}
    id={key}
    name={key}
    label={label}
    value={value}
    variant="outlined"
    autoComplete="off"
    fullWidth
  />
);

const cardElement = (element) => (
  <CardContent>
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography sx={{ marginBottom: "15px" }} id="modal-modal-title" variant="h8" component="h2">
        {element.rootWord}
      </Typography>
    </Box>
    {Object.entries(initialData)
      .filter(([key]) => key !== "rootWord")
      .map(([key, value]) => {
        if (element[key]) {
          return renderTextField(key, key.charAt(0).toUpperCase() + key.slice(1), element[key]);
        }
        return null;
      })}
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


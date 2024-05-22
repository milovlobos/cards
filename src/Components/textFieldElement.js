import React from 'react';
import TextField from '@mui/material/TextField';

const textElement = (element, formData, handleChange) => {
  return (
    <TextField
      fullWidth
      id={element}
      name={element}
      label={(element.toLowerCase() === 'prateritum')
        ? 'Präteritum'
        : (element.charAt(element.length - 1) === '2'
          ? element.charAt(0).toUpperCase() + element.slice(1, -1) + ' II'
          : element.charAt(0).toUpperCase() + element.slice(1))}
      value={formData[element]}
      onChange={handleChange}
      variant="outlined"
      autoComplete="off"
      sx={{ marginBottom: "15px" }}
    />
  );
};

export default textElement;

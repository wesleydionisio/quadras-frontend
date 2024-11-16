import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SportsDropdown = ({ sports, onSportSelect, selectedSport }) => {
  const handleSelect = (event) => {
    onSportSelect(event.target.value); // Atualiza o estado no componente pai
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel id="sports-select-label">Esportes</InputLabel>
      <Select
        labelId="sports-select-label"
        id="sports-select"
        value={selectedSport || ''} // Valor controlado
        onChange={handleSelect}
        label="Esportes"
      >
        {sports.length > 0 ? (
          sports.map((sport) => (
            <MenuItem key={sport.id || sport._id} value={sport.id || sport._id}>
              {sport.name || sport.nome}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Nenhum esporte disponível
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default SportsDropdown;
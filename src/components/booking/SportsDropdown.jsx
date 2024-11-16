import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SportsDropdown = ({ sports, onSportSelect }) => {
  const [selectedSport, setSelectedSport] = React.useState('');

  const handleChange = (event) => {
    setSelectedSport(event.target.value);
    if (onSportSelect) {
      onSportSelect(event.target.value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Esporte</InputLabel>
      <Select value={selectedSport} onChange={handleChange}>
        {sports.map((sport) => (
          <MenuItem key={sport.id} value={sport.id}>
            {sport.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SportsDropdown;
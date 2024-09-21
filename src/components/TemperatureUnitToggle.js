import React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const TemperatureUnitToggle = ({ unit, onUnitChange }) => {
  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={unit === 'fahrenheit'}
            onChange={(e) => onUnitChange(e.target.checked ? 'fahrenheit' : 'celsius')}
          />
        }
        label={unit === 'celsius' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
      />
    </div>
  );
};

export { TemperatureUnitToggle };

import React from 'react';
import { Dialog, DialogTitle, DialogContent, Switch, FormControlLabel, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../context/ThemeContext';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { isDarkMode, toggleTheme } = useThemeMode();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Box>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;

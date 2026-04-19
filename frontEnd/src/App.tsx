import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from './context/ThemeContext';
import ParkingMap from './components/ParkingMap';
import { logger } from './utils/logger';
import { useParkingLotsByIds, ALL_LOT_IDS } from './hooks/useParkingData';
import WuParkLogo from './assets/WuPark Logo 2.jpg';
import Lot1DetailPage from './pages/Lot1DetailPage';
import Lot2DetailPage from './pages/Lot2DetailPage';
import NoDataPage from './pages/NoDataPage';

const useErrorHandler = () => {
  useEffect(() => {
    logger.info('Application started', { timestamp: new Date().toISOString() });

    window.onerror = (message, source, lineno, colno, error) => {
      logger.error(error || message.toString(), { source, lineno, colno });
    };
  }, []);
};

const App: React.FC = () => {
  useErrorHandler();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const { data: parkingLots } = useParkingLotsByIds(ALL_LOT_IDS);

  return (
    <Router>
      <Routes>
        {/* Lots with data */}
        <Route path="/lot/1" element={<Lot1DetailPage />} />
        <Route path="/lot/2" element={<Lot2DetailPage />} />
        
        {/* Lots without data */}
        <Route path="/lot/:lotId" element={<NoDataPage />} />
        
        <Route 
          path="/" 
          element={
            <Box sx={{flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
              <AppBar position="static">
                <Toolbar sx={{minHeight: { xs: 60, sm: 70 }, px: { xs: 1, sm: 2 }}}>
                  <Box 
                    component="img" 
                    src={WuParkLogo} 
                    alt="WuPark Logo" 
                    sx={{height: { xs: 40, sm: 50 }, mr: { xs: 1, sm: 2 }}} 
                  />
                  <Box sx={{flexGrow: 1}} />
                  <IconButton onClick={toggleTheme} sx={{ color: '#000000', mr: 1 }}>
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mr: 2, 
                      color: '#000000',
                      display: {xs: 'none', md: 'block'},
                      fontSize: {sm: '0.8rem', md: '0.9rem'}
                    }}
                  >
                    This application is incomplete and is for demonstration purposes only.
                  </Typography>
                </Toolbar>
              </AppBar>
              <Container 
                maxWidth="xl" 
                sx={{ 
                  mt: {xs: 1, sm: 2, md: 4}, 
                  mb: {xs: 1, sm: 2, md: 4},
                  px: {xs: 1, sm: 2, md: 3},
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <ParkingMap lots={parkingLots || []} />
              </Container>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
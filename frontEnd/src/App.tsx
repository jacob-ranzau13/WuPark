import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ParkingMap from './components/ParkingMap';
import Sidebar, { SIDEBAR_WIDTH } from './components/Sidebar';
import SettingsDialog from './components/SettingsDialog';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: parkingLots } = useParkingLotsByIds(ALL_LOT_IDS);

  return (
    <Router>
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onSettingsClick={() => setSettingsOpen(true)}
        parkingLots={parkingLots || []}
      />
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Routes>
        <Route path="/lot/1" element={<Lot1DetailPage />} />
        <Route path="/lot/2" element={<Lot2DetailPage />} />
        <Route path="/lot/:lotId" element={<NoDataPage />} />
        
        <Route 
          path="/" 
          element={
            <Box sx={{
              flexGrow: 1, 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <AppBar position="fixed" sx={{ zIndex: 1300 }}>
                <Toolbar sx={{minHeight: { xs: 60, sm: 70 }, px: { xs: 1, sm: 2 }}}>
                  <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 1 }}>
                    <MenuIcon />
                  </IconButton>
                  <Box 
                    component="img" 
                    src={WuParkLogo} 
                    alt="WuPark Logo" 
                    sx={{height: { xs: 40, sm: 50 }, mr: { xs: 1, sm: 2 }}} 
                  />
                </Toolbar>
              </AppBar>
              <Toolbar sx={{minHeight: { xs: 60, sm: 70 }}} />
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
                transition: 'margin-left 0.2s',
                overflow: 'hidden'
              }}>
                <ParkingMap lots={parkingLots || []} />
              </Box>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
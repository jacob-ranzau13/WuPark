import React, { useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { LocalParking } from '@mui/icons-material';
import ParkingMap from './components/ParkingMap';
import ParkingLotVisualizer from './components/ParkingLotVisualizer';
import { logger } from './utils/logger';
import { useParkingLots } from './hooks/useParkingData';
import WuParkLogo from './assets/WuPark Logo 2.jpg';

const App: React.FC = () => {
  useEffect(() => {
    logger.info('Application started', { timestamp: new Date().toISOString() });
    
    window.onerror = (message, source, lineno, colno, error) => {
      logger.error(error || message.toString(), {
        source,
        lineno,
        colno
      });
    };
  }, []);
  const { data: parkingLots } = useParkingLots();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box component="img" src={WuParkLogo} alt="WuPark Logo" sx={{ height: 50, mr: 2 }} />
          <LocalParking sx={{ mr: 2 }} />
          {/* Remove the title text but keep layout and the informational text introduced by the pull */}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" component="div" sx={{ mr: 2, color: '#000000' }}>
            This application is incomplete and is for demonstration purposes only.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ParkingMap lots={parkingLots || []} />
      </Container>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ParkingLotVisualizer lotId={1} />
      </Container>
    </Box>
  );
};

export default App;
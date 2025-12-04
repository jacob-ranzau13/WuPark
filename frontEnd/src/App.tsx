import React, { useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { LocalParking } from '@mui/icons-material';
import ParkingMap from './components/ParkingMap';
import { logger } from './utils/logger';
import { useParkingLots } from './hooks/useParkingData';

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
          <LocalParking sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WuPark - Smart Parking Management
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            This application is incomplete and is for demonstration purposes only.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ParkingMap lots={parkingLots || []} />
      </Container>
    </Box>
  );
};

export default App;
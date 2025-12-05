import React, { useEffect, useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { LocalParking } from '@mui/icons-material';
import ParkingMap from './components/ParkingMap';
import DemoDisplay, { Stall } from './components/DemoDisplay';
import LotDemo from './assets/LotDemo.png';
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
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const mapLotsToStalls = (): Stall[] => {
    if (!parkingLots || parkingLots.length === 0) return [];
    
    const firstLot = parkingLots[0];
    const stallPositions = [
      { x: 12, y: 18 },
      { x: 24, y: 18 },
      { x: 36, y: 18 },
      { x: 48, y: 18 },
      { x: 60, y: 18 },
      { x: 72, y: 18 },
      { x: 84, y: 18 },
      { x: 92, y: 18 },
    ];

    return firstLot.spots.slice(0, 8).map((spot, index) => ({
      id: index + 1,
      x: stallPositions[index].x,
      y: stallPositions[index].y,
      status: spot.isOccupied ? 'occupied' : 'free'
    }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box component="img" src={WuParkLogo} alt="WuPark Logo" sx={{ height: 50, mr: 2 }} /> 
          <LocalParking sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" component="div" sx={{ mr: 2, color: '#000000' }}>
            This application is incomplete and is for demonstration purposes only.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="main tabs" sx={{ mb: 2 }}>
          <Tab label="Map" />
          <Tab label="Demo Display" />
        </Tabs>

        {tab === 0 ? (
          <ParkingMap lots={parkingLots || []} />
        ) : (
          <DemoDisplay
            imageSrc={LotDemo}
            stalls={mapLotsToStalls()}
          />
        )}
      </Container>
    </Box>
  );
};

export default App;
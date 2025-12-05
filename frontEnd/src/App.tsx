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
    // pixel coordinates provided by user for LotDemo image (xPx, yPx)
    const stallPositions = [
      { xPx: 241, yPx: 101 },
      { xPx: 241, yPx: 141 },
      { xPx: 241, yPx: 181 },
      { xPx: 241, yPx: 221 },
      { xPx: 470, yPx: 101 },
      { xPx: 470, yPx: 141 },
      { xPx: 470, yPx: 181 },
      { xPx: 470, yPx: 221 },
    ];

    // If the API returns spots keyed by ids (A1..A8) we should map by those keys so order is stable.
    const spotKeys = ['A1','A2','A3','A4','A5','A6','A7','A8'];

    // build lookup from the ParkingSpot[] (id:string) to occupancy
    const spotMap: Record<string, boolean> = {};
    for (const s of firstLot.spots) {
      spotMap[s.id] = s.isOccupied;
    }

    return spotKeys.map((key, index) => ({
      id: index + 1,
      label: key,
      xPx: (stallPositions[index] as any).xPx,
      yPx: (stallPositions[index] as any).yPx,
      status: spotMap[key] ? 'occupied' : 'free'
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
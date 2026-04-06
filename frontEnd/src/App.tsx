import React, { useEffect, useState, useMemo } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import ParkingMap from './components/ParkingMap';
import DemoDisplay, { Stall } from './components/DemoDisplay';
import LotDemo from './assets/LotDemo.png';
import { logger } from './utils/logger';
import { useParkingLotsByIds } from './hooks/useParkingData';
import WuParkLogo from './assets/WuPark Logo 2.jpg';

const STALL_POSITIONS = [
  { xPx: 241, yPx: 101 },
  { xPx: 241, yPx: 141 },
  { xPx: 241, yPx: 181 },
  { xPx: 241, yPx: 221 },
  { xPx: 470, yPx: 101 },
  { xPx: 470, yPx: 141 },
  { xPx: 470, yPx: 181 },
  { xPx: 470, yPx: 221 },
];

const SPOT_KEYS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'];

const useErrorHandler = () => {
  useEffect(() => {
    logger.info('Application started', { timestamp: new Date().toISOString() });

    window.onerror = (message, source, lineno, colno, error) => {
      logger.error(error || message.toString(), { source, lineno, colno });
    };
  }, []);
};

const buildStalls = (spots?: { id: string; isOccupied: boolean }[]): Stall[] => {
  const spotMap: Record<string, boolean | undefined> = {};
  spots?.forEach((s) => (spotMap[s.id] = s.isOccupied));

  return SPOT_KEYS.map((key, index) => ({
    id: index + 1,
    label: key,
    xPx: STALL_POSITIONS[index].xPx,
    yPx: STALL_POSITIONS[index].yPx,
    status: spotMap[key] === undefined ? 'unknown' : spotMap[key] ? 'occupied' : 'free',
  }));
};

const App: React.FC = () => {
  useErrorHandler();

  const [tab, setTab] = useState(0);
  const { data: parkingLots } = useParkingLotsByIds([1, 2]);
  const firstLot = parkingLots?.[0];

  const stalls = useMemo(() => {
    const result = buildStalls(firstLot?.spots);
    logger.info('Stalls updated', { result });
    return result;
  }, [firstLot]);

  const renderDemoDisplay = () => {
    if (!firstLot || stalls.length === 0) {
      return <Typography variant="body2">Parking data not available.</Typography>;
    }

    const total = firstLot.totalSpots ?? stalls.length;
    const occupied = firstLot.occupiedSpots ?? stalls.filter((s) => s.status === 'occupied').length;

    return (
      <DemoDisplay
        imageSrc={LotDemo}
        stalls={stalls}
        lotNum={firstLot.id}
        lastUpdated={firstLot.lastUpdated.toISOString()}
        total={total}
        available={total - occupied}
      />
    );
  };

  return (
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
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          aria-label="main tabs" 
          sx={{ mb: { xs: 1, sm: 2 } }}
          variant="fullWidth"
        >
          <Tab label="Map" />
          <Tab label="Demo Display" />
        </Tabs>
        <Box sx={{flexGrow: 1, minHeight: 0}}>
          {tab === 0 ? <ParkingMap lots={parkingLots || []} /> : renderDemoDisplay()}
        </Box>
      </Container>
    </Box>
  );
};

export default App;
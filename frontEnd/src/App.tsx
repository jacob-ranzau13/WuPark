import React, { useEffect, useState, useMemo } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import ParkingMap from './components/ParkingMap';
import DemoDisplay, { Stall } from './components/DemoDisplay';
import LotDemo from './assets/LotDemo.png';
import { logger } from './utils/logger';
import { useParkingLotsByIds } from './hooks/useParkingData';
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
  const lotIds = [1];
  const { data: parkingLots } = useParkingLotsByIds(lotIds);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const stalls = useMemo((): Stall[] => {
    const firstLot = parkingLots && parkingLots.length > 0 ? parkingLots[0] : undefined;
    
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

    const spotKeys = ['A1','A2','A3','A4','A5','A6','A7','A8'];

    const spotMap: Record<string, boolean | undefined> = {};
    if (firstLot && firstLot.spots) {
      for (const s of firstLot.spots) {
        spotMap[s.id] = s.isOccupied;
      }
    }

    const result = spotKeys.map((key, index) => {
      const occ = spotMap[key];
      const status: any = occ === undefined ? 'unknown' : (occ ? 'occupied' : 'free');
      return {
        id: index + 1,
        label: key,
        xPx: (stallPositions[index] as any).xPx,
        yPx: (stallPositions[index] as any).yPx,
        status,
      };
    });

    logger.info('Stalls updated', { spotMap, result });
    return result;
  }, [parkingLots]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box component="img" src={WuParkLogo} alt="WuPark Logo" sx={{ height: 50, mr: 2 }} /> 
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
          (() => {
            const firstLot = parkingLots && parkingLots.length > 0 ? parkingLots[0] : undefined;
            if (!firstLot || stalls.length === 0) {
              return <Typography variant="body2">Parking data not available.</Typography>;
            }

            const total = firstLot.totalSpots ?? stalls.length;
            const available = (firstLot.totalSpots ?? stalls.length) - (firstLot.occupiedSpots ?? (stalls.filter((s: Stall) => s.status === 'occupied').length));

            return (
              <DemoDisplay
                imageSrc={LotDemo}
                stalls={stalls}
                lotNum={firstLot.id}
                lastUpdated={firstLot.lastUpdated.toISOString()}
                total={total}
                available={available}
              />
            );
          })()
        )}
      </Container>
    </Box>
  );
};

export default App;
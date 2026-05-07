import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';
import SouthEastLot from '../assets/SouthEast Lot.png';
import WuParkLogo from '../assets/WuPark Logo 2.jpg';
import { useParkingLotsByIds } from '../hooks/useParkingData';
import { logger } from '../utils/logger';

export type StallStatus = 'free' | 'occupied' | 'unknown';

export interface Stall {
  id: number;
  label?: string;
  x?: number;
  y?: number;
  xPx?: number;
  yPx?: number;
  status?: StallStatus;
}

const colX = {
  A: 148,
  B: 260,
  C: 343,
  D: 455,
};

const rowY = {
  1: 58,
  2: 94,
  3: 130,
  4: 165,
  5: 201,
  6: 236,
  7: 272,
  8: 307,
};


const SPOT_KEYS = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 
  'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'
];

const STALL_POSITIONS = SPOT_KEYS.map((key) => {
  const col = key[0] as keyof typeof colX;
  const row = Number(key.slice(1)) as keyof typeof rowY;

  return {
    xPx: colX[col],
    yPx: rowY[row],
  };
});

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

const statusColor = (s?: StallStatus) => {
  switch (s) {
    case 'free':
      return '#00C853';
    case 'occupied':
      return '#D50000';
    default:
      return '#9E9E9E';
  }
};

const Lot1DetailPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: parkingLots } = useParkingLotsByIds([2]);
  const lot = parkingLots?.[0];

  const stalls = useMemo(() => {
    const result = buildStalls(lot?.spots);
    logger.info('Stalls updated', { result });
    return result;
  }, [lot]);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [computed, setComputed] = useState<Record<number, { x: number; y: number }>>({});

  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const next: Record<number, { x: number; y: number }> = {};
    stalls.forEach((s) => {
      if (typeof s.xPx === 'number' && typeof s.yPx === 'number' && w > 0 && h > 0) {
        next[s.id] = { x: (s.xPx / w) * 100, y: (s.yPx / h) * 100 };
      }
    });
    setComputed(next);
  }, [stalls]);

  if (!lot) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar sx={{ minHeight: { xs: 60, sm: 70 }, px: { xs: 1, sm: 2 } }}>
            <IconButton color="inherit" onClick={() => navigate('/')}>
              <ArrowBack />
            </IconButton>
            <Box 
              component="img" 
              src={WuParkLogo} 
              alt="WuPark Logo" 
              sx={{ height: { xs: 40, sm: 50 }, mr: { xs: 1, sm: 2 } }} 
            />
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Typography variant="body2">Parking data not available.</Typography>
        </Container>
      </Box>
    );
  }

  const available = stalls.filter(s => s.status === 'free').length;
  const total = lot.totalSpots || stalls.length;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar sx={{ minHeight: { xs: 60, sm: 70 }, px: { xs: 1, sm: 2 } }}>
          <IconButton color="inherit" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Box 
            component="img" 
            src={WuParkLogo} 
            alt="WuPark Logo" 
            sx={{ height: { xs: 40, sm: 50 }, mr: { xs: 1, sm: 2 } }} 
          />
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 1, sm: 2, md: 4 }, 
          mb: { xs: 1, sm: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>{lot.name}</Typography>
            <Box sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              minWidth: 260,
              textAlign: 'center',
              display: 'inline-block'
            }}>
              <Typography variant="body1" color="inherit" sx={{ fontWeight: 600 }}>Available</Typography>
              <Typography variant="h4" color={"black"} sx={{ fontWeight: 700 }}>{available}/{total}</Typography>
            </Box>
          </Box>

          <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <Box
              component="img"
              src={SouthEastLot}
              alt="Southeast Lot"
              sx={{ width: '85%', height: 'auto', display: 'block', margin: '0 auto' }}
              ref={imgRef}
              onLoad={onImageLoad}
            />

            {stalls.map((s) => {
              const pos = computed[s.id];
              const left = pos ? `${pos.x}%` : (typeof s.x === 'number' ? `${s.x}%` : '0%');
              const top = pos ? `${pos.y}%` : (typeof s.y === 'number' ? `${s.y}%` : '0%');

              return (
                <Box
                  key={s.id}
                  title={`Stall ${s.label ?? s.id}: ${s.status ?? 'unknown'}`}
                  sx={{
                    position: 'absolute',
                    left,
                    top,
                    transform: {
                      xs: 'translate(-50%, -50%) scale(0.67)',
                      sm: 'translate(-50%, -50%) scale(0.8)',
                      md: 'translate(-50%, -50%)'
                    },
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: statusColor(s.status),
                      border: '2px solid #fff',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.40)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        userSelect: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.60rem',
                        lineHeight: 1,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {lot && lot.lastUpdated ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption">Last updated: {new Date(lot.lastUpdated).toLocaleString()}</Typography>
            </Box>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
};

export default Lot1DetailPage;

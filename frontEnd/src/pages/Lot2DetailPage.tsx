import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import LotDemo from '../assets/LotDemo.png';
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

const Lot2DetailPage: React.FC = () => {
  const navigate = useNavigate();
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

  const total = lot.totalSpots ?? stalls.length;
  const available = stalls.filter(s => s.status === 'free').length;

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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
            <Box sx={{ backgroundColor: '#f5f5f5', px: 2, py: 1, borderRadius: 1, minWidth: 140, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">Total stalls</Typography>
              <Typography variant="h6">{total}</Typography>
            </Box>

            <Box sx={{ backgroundColor: '#f5f5f5', px: 2, py: 1, borderRadius: 1, minWidth: 140, textAlign: 'center' }}>
              <Typography variant="caption" color="textSecondary">Available</Typography>
              <Typography variant="h6" color={available > 0 ? 'success.main' : 'error.main'}>{available} / {total}</Typography>
            </Box>
          </Box>

          {lot && lot.lastUpdated ? (
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="caption">Lot {lot.id} • Last updated: {new Date(lot.lastUpdated).toLocaleString()}</Typography>
            </Box>
          ) : null}

          <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <Box
              component="img"
              src={LotDemo}
              alt="Lot Demo"
              sx={{ width: '100%', height: 'auto', display: 'block' }}
              ref={imgRef}
              onLoad={onImageLoad}
            />

            {stalls.map((s) => {
              const pos = computed[s.id];
              const left = pos ? `${pos.x}%` : (typeof s.x === 'number' ? `${s.x}%` : '0%');
              const top = pos ? `${pos.y}%` : (typeof s.y === 'number' ? `${s.y}%` : '0%');

              const rawLabel = s.label ?? String(s.id);
              const labelText = rawLabel.toString().startsWith('A') ? rawLabel.toString().slice(1) : rawLabel.toString();
              const showLeft = Number(s.id) >= 5;

              return (
                <Box
                  key={s.id}
                  title={`Stall ${s.label ?? s.id}: ${s.status ?? 'unknown'}`}
                  sx={{
                    position: 'absolute',
                    left,
                    top,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: showLeft ? 'row-reverse' : 'row' }}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        backgroundColor: statusColor(s.status),
                        border: '2px solid #fff',
                        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                      }}
                    />
                    <Typography variant="caption" sx={{ userSelect: 'none' }}>{labelText}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption">Click a stall dot for details (future).</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Lot2DetailPage;

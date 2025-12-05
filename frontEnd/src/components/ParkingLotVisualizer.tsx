import React from 'react';
import { Box, Typography, CircularProgress, Chip, Paper } from '@mui/material';
import { CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import { useParkingLotData } from '../hooks/useParkingData';
import LotDemo from '../assets/LotDemo.png';

interface ParkingLotVisualizerProps {
  lotId: number;
}

const ParkingLotVisualizer: React.FC<ParkingLotVisualizerProps> = ({ lotId }) => {
  const { data: lotData, isLoading, error, dataUpdatedAt } = useParkingLotData(lotId);

  const spotPositions: Record<string, { left: string; top: string }> = {
    'A1': { left: '15%', top: '30%' },
    'A2': { left: '30%', top: '30%' },
    'A3': { left: '45%', top: '30%' },
    'A4': { left: '60%', top: '30%' },
    'A5': { left: '15%', top: '60%' },
    'A6': { left: '30%', top: '60%' },
    'A7': { left: '45%', top: '60%' },
    'A8': { left: '60%', top: '60%' },
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Loading parking lot data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">
          Failed to load parking lot data. {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  if (!lotData) {
    return (
      <Box p={4}>
        <Typography>No parking lot data available.</Typography>
      </Box>
    );
  }

  const availableSpots = lotData.totalSpots - lotData.occupiedSpots;
  const occupancyRate = (lotData.occupiedSpots / lotData.totalSpots) * 100;
  const lastUpdate = new Date(dataUpdatedAt);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          Parking Lot {lotData.lotNum} - Live View
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Chip
            icon={<CheckCircle />}
            label={`${availableSpots} Available`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<Cancel />}
            label={`${lotData.occupiedSpots} Occupied`}
            color="error"
            variant="outlined"
          />
          <Chip
            icon={<AccessTime />}
            label={`${occupancyRate.toFixed(0)}% Full`}
            color={occupancyRate < 50 ? 'success' : occupancyRate < 80 ? 'warning' : 'error'}
          />
        </Box>
      </Box>


      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        Last updated: {lastUpdate.toLocaleTimeString()} (Auto-refreshes every 10 seconds)
      </Typography>

      <Box position="relative" sx={{ maxWidth: '100%', margin: '0 auto' }}>
        <Box
          component="img"
          src={LotDemo}
          alt="Parking lot layout"
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: 1,
          }}
        />

        {Object.entries(lotData.spots).map(([spotId, isOccupied]) => {
          const position = spotPositions[spotId];
          if (!position) return null;

          return (
            <Box
              key={spotId}
              sx={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                transform: 'translate(-50%, -50%)',
                backgroundColor: isOccupied ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.9)',
                color: 'white',
                borderRadius: '50%',
                width: { xs: 30, sm: 40, md: 50 },
                height: { xs: 30, sm: 40, md: 50 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1rem' },
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.2)',
                  zIndex: 10,
                },
              }}
              title={`Spot ${spotId}: ${isOccupied ? 'Occupied' : 'Available'}`}
            >
              {spotId}
            </Box>
          );
        })}
      </Box>

      <Box display="flex" gap={3} mt={2} justifyContent="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              border: '2px solid white',
            }}
          />
          <Typography variant="body2">Available</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 67, 54, 0.9)',
              border: '2px solid white',
            }}
          />
          <Typography variant="body2">Occupied</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ParkingLotVisualizer;

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalParking,
  LocationOn,
  Refresh,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { ParkingLot } from '../types';
import { useParkingLotData } from '../hooks/useParkingData';

interface ParkingLotCardProps {
  lot: ParkingLot;
}

const ParkingLotCard: React.FC<ParkingLotCardProps> = ({ lot }) => {
  const { data: lotData, isLoading, error, refetch } = useParkingLotData(lot.id);

  const occupancyRate = lot.totalSpots > 0 ? (lot.occupiedSpots / lot.totalSpots) * 100 : 0;
  const availableSpots = lot.totalSpots - lot.occupiedSpots;

  const getOccupancyColor = (rate: number) => {
    if (rate < 50) return 'success';
    if (rate < 80) return 'warning';
    return 'error';
  };

  const getStatusChip = () => {
    if (isLoading) {
      return <Chip label="Loading..." size="small" color="default" />;
    }
    if (error) {
      return <Chip label="Offline" size="small" color="error" icon={<Error />} />;
    }
    return <Chip label="Online" size="small" color="success" icon={<CheckCircle />} />;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <LocalParking color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              {lot.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            {getStatusChip()}
            <Tooltip title="Refresh data">
              <IconButton size="small" onClick={() => refetch()}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            Lat: {lot.location.lat.toFixed(4)}, Lng: {lot.location.lng.toFixed(4)}
          </Typography>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Occupancy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {occupancyRate.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={occupancyRate}
            color={getOccupancyColor(occupancyRate)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box textAlign="center">
            <Typography variant="h4" color="success.main">
              {availableSpots}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Available
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="error.main">
              {lot.occupiedSpots}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Occupied
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="text.primary">
              {lot.totalSpots}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Last updated: {new Date(lot.lastUpdated).toLocaleTimeString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ParkingLotCard;
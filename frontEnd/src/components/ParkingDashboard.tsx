import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { LocalParking, Map as MapIcon } from '@mui/icons-material';
import ParkingLotCard from './ParkingLotCard';
import ParkingMap from './ParkingMap';
import { useParkingLots } from '../hooks/useParkingData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ParkingDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { data: parkingLots, isLoading, error } = useParkingLots();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading parking data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load parking data: {error.message}
      </Alert>
    );
  }

  const totalSpots = parkingLots?.reduce((sum, lot) => sum + lot.totalSpots, 0) || 0;
  const occupiedSpots = parkingLots?.reduce((sum, lot) => sum + lot.occupiedSpots, 0) || 0;
  const availableSpots = totalSpots - occupiedSpots;
  const occupancyRate = totalSpots > 0 ? (occupiedSpots / totalSpots) * 100 : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Parking Lots
              </Typography>
              <Typography variant="h4" component="div">
                {parkingLots?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Spots
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {availableSpots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Occupied Spots
              </Typography>
              <Typography variant="h4" component="div" color="error.main">
                {occupiedSpots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Occupancy Rate
              </Typography>
              <Typography variant="h4" component="div">
                {occupancyRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="parking dashboard tabs">
         <Tab icon={<LocalParking />} label="Parking Lots" />
          <Tab icon={<MapIcon />} label="Map View" />
        </Tabs>
      </Box>

   
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {parkingLots?.map((lot) => (
            <Grid item xs={12} md={6} lg={4} key={lot.id}>
              <ParkingLotCard lot={lot} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>


      <TabPanel value={tabValue} index={1}>
        <ParkingMap lots={parkingLots || []} />
      </TabPanel>
    </Box>
  );
};

export default ParkingDashboard;
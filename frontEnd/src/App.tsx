import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { LocalParking } from '@mui/icons-material';
import ParkingDashboard from './components/ParkingDashboard';

const App: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <LocalParking sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WuPark - Smart Parking Management
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ParkingDashboard />
      </Container>
    </Box>
  );
};

export default App;
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import WuParkLogo from '../assets/WuPark Logo 2.jpg';
import { ALL_LOT_LOCATIONS } from '../hooks/useParkingData';

const NoDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { lotId } = useParams<{ lotId: string }>();
  const lotName = ALL_LOT_LOCATIONS[Number(lotId)]?.name || `Lot ${lotId}`;

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
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>{lotName}</Typography>
        <Typography variant="body1" color="text.secondary">
          Parking lot details are not available at this time.
        </Typography>
      </Container>
    </Box>
  );
};

export default NoDataPage;

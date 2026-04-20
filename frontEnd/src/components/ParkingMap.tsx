import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Chip, Button } from '@mui/material';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ParkingLot } from '../types';
import { useParkingLotsByIds } from '../hooks/useParkingData';
import { mergeWithMockData } from '../utils/mockParkingData';
import { useThemeMode } from '../context/ThemeContext';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom icon for parking markers
const createParkingIcon = (occupancyRate: number, hasData: boolean) => {
  let backgroundStyle = '';
  if (hasData) {
    const color = occupancyRate < 80 ? '#4caf50' : occupancyRate < 100 ? '#ff9800' : '#f44336';
    backgroundStyle = `background-color: ${color};`;
  } else {
    backgroundStyle = `background: repeating-linear-gradient(45deg, #808080 0px, #808080 5px, #FFFF00 5px, #FFFF00 10px);`;
  }
  
  return L.divIcon({
    html: `
      <div style="
        ${backgroundStyle}
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">
      </div>
    `,
    className: 'custom-parking-icon',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

interface ParkingMapProps {
  lots: ParkingLot[];
}

const ParkingMap: React.FC<ParkingMapProps> = ({ lots }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();
  const isMobile = window.innerWidth < 600;
  
  const center: [number, number] = [37.7191, -97.2917];
  const zoom = isMobile ? 14 : 16;
  const { data: parkingLots, isLoading, error } = useParkingLotsByIds([1, 2]);

  const displayLots = mergeWithMockData(lots);

  const tileLayerUrl = isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileLayer = isDarkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          attribution={tileLayer}
          url={tileLayerUrl}
        />
        {displayLots.map((lot) => {
          const hasData = lot.totalSpots > 0;
          const occupancyRate = hasData 
            ? (lot.occupiedSpots / lot.totalSpots) * 100 
            : 0;
          const availableSpots = lot.totalSpots - lot.occupiedSpots;
          
          return (
            <Marker
              key={lot.id}
              position={[lot.location.lat, lot.location.lng]}
              icon={createParkingIcon(occupancyRate, hasData)}
            >
              <Popup>
                <Box sx={{ minWidth: 200, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {lot.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Chip
                      label={`${occupancyRate.toFixed(1)}% occupied`}
                      color={occupancyRate < 80 ? 'success' : occupancyRate < 100 ? 'warning' : 'error'}
                      size="medium"
                      sx={{ fontSize: '1rem', padding: '20px 8px' }}
                    />
                  </Box>
                  
                  {hasData ? (
                    <Box display="flex" justifyContent="center" gap={3} mb={2}>
                      <Box textAlign="center">
                        <Typography variant="h4" color="success.main">
                          {availableSpots}
                        </Typography>
                        <Typography variant="body2">Available</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h4" color="error.main">
                          {lot.occupiedSpots}
                        </Typography>
                        <Typography variant="body2">Occupied</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box textAlign="center" mb={2}>
                      <Typography variant="body1" color="text.secondary">
                        No data available
                      </Typography>
                    </Box>
                  )}
                  
                  <Box textAlign="center" sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => navigate(`/lot/${lot.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Updated: {new Date(lot.lastUpdated).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default ParkingMap;
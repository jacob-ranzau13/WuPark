import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Example parking locations for Rochester, MN
const SAMPLE_LOCATIONS = [
  { 
    id: 1, 
    name: 'Main Parking', 
    position: [44.0121, -92.4802],
    totalSpots: 100,
    occupiedSpots: 25,
    lastUpdated: new Date()
  },
  { 
    id: 2, 
    name: 'North Parking', 
    position: [44.0131, -92.4812],
    totalSpots: 75,
    occupiedSpots: 30,
    lastUpdated: new Date()
  },
  { 
    id: 3, 
    name: 'South Parking', 
    position: [44.0111, -92.4792],
    totalSpots: 50,
    occupiedSpots: 15,
    lastUpdated: new Date()
  },
];

// Create a custom icon for parking markers
const createParkingIcon = (occupancyRate: number) => {
  const color = occupancyRate < 50 ? '#4caf50' : occupancyRate < 80 ? '#ff9800' : '#f44336';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        P
      </div>
    `,
    className: 'custom-parking-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const ParkingMap: React.FC = () => {
  const center: [number, number] = [44.0121, -92.4802]; // Rochester, MN coordinates
  const zoom = 15;

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {SAMPLE_LOCATIONS.map((location) => {
          const occupancyRate = location.totalSpots > 0 
            ? (location.occupiedSpots / location.totalSpots) * 100 
            : 0;
          const availableSpots = location.totalSpots - location.occupiedSpots;
          
          return (
            <Marker
              key={location.id}
              position={location.position as [number, number]}
              icon={createParkingIcon(occupancyRate)}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    {location.name}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {location.position[0].toFixed(4)}, {location.position[1].toFixed(4)}
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Chip
                      label={`${occupancyRate.toFixed(1)}% occupied`}
                      color={occupancyRate < 50 ? 'success' : occupancyRate < 80 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {availableSpots}
                      </Typography>
                      <Typography variant="caption">Available</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6" color="error.main">
                        {location.occupiedSpots}
                      </Typography>
                      <Typography variant="caption">Occupied</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6">
                        {location.totalSpots}
                      </Typography>
                      <Typography variant="caption">Total</Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Updated: {location.lastUpdated.toLocaleTimeString()}
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
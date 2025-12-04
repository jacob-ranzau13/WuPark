import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ParkingLot } from '../types';
import { useParkingLots } from '../hooks/useParkingData';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface ParkingMapProps {
  lots: ParkingLot[];
}

const ParkingMap: React.FC<ParkingMapProps> = ({ lots }) => {
  const center: [number, number] = [37.7191, -97.2917]; // Rochester, MN coordinates
  const zoom = 16;
  const { data: parkingLots, isLoading, error } = useParkingLots();

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
        {lots.map((lot) => {
          const occupancyRate = lot.totalSpots > 0 
            ? (lot.occupiedSpots / lot.totalSpots) * 100 
            : 0;
          const availableSpots = lot.totalSpots - lot.occupiedSpots;
          
          return (
            <Marker
              key={lot.id}
              position={[lot.location.lat, lot.location.lng]}
              icon={createParkingIcon(occupancyRate)}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    {lot.name}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {lot.location.lat.toFixed(4)}, {lot.location.lng.toFixed(4)}
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
                        {lot.occupiedSpots}
                      </Typography>
                      <Typography variant="caption">Occupied</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h6">
                        {lot.totalSpots}
                      </Typography>
                      <Typography variant="caption">Total</Typography>
                    </Box>
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
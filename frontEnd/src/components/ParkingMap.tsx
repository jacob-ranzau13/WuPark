import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Example parking locations
const SAMPLE_LOCATIONS = [
  { id: 1, name: 'Main Parking', position: [44.0121, -92.4802], spaces: 100 },
  { id: 2, name: 'North Parking', position: [44.0131, -92.4812], spaces: 75 },
  { id: 3, name: 'South Parking', position: [44.0111, -92.4792], spaces: 50 },
];

const ParkingMap: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    if (lots.length > 0) {
      const group = new L.FeatureGroup(lots.map(lot => 
        L.marker([lot.location.lat, lot.location.lng])
      ));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [lots, map]);

  return null;
};

interface ParkingMapProps {
  lots: ParkingLot[];
}

const ParkingMap: React.FC<ParkingMapProps> = ({ lots }) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060]; 
  const defaultZoom = 13;

  if (lots.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No parking lots available
          </Typography>
          <Typography color="text.secondary">
            Parking lot data is currently unavailable.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController lots={lots} />
        
        {lots.map((lot) => {
          const occupancyRate = lot.totalSpots > 0 ? (lot.occupiedSpots / lot.totalSpots) * 100 : 0;
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
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, TextField, Typography, Collapse
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ParkingLot } from '../types';
import { buildings } from '../data/buildings';

export const SIDEBAR_WIDTH = 250;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  parkingLots: ParkingLot[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onSettingsClick, parkingLots }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Haversine distance calculation
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredBuildings = useMemo(() => {
    if (!searchQuery) return [];
    return buildings.filter(building =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getNearestLots = (buildingLat: number, buildingLng: number) => {
    return [...parkingLots].sort((a, b) => {
      const distA = getDistance(buildingLat, buildingLng, a.location.lat, a.location.lng);
      const distB = getDistance(buildingLat, buildingLng, b.location.lat, b.location.lng);
      return distA - distB;
    });
  };

  return (
    <Drawer 
      variant="persistent" 
      open={open} 
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { top: { xs: 60, sm: 70 }, height: 'auto', bottom: 0 } }}
    >
      <Box sx={{ width: SIDEBAR_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
        </Box>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {!searchQuery ? (
            parkingLots.map((lot) => (
              <ListItem key={lot.id}>
                <ListItemButton onClick={() => navigate(`/lot/${lot.id}`)}>
                  <ListItemText 
                    primary={lot.name}
                    secondary={`${lot.occupiedSpots}/${lot.totalSpots} spots`}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            filteredBuildings.map((building) => {
              const nearestLots = getNearestLots(building.lat, building.lng);
              return (
                <React.Fragment key={building.name}>
                  <ListItem>
                    <ListItemText primary={building.name} />
                  </ListItem>
                  {nearestLots.map((lot) => (
                    <ListItem key={lot.id} sx={{ pl: 4 }}>
                      <ListItemButton onClick={() => navigate(`/lot/${lot.id}`)}>
                        <ListItemText 
                          primary={`${lot.name} (${(getDistance(building.lat, building.lng, lot.location.lat, lot.location.lng) * 1000).toFixed(0)}m)`}
                          secondary={`${lot.occupiedSpots}/${lot.totalSpots} spots`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              );
            })
          )}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onSettingsClick}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

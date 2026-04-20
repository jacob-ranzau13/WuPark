import React from 'react';
import {
  Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

export const SIDEBAR_WIDTH = 250;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onSettingsClick }) => {
  return (
    <Drawer 
      variant="persistent" 
      open={open} 
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { top: { xs: 60, sm: 70 }, height: 'auto', bottom: 0 } }}
    >
      <Box sx={{ width: SIDEBAR_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={onClose}>
              <ListItemIcon><MapIcon /></ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
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

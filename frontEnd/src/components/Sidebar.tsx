import React from 'react';
import {
  Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onSettingsClick }) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
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

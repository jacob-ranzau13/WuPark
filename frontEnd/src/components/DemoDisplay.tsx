import React from 'react';
import { Box, Typography } from '@mui/material';

export type StallStatus = 'free' | 'occupied' | 'unknown';

export interface Stall {
  id: number;
  // optional label from backend (e.g. "A1")
  label?: string;
  // coordinates are percentages (0-100) relative to the image dimensions
  x: number;
  y: number;
  status?: StallStatus;
}

interface DemoDisplayProps {
  imageSrc: string;
  stalls: Stall[];
}

const statusColor = (s?: StallStatus) => {
  switch (s) {
    case 'free':
      return '#00C853'; // green
    case 'occupied':
      return '#D50000'; // red
    default:
      return '#9E9E9E'; // gray
  }
};

const DemoDisplay: React.FC<DemoDisplayProps> = ({ imageSrc, stalls }) => {
  const total = stalls.length;
  const available = stalls.filter(s => s.status === 'free').length;

  return (
    <Box>
      {/* Summary boxes above the image */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
        <Box sx={{ backgroundColor: '#f5f5f5', px: 2, py: 1, borderRadius: 1, minWidth: 140, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">Total stalls</Typography>
          <Typography variant="h6">{total}</Typography>
        </Box>

        <Box sx={{ backgroundColor: '#f5f5f5', px: 2, py: 1, borderRadius: 1, minWidth: 140, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">Available</Typography>
          <Typography variant="h6" color={available > 0 ? 'success.main' : 'error.main'}>{available} / {total}</Typography>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Box
          component="img"
          src={imageSrc}
          alt="Lot Demo"
          sx={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {/* overlay dots */}
        {stalls.map((s) => (
          <Box
            key={s.id}
            title={`Stall ${s.label ?? s.id}: ${s.status ?? 'unknown'}`}
            sx={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: statusColor(s.status),
              border: '2px solid #fff',
              boxShadow: '0 0 6px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption">Click a stall dot for details (future).</Typography>
      </Box>
    </Box>
  );
};

export default DemoDisplay;

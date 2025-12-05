import React, { useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

export type StallStatus = 'free' | 'occupied' | 'unknown';

export interface Stall {
  id: number;
  // optional label from backend (e.g. "A1")
  label?: string;
  // coordinates are percentages (0-100) relative to the image dimensions
  x?: number;
  y?: number;
  // optional pixel coordinates relative to the image's natural size
  xPx?: number;
  yPx?: number;
  status?: StallStatus;
}

interface DemoDisplayProps {
  imageSrc: string;
  stalls: Stall[];
  lotNum?: number;
  lastUpdated?: string;
  total?: number;
  available?: number;
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

const DemoDisplay: React.FC<DemoDisplayProps> = ({ imageSrc, stalls, lotNum, lastUpdated, total: propTotal, available: propAvailable }) => {
  // Prefer explicit totals passed in from App (derived from API). Fallback to computing from stalls.
  const total = typeof propTotal === 'number' ? propTotal : stalls.length;
  const available = typeof propAvailable === 'number' ? propAvailable : stalls.filter(s => s.status === 'free').length;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [computed, setComputed] = useState<Record<number, { x: number; y: number }>>({});

  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const next: Record<number, { x: number; y: number }> = {};
    stalls.forEach((s) => {
      if (typeof s.xPx === 'number' && typeof s.yPx === 'number' && w > 0 && h > 0) {
        next[s.id] = { x: (s.xPx / w) * 100, y: (s.yPx / h) * 100 };
      }
    });
    setComputed(next);
  }, [stalls]);

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

      {/* show lot metadata if provided */}
      {lotNum && lastUpdated ? (
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="caption">Lot {lotNum} • Last updated: {new Date(lastUpdated).toLocaleString()}</Typography>
        </Box>
      ) : null}

      <Box sx={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Box
          component="img"
          src={imageSrc}
          alt="Lot Demo"
          sx={{ width: '100%', height: 'auto', display: 'block' }}
          ref={imgRef}
          onLoad={onImageLoad}
        />

        {/* overlay dots */}
        {stalls.map((s) => {
          const pos = computed[s.id];
          const left = pos ? `${pos.x}%` : (typeof s.x === 'number' ? `${s.x}%` : '0%');
          const top = pos ? `${pos.y}%` : (typeof s.y === 'number' ? `${s.y}%` : '0%');

          // determine label text (strip leading 'A' if present)
          const rawLabel = s.label ?? String(s.id);
          const labelText = rawLabel.toString().startsWith('A') ? rawLabel.toString().slice(1) : rawLabel.toString();
          const showLeft = Number(s.id) >= 5; // stalls 5-8 show label left

          return (
            <Box
              key={s.id}
              title={`Stall ${s.label ?? s.id}: ${s.status ?? 'unknown'}`}
              sx={{
                position: 'absolute',
                left,
                top,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: showLeft ? 'row-reverse' : 'row' }}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: statusColor(s.status),
                    border: '2px solid #fff',
                    boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                  }}
                />
                <Typography variant="caption" sx={{ userSelect: 'none' }}>{labelText}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption">Click a stall dot for details (future).</Typography>
      </Box>
    </Box>
  );
};

export default DemoDisplay;

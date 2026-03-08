import { ApiParkingLotResponse, ParsedParkingLotData } from '../types';

export const normalizeApiResponse = (
  data: ApiParkingLotResponse[] | { data: ApiParkingLotResponse[] }
): ApiParkingLotResponse[] => {
  return Array.isArray(data) ? data : data.data;
};

export const pickLatestByLot = (items: ApiParkingLotResponse[]): ApiParkingLotResponse[] => {
  const latest: Record<string, ApiParkingLotResponse> = {};
  for (const item of items) {
    const current = latest[item.lotNum];
    if (!current || Number(item.timestamp) > Number(current.timestamp)) {
      latest[item.lotNum] = item;
    }
  }

  return Object.values(latest);
};

export const parseAvailability = (availability: unknown): Record<string, boolean> => {
  const parsed = typeof availability === 'string' ? JSON.parse(availability) : availability;
  const map = (parsed as any)?.M ? (parsed as any).M : parsed;
  const spots: Record<string, boolean> = {};

  Object.entries(map as Record<string, boolean>).forEach(([spotId, isOccupied]) => {
    spots[spotId] = Boolean(isOccupied);
  });

  return spots;
};

export const toParsedLot = (data: ApiParkingLotResponse): ParsedParkingLotData => {
  const spots = parseAvailability(data.availability);
  const occupiedSpots = Object.values(spots).filter(Boolean).length;

  return {
    lotNum: Number(data.lotNum),
    timestamp: Number(data.timestamp),
    spots,
    totalSpots: Object.keys(spots).length,
    occupiedSpots
  };
};

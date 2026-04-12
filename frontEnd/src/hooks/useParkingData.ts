import { useQuery, UseQueryResult } from 'react-query';
import { ParkingLot, ParkingSpot, ParsedParkingLotData } from '../types';
import { fetchParkingLotData } from '../services/parkingApi';
import { logger } from '../utils/logger';

const POLLING_INTERVAL = 10000;

const ALL_LOT_LOCATIONS: Record<number, { lat: number; lng: number; name: string }> = {
  1: { lat: 37.716030356563614, lng: -97.29224684614849, name: 'Lot 9E' },
  2: { lat: 37.716030356563614, lng: -97.29349943770109, name: 'Lot 9W' },
  3: { lat: 37.71886894787127, lng: -97.29860667812783, name: 'Lot 1' },
  4: { lat: 37.71886894787127, lng: -97.29775373567678, name: 'Lot 16S' },
  5: { lat: 37.72198776152478, lng: -97.29080681435659, name: 'Lot 5' },
  6: { lat: 37.71955212780141, lng: -97.28632752522817, name: 'Lot 14' },
};
const LOTS_WITH_DATA = [1, 2]; 

const convertToParkingLot = (data: ParsedParkingLotData): ParkingLot => {
  const lotInfo = ALL_LOT_LOCATIONS[data.lotNum];
  const spots: ParkingSpot[] = Object.entries(data.spots).map(([spotId, isOccupied]) => ({
    id: spotId,
    isOccupied,
    lotId: data.lotNum
  }));

  return {
    id: data.lotNum,
    name: lotInfo?.name || `Parking Lot ${data.lotNum}`,
    spots,
    totalSpots: data.totalSpots,
    occupiedSpots: data.occupiedSpots,
    lastUpdated: new Date(data.timestamp * 1000)
  };
};

const createPlaceholderLot = (lotId: number): ParkingLot => {
  const lotInfo = ALL_LOT_LOCATIONS[lotId];
  return {
    id: lotId,
    name: lotInfo?.name || `Parking Lot ${lotId}`,
    spots: [],
    totalSpots: 0,
    occupiedSpots: 0,
    lastUpdated: new Date()
  };
};

export const useParkingLotsByIds = (lotIds: number[]): UseQueryResult<ParkingLot[], Error> => {
  return useQuery(
    ['parkingLotsByIds', lotIds],
    async () => {
      const results: ParkingLot[] = [];
      
      for (const id of lotIds) {
        if (LOTS_WITH_DATA.includes(id)) {
          try {
            const data = await fetchParkingLotData(id);
            results.push(convertToParkingLot(data));
          } catch {
            results.push(createPlaceholderLot(id));
          }
        } else {
          results.push(createPlaceholderLot(id));
        }
      }
      
      return results;
    },
    {
      enabled: lotIds.length > 0,
      refetchInterval: POLLING_INTERVAL,
      staleTime: 5000,
      onError: (error) => {
        logger.error('Failed to fetch parking lots', { error, lotIds });
      }
    }
  );
};

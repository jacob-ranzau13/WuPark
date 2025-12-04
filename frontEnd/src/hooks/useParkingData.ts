import { useQuery, UseQueryResult } from 'react-query';
import { ParkingLot, ParkingLotData, ParkingSpot } from '../types';

// Mock data
const generateMockSpots = (count: number, lotId: number): ParkingSpot[] => {
  return Array(count).fill(null).map((_, index) => ({
    id: index + 1,
    isOccupied: Math.random() > 0.7,
    lotId
  }));
};

const MOCK_PARKING_LOTS: ParkingLot[] = [
  {
    id: 1,
    name: 'Main Parking',
    location: { lat: 37.7191, lng: -97.2985 },
    spots: generateMockSpots(100, 1),
    totalSpots: 100,
    occupiedSpots: 25,
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'North Parking',
    location: { lat: 37.722, lng: -97.2905 },
    spots: generateMockSpots(50, 2),
    totalSpots: 50,
    occupiedSpots: 20,
    lastUpdated: new Date()
  },
  {
    id: 3,
    name: 'South Parking',
    location: { lat: 37.7165, lng: -97.2856 },
    spots: generateMockSpots(75, 3),
    totalSpots: 75,
    occupiedSpots: 30,
    lastUpdated: new Date()
  }
];

const MOCK_PARKING_DATA: Record<number, ParkingLotData> = {
  1: { 
    lotNumber: 1, 
    spotStatuses: Array(100).fill(false).map(() => Math.random() > 0.75),
    byteData: [100, 1, ...Array(12).fill(0).map(() => Math.floor(Math.random() * 256))]
  },
  2: { 
    lotNumber: 2, 
    spotStatuses: Array(50).fill(false).map(() => Math.random() > 0.6),
    byteData: [50, 2, ...Array(6).fill(0).map(() => Math.floor(Math.random() * 256))]
  },
  3: { 
    lotNumber: 3, 
    spotStatuses: Array(75).fill(false).map(() => Math.random() > 0.6),
    byteData: [75, 3, ...Array(9).fill(0).map(() => Math.floor(Math.random() * 256))]
  }
};

export const useParkingLots = (): UseQueryResult<ParkingLot[], Error> => {
  return useQuery(
    'parkingLots',
    () => Promise.resolve(MOCK_PARKING_LOTS),
    {
      refetchInterval: 30000,
      staleTime: 10000,
    }
  );
};

export const useParkingLot = (lotId: number): UseQueryResult<ParkingLot, Error> => {
  return useQuery(
    ['parkingLot', lotId],
    () => {
      const lot = MOCK_PARKING_LOTS.find(l => l.id === lotId);
      return Promise.resolve(lot || Promise.reject(new Error('Lot not found')));
    },
    {
      enabled: !!lotId,
      refetchInterval: 15000,
    }
  );
};

export const useParkingLotData = (lotId: number): UseQueryResult<ParkingLotData, Error> => {
  return useQuery(
    ['parkingLotData', lotId],
    () => {
      const data = MOCK_PARKING_DATA[lotId];
      return Promise.resolve(data || Promise.reject(new Error('Parking data not found')));
    },
    {
      enabled: !!lotId,
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  );
};
export const useParkingSpots = (lotId: number): UseQueryResult<ParkingSpot[], Error> => {
  return useQuery(
    ['parkingSpots', lotId],
    () => {
      const lot = MOCK_PARKING_LOTS.find(l => l.id === lotId);
      if (!lot) {
        return Promise.reject(new Error('Lot not found'));
      }
      return Promise.resolve(lot.spots);
    },
    {
      enabled: !!lotId,
      refetchInterval: 10000, // Refresh every 10 seconds
    }
  );
};

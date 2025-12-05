import { useQuery, UseQueryResult } from 'react-query';
import { ParkingLot, ParkingSpot, ParsedParkingLotData } from '../types';
import { fetchParkingLotData, fetchAllParkingLots } from '../services/parkingApi';
import { logger } from '../utils/logger';

const POLLING_INTERVAL = 30000; // poll every 30 seconds while debugging

const convertToParkingLot = (data: ParsedParkingLotData, index: number): ParkingLot => {
  const spots: ParkingSpot[] = Object.entries(data.spots).map(([spotId, isOccupied]) => ({
    id: spotId,
    isOccupied,
    lotId: data.lotNum
  }));

  const mockLocations = [
    { lat: 37.7191, lng: -97.2985 },
    { lat: 37.722, lng: -97.2905 },
    { lat: 37.7165, lng: -97.2856 }
  ];

  return {
    id: data.lotNum,
    name: `Parking Lot ${data.lotNum}`,
    location: mockLocations[index] || mockLocations[0],
    spots,
    totalSpots: data.totalSpots,
    occupiedSpots: data.occupiedSpots,
    lastUpdated: new Date(data.timestamp * 1000)
  };
};

export const useParkingLots = (): UseQueryResult<ParkingLot[], Error> => {
  return useQuery(
    'parkingLots',
    async () => {
      const data = await fetchAllParkingLots();
      return data.map((lot, index) => convertToParkingLot(lot, index));
    },
    {
      refetchInterval: POLLING_INTERVAL,
      staleTime: 5000,
      onError: (error) => {
        logger.error('Failed to fetch parking lots', { error });
      }
    }
  );
};

export const useParkingLot = (lotId: number): UseQueryResult<ParkingLot, Error> => {
  return useQuery(
    ['parkingLot', lotId],
    async () => {
      const data = await fetchParkingLotData(lotId);
      return convertToParkingLot(data, lotId - 1);
    },
    {
      enabled: !!lotId,
      refetchInterval: POLLING_INTERVAL,
      onError: (error) => {
        logger.error('Failed to fetch parking lot', { error, lotId });
      }
    }
  );
};

export const useParkingLotData = (lotId: number): UseQueryResult<ParsedParkingLotData, Error> => {
  return useQuery(
    ['parkingLotData', lotId],
    async () => {
      return await fetchParkingLotData(lotId);
    },
    {
      enabled: !!lotId,
      refetchInterval: POLLING_INTERVAL,
      onError: (error) => {
        logger.error('Failed to fetch parking lot data', { error, lotId });
      }
    }
  );
};

export const useParkingSpots = (lotId: number): UseQueryResult<ParkingSpot[], Error> => {
  const { data: lotData } = useParkingLotData(lotId);
  
  return useQuery(
    ['parkingSpots', lotId],
    () => {
      if (!lotData) {
        return Promise.reject(new Error('Lot data not available'));
      }
      
      const spots: ParkingSpot[] = Object.entries(lotData.spots).map(([spotId, isOccupied]) => ({
        id: spotId,
        isOccupied,
        lotId
      }));
      
      return Promise.resolve(spots);
    },
    {
      enabled: !!lotId && !!lotData,
      refetchInterval: POLLING_INTERVAL,
    }
  );
};

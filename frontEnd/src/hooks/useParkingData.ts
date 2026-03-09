import { useQuery, UseQueryResult } from 'react-query';
import { ParkingLot, ParkingSpot, ParsedParkingLotData } from '../types';
import { fetchParkingLotData } from '../services/parkingApi';
import { logger } from '../utils/logger';

const POLLING_INTERVAL = 10000; // poll every 10 seconds

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

export const useParkingLotsByIds = (lotIds: number[]): UseQueryResult<ParkingLot[], Error> => {
  return useQuery(
    ['parkingLotsByIds', lotIds],
    async () => {
      const results = await Promise.all(lotIds.map((id, index) =>
        fetchParkingLotData(id).then((data) => convertToParkingLot(data, index))
      ));
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

export const useParkingLots = (): UseQueryResult<ParkingLot[], Error> => {
  return useParkingLotsByIds([1, 2, 3]);
};

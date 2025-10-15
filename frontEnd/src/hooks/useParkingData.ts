import { useQuery, UseQueryResult } from 'react-query';
import { parkingApi } from '../services/api';
import { ParkingLot, ParkingLotData } from '../types';


export const useParkingLots = (): UseQueryResult<ParkingLot[], Error> => {
  return useQuery(
    'parkingLots',
    parkingApi.getAllParkingLots,
    {
      refetchInterval: 30000, 
      staleTime: 10000, 
    }
  );
};

export const useParkingLot = (lotId: number): UseQueryResult<ParkingLot, Error> => {
  return useQuery(
    ['parkingLot', lotId],
    () => parkingApi.getParkingLot(lotId),
    {
      enabled: !!lotId,
      refetchInterval: 15000, 
    }
  );
};

export const useParkingLotData = (lotId: number): UseQueryResult<ParkingLotData, Error> => {
  return useQuery(
    ['parkingLotData', lotId],
    () => parkingApi.getParkingLotData(lotId),
    {
      enabled: !!lotId,
      refetchInterval: 5000, 
    }
  );
};


export const useHealthCheck = (): UseQueryResult<{ status: string; timestamp: string }, Error> => {
  return useQuery(
    'healthCheck',
    parkingApi.healthCheck,
    {
      refetchInterval: 60000, 
      retry: 3,
    }
  );
};
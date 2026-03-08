import { ParsedParkingLotData } from '../types';
import { ParkingApiService } from './ParkingApiService';

const apiService = ParkingApiService.fromEnv();

export const fetchParkingLotData = async (lotNum: number): Promise<ParsedParkingLotData> => {
  return apiService.fetchParkingLotData(lotNum);
};

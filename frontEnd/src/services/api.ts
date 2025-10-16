import axios from 'axios';
import { ParkingLot, ParkingLotData, ApiResponse } from '../types';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/prod';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const parkingApi = {
  // Get all parking lots
  getAllParkingLots: async (): Promise<ParkingLot[]> => {
    const response = await apiClient.get<ApiResponse<ParkingLot[]>>('/lots');
    return response.data.data;
  },


  getParkingLot: async (lotId: number): Promise<ParkingLot> => {
    const response = await apiClient.get<ApiResponse<ParkingLot>>(`/lots/${lotId}`);
    return response.data.data;
  },


  getParkingLotData: async (lotId: number): Promise<ParkingLotData> => {
    const response = await apiClient.get<ApiResponse<ParkingLotData>>(`/lots/${lotId}/data`);
    return response.data.data;
  },

  updateParkingLotData: async (lotId: number, data: ParkingLotData): Promise<void> => {
    await apiClient.post(`/lots/${lotId}/data`, data);
  },


  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};


export const parseParkingData = (bytes: number[]): ParkingLotData => {
  if (bytes.length < 2) {
    throw new Error('Invalid data: minimum 2 bytes required');
  }

  const numDataBytes = bytes[0];
  const lotNumber = bytes[1];
  
  if (bytes.length !== numDataBytes + 1) {
    throw new Error(`Data length mismatch: expected ${numDataBytes + 1} bytes, got ${bytes.length}`);
  }

  const spotStatuses: boolean[] = [];
  
  for (let i = 2; i < bytes.length; i++) {
    const byte = bytes[i];
   
    for (let bit = 0; bit < 8; bit++) {
      const isOccupied = (byte & (1 << bit)) !== 0;
      spotStatuses.push(isOccupied);
    }
  }

  return {
    lotNumber,
    spotStatuses,
    byteData: bytes,
  };
};

export default apiClient;
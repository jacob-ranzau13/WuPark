import { ApiParkingLotResponse, ParsedParkingLotData, DynamoDBAvailability } from '../types';
import { logger } from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_URL environment variable is not set');
}

const parseAvailability = (availabilityString: string): Record<string, boolean> => {
  try {
    const parsed: DynamoDBAvailability = JSON.parse(availabilityString);
    const spots: Record<string, boolean> = {};
    
    for (const [spotId, spotData] of Object.entries(parsed)) {
      spots[spotId] = spotData.M.occupied.BOOL;
    }
    
    return spots;
  } catch (error) {
    logger.error('Failed to parse availability data', { error, availabilityString });
    throw new Error('Invalid availability data format');
  }
};

export const fetchParkingLotData = async (lotNum: number): Promise<ParsedParkingLotData> => {
  try {
    logger.info('Fetching parking lot data', { lotNum });
    
    const response = await fetch(`${API_BASE_URL}/parking/availability/${lotNum}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ApiParkingLotResponse = await response.json();
    
    const spots = parseAvailability(data.availability);
    const occupiedSpots = Object.values(spots).filter(occupied => occupied).length;
    const totalSpots = Object.keys(spots).length;
    
    const parsedData: ParsedParkingLotData = {
      lotNum: parseInt(data.lotNum),
      timestamp: parseInt(data.timestamp),
      spots,
      totalSpots,
      occupiedSpots
    };
    
    logger.info('Successfully fetched parking lot data', { 
      lotNum, 
      totalSpots, 
      occupiedSpots,
      availableSpots: totalSpots - occupiedSpots
    });
    
    return parsedData;
  } catch (error) {
    logger.error('Failed to fetch parking lot data', { error, lotNum });
    throw error;
  }
};

export const fetchAllParkingLots = async (): Promise<ParsedParkingLotData[]> => {
  try {
    logger.info('Fetching all parking lots');
    
    const response = await fetch(`${API_BASE_URL}/parking/availability`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ApiParkingLotResponse[] = await response.json();
    
    return data.map(lot => {
      const spots = parseAvailability(lot.availability);
      const occupiedSpots = Object.values(spots).filter(occupied => occupied).length;
      
      return {
        lotNum: parseInt(lot.lotNum),
        timestamp: parseInt(lot.timestamp),
        spots,
        totalSpots: Object.keys(spots).length,
        occupiedSpots
      };
    });
  } catch (error) {
    logger.error('Failed to fetch all parking lots', { error });
    throw error;
  }
};

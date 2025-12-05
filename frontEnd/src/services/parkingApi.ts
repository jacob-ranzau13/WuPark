import { ApiParkingLotResponse, ParsedParkingLotData, DynamoDBAvailability } from '../types';
import { logger } from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ensureApiBaseUrl = () => {
  if (!API_BASE_URL) {
    const msg = 'REACT_APP_API_URL environment variable is not set. Set it in frontEnd/.env or your environment.';
    logger.error(msg);
    throw new Error(msg);
  }
  return API_BASE_URL;
};

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

const pickLatestByLot = (items: ApiParkingLotResponse[] | ApiParkingLotResponse): ApiParkingLotResponse[] => {
  if (!Array.isArray(items)) return [items];

  const latestMap: Record<string, ApiParkingLotResponse> = {};
  for (const it of items) {
    const lotKey = it.lotNum;
    const ts = parseInt(it.timestamp as any);
    if (!latestMap[lotKey] || parseInt(latestMap[lotKey].timestamp as any) < ts) {
      latestMap[lotKey] = it;
    }
  }
  return Object.values(latestMap);
};

export const fetchParkingLotData = async (lotNum: number): Promise<ParsedParkingLotData> => {
  try {
    logger.info('Fetching parking lot data', { lotNum });
    
  const base = ensureApiBaseUrl();
  const response = await fetch(`${base}/${lotNum}`);

    // read raw response text for debugging and logging
    const rawText = await response.text();
    logger.info('Raw API response', { url: `${base}/${lotNum}`, status: response.status, rawText });

    if (!response.ok) {
      logger.error('API request failed', { url: `${base}/${lotNum}`, status: response.status, rawText });
      throw new Error(`API request failed with status ${response.status}`);
    }

    let parsed: ApiParkingLotResponse | ApiParkingLotResponse[];
    try {
      parsed = JSON.parse(rawText) as ApiParkingLotResponse | ApiParkingLotResponse[];
    } catch (err) {
      logger.error('Failed to parse JSON from API response', { url: `${base}/${lotNum}`, rawText, error: err });
      throw new Error('Invalid JSON received from API');
    }

    // If the API returned multiple records for the lot, pick the most recent by timestamp
    const candidates = pickLatestByLot(parsed);
    if (candidates.length > 1) {
      logger.info('Multiple records returned for lot; using most recent by timestamp', { url: `${base}/${lotNum}`, candidatesCount: candidates.length });
    }
    const data = candidates[0];
    
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
    
  const base = ensureApiBaseUrl();
  const response = await fetch(base);

    // read raw response text for debugging and logging
    const rawText = await response.text();
    logger.info('Raw API response', { url: base, status: response.status, rawText });

    if (!response.ok) {
      logger.error('API request failed', { url: base, status: response.status, rawText });
      throw new Error(`API request failed with status ${response.status}`);
    }

    let parsed: ApiParkingLotResponse[] | ApiParkingLotResponse;
    try {
      parsed = JSON.parse(rawText) as ApiParkingLotResponse[] | ApiParkingLotResponse;
    } catch (err) {
      logger.error('Failed to parse JSON from API response', { url: base, rawText, error: err });
      throw new Error('Invalid JSON received from API');
    }

    // Ensure we only use the most recent record per lotNum
    const data = pickLatestByLot(parsed);

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

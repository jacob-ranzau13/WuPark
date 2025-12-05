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

const parseAvailability = (availabilityRaw: any): Record<string, boolean> => {
  try {
    let parsed: any = availabilityRaw;

    // If the API returned a JSON string, parse it
    if (typeof availabilityRaw === 'string') {
      parsed = JSON.parse(availabilityRaw);
    }

    // If DynamoDB wrapped the map under { M: { ... } }, unwrap it
    if (parsed && typeof parsed === 'object' && parsed.M && typeof parsed.M === 'object') {
      parsed = parsed.M;
    }

    const spots: Record<string, boolean> = {};

    for (const [spotId, spotData] of Object.entries(parsed)) {
      const value = (spotData && spotData.M && spotData.M.occupied && typeof spotData.M.occupied.BOOL === 'boolean')
        ? spotData.M.occupied.BOOL
        : (spotData && typeof spotData === 'object' && typeof (spotData as any).occupied === 'boolean')
          ? (spotData as any).occupied
          : (typeof spotData === 'boolean' ? spotData : undefined);

      if (typeof value === 'boolean') {
        spots[spotId] = value;
      } else {
        logger.error('Unknown spot data shape', { spotId, spotData });
        spots[spotId] = false;
      }
    }

    return spots;
  } catch (error) {
    logger.error('Failed to parse availability data', { error, availabilityRaw });
    throw new Error('Invalid availability data format');
  }
};

const unwrapNumber = (v: any): number => {
  if (v === undefined || v === null) return NaN;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseInt(v, 10);
  if (typeof v === 'object' && v.N) return parseInt(v.N, 10);
  return NaN;
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

    // Some endpoints wrap the real payload in { message, data: { ... } }
    // Normalize that so we always work with ApiParkingLotResponse or array thereof
    let normalized: ApiParkingLotResponse | ApiParkingLotResponse[];
    if ((parsed as any).data && ((parsed as any).message || (parsed as any).data)) {
      normalized = (parsed as any).data as ApiParkingLotResponse;
    } else {
      normalized = parsed as ApiParkingLotResponse | ApiParkingLotResponse[];
    }

    // If the API returned multiple records for the lot, pick the most recent by timestamp
    const candidates = pickLatestByLot(normalized);
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

    // Normalize wrapper(s) like { message, data: [...] } or { message, data: {...} }
    let normalizedAll: ApiParkingLotResponse[] | ApiParkingLotResponse;
    if ((parsed as any).data && ((parsed as any).message || (parsed as any).data)) {
      normalizedAll = (parsed as any).data;
    } else {
      normalizedAll = parsed as ApiParkingLotResponse[] | ApiParkingLotResponse;
    }

    // Ensure we only use the most recent record per lotNum
    const data = pickLatestByLot(normalizedAll);

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

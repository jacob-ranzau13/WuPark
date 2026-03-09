import { ApiParkingLotResponse, ParsedParkingLotData } from '../types';
import { logger } from '../utils/logger';
import { normalizeApiResponse, pickLatestByLot, toParsedLot } from './parkingParsers';

export class ParkingApiService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  static fromEnv(): ParkingApiService {
    const baseUrl = process.env.REACT_APP_API_URL;
    const apiKey = process.env.AVAILABILITY_API_KEY;
    if (!baseUrl) {
      const msg = 'REACT_APP_API_URL environment variable is not set.';
      logger.error(msg);
      throw new Error(msg);
    }

    if (!apiKey) {
      const msg = 'REACT_APP_API_KEY environment variable is not set.';
      logger.error(msg);
      throw new Error(msg);
    }

    return new ParkingApiService(baseUrl, apiKey);
  }

  async fetchParkingLotData(lotNum: number): Promise<ParsedParkingLotData> {
    const response = await this.fetchJson(`${this.baseUrl}/${lotNum}`);
    const latest = pickLatestByLot(normalizeApiResponse(response));
    return toParsedLot(latest[0]);
  }

  private async fetchJson(url: string): Promise<ApiParkingLotResponse[] | { data: ApiParkingLotResponse[] }> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json();
  }
}

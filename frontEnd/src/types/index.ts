export interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  lotId: number;
}

export interface ParkingLot {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  spots: ParkingSpot[];
  totalSpots: number;
  occupiedSpots: number;
  lastUpdated: Date;
}
export interface DynamoDBSpotStatus {
  M: {
    occupied: {
      BOOL: boolean;
    };
  };
}

export interface DynamoDBAvailability {
  [spotId: string]: DynamoDBSpotStatus;
}

export interface ApiParkingLotResponse {
  lotNum: string;
  timestamp: string;
  availability: string;
}

export interface ParsedParkingLotData {
  lotNum: number;
  timestamp: number;
  spots: Record<string, boolean>;
  totalSpots: number;
  occupiedSpots: number;
}

export interface ActualLot {
  lotNum: number;
  name: string;
  spots: ParkingSpot[];
  totalSpots: number;
  occupiedSpots: number;
  lastUpdated: string; 
}

export interface ParkingLotData {
  lotNumber: number;
  spotStatuses: boolean[]; 
  byteData: number[]; 
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MapLocation {
  lat: number;
  lng: number;
  zoom?: number;
}
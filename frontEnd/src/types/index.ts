export interface ParkingSpot {
  id: number;
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
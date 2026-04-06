// This is for local testing
import { ParkingLot } from '../types';

export const DEFAULT_PARKING_LOTS: ParkingLot[] = [
  {
    id: 1,
    name: 'Parking Lot 1',
    location: { lat: 37.716030356563614, lng: -97.29224684614849 },
    spots: [],
    totalSpots: 0,
    occupiedSpots: 0,
    lastUpdated: new Date()
  },
  {
    id: 2,
    name: 'Parking Lot 2',
    location: { lat: 37.716030356563614, lng: -97.29349943770109 },
    spots: [],
    totalSpots: 0,
    occupiedSpots: 0,
    lastUpdated: new Date()
  }
];


export const USE_MOCK_PARKING_DATA = process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK_DATA === 'true';


export const mergeWithMockData = (realLots: ParkingLot[]): ParkingLot[] => {
  if (!USE_MOCK_PARKING_DATA) {
    return realLots;
  }

  return DEFAULT_PARKING_LOTS.map(defaultLot => {
    const realLot = realLots.find(lot => lot.id === defaultLot.id);
    return realLot || defaultLot;
  });
};

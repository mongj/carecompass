// Types for dementia daycare centre data

export type DDCData = {
  friendlyId: string;
  buildingName: string | null;
  email: string | null;
  lat: number;
  lng: number;
  name: string;
  operatingHours: string[];
  phone: string | null;
  postalCode: string;
  streetName: string | null;
  unitNo: string | null;
  website: string | null;
  availability: string | null;
  block: string | null;
  about: string | null;
  priceNoTransport: number;
  priceWithOneWayTransport: number;
  priceWithTwoWayTransport: number;
  dropoffPickupAvailability: string[];
};

export interface DDCView extends DDCData {
  price: number;
  distanceFromHome: number;
}


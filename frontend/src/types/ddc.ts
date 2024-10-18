// Types for dementia daycare centre data
export type Review = {
  author: string;
  rating: number;
  review_text: string;
  relative_time: string;
  publish_time: string;
  author_photo: string;
  author_uri: string;
};

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
  priceNoTransport: number;
  priceWithOneWayTransport: number;
  priceWithTwoWayTransport: number;
  dropoffPickupAvailability: string[];
  place_id: string;
  display_name: string;
  rating_count: number;
  reviews: Review[];
  photos: string[];
};

export interface DDCView extends DDCData {
  price: number;
  distanceFromHome: number;
}


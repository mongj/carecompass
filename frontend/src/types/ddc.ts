// Types for dementia daycare centre data

import { Review } from "./review";

export interface DDCBase {
  id: number;
  friendlyId: string;
  name: string;
  lat: number;
  lng: number;
  postalCode: string;
  operatingHours: string[];

  phone?: string;
  email?: string;
  website?: string;
  buildingName?: string;
  block?: string;
  streetName?: string;
  unitNo?: string;
  availability?: string;
  googleMapPlaceId?: string;
}
export interface DDCDetail extends DDCBase {
  photos: string[];
  reviewCount: number;
  averageRating: number;
  reviews: Review[];
}

export interface DDCRecommendation extends DDCDetail {
  distanceFromHome?: number;
  drivingDuration?: number;
  transitDuration?: number;
}

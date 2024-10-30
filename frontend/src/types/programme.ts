import { Review } from "./ddc";

export type ProgrammeData = {
  id: string;
  name: string;
  description: string;
  content?: string;
  actionable?: string;
  reviews?: Review[];
  link?: string;
};

export type EventData = {
  id: string;
  name: string;
  description: string;
  link?: string;
};

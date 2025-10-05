import { ArtistType } from '@/interfaces/ArtistType';

export interface GetArtistsRequest {
  artistType?: ArtistType;
  startsWithLetter?: string;
  includeImage?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

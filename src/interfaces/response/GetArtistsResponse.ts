import { ArtistsResponse } from '@/interfaces/response/ArtistsResponse';
import { PaginatedResponse } from '@/interfaces/PaginatedResponse';

export type GetArtistsResponse = PaginatedResponse<ArtistsResponse>;

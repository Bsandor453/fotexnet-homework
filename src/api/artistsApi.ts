import axiosInstance from './axiosInstance';
import { GetArtistsRequest } from '@/interfaces/request/GetArtistsRequest';
import { ArtistType } from '@/interfaces/ArtistType';
import { GetArtistsResponse } from '@/interfaces/response/GetArtistsResponse';

const ARTISTS_ENDPOINT = 'api/artists';

function mapArtistType(type?: ArtistType): string | undefined {
  switch (type) {
    case 'composer':
      return 'is_composer';
    case 'performer':
      return 'is_performer';
    case 'primary':
      return 'is_primary';
    default:
      return undefined;
  }
}

export const fetchArtists = async (props: GetArtistsRequest): Promise<GetArtistsResponse> => {
  const { artistType, startsWithLetter, includeImage, search, page, per_page } = props;

  try {
    const response = await axiosInstance.get(ARTISTS_ENDPOINT, {
      params: {
        type: mapArtistType(artistType),
        letter: startsWithLetter,
        include_image: includeImage,
        search,
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
};

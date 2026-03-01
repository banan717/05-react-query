import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  if (!query) throw new Error('Empty query');

  try {
    const { data } = await axios.get<MoviesResponse>(
      `${BASE_URL}/search/movie`,
      {
        params: { query, page },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      }
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('TMDB fetch error:', err.response?.status, err.response?.data);
    } else {
      console.error('Unknown fetch error:', err);
    }
    throw err;
  }
};

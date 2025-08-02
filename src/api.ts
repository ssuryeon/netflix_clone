const API_KEY = '03850435a1f0fc2cae5c6e99ea05b304';
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(response => response.json());
}

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
  }

export interface IGetMoviesResult {
    dates: {
      maximum: string;
      minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
  }
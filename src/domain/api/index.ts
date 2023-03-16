const API_KEY = process.env.API_KEY;

const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US`;
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US`;

export const getApiPopularMovie = async <T>(page: number): Promise<T> => {
  const fetchingData = await fetch(`${url}&page=${page}`);

  return fetchingData.json();
};

export const getApiSearchMovie = async <T>(
  query: string,
  page: number
): Promise<T> => {
  const fetchingData = await fetch(
    `${searchUrl}&query=${query}&page=${page}&include_adult=false`
  );

  return fetchingData.json();
};

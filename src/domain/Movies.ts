import {
  getApiDetailMovie,
  getApiPopularMovie,
  getApiSearchMovie,
} from './api';
import { MovieItemType, DetailModalType } from '../type/movie';

import Observable from './Observable';

class Movies extends Observable {
  private popularPage = 1;
  private searchPage = 1;
  private isSearched = false;
  private isEnd = false;
  private query = '';

  constructor() {
    super();

    this.popularMovies();
  }

  getIsEnd() {
    return this.isEnd;
  }

  getTitle() {
    return this.isSearched
      ? `"${this.query}" 검색 결과`
      : '지금 인기 있는 영화';
  }

  getIsSearched() {
    return this.isSearched;
  }

  getQuery() {
    return this.query;
  }

  async popularMovies() {
    this.notify('loading');

    const { movieList, status } = await getApiPopularMovie(this.popularPage);
    const popularMovies = movieList;

    if (!this.isConnected(status)) {
      this.notify('unloading');
      return;
    }

    const refineMovies = popularMovies?.results.map(
      ({ id, poster_path, title, vote_average }: MovieItemType) => {
        return { id, poster_path, title, vote_average };
      }
    );

    const totalPage = popularMovies?.total_pages;
    if (!totalPage) return;
    this.isEnd = totalPage === this.popularPage;

    this.popularPage++;
    this.isSearched = false;
    this.notify('movies', refineMovies);
  }

  async searchMovies(query: string, isFromSearchButton: boolean = false) {
    this.notify('loading');

    if (this.query !== query || isFromSearchButton) this.searchPage = 1;
    this.query = query;

    const { movieList, status } = await getApiSearchMovie(
      query,
      this.searchPage
    );
    const searchMovies = movieList;

    if (!this.isConnected(status)) {
      this.notify('unloading');
      return;
    }
    if (searchMovies.results.length === 0) {
      this.notify('noSearched');
      this.notify('unloading');
      return;
    }

    const refineMovies = searchMovies?.results?.map(
      ({ id, poster_path, title, vote_average }: MovieItemType) => {
        return { id, poster_path, title, vote_average };
      }
    );

    const totalPage = searchMovies?.total_pages;
    if (!totalPage) return;
    this.isEnd = totalPage === this.searchPage;

    this.searchPage++;
    this.isSearched = true;
    this.notify('movies', refineMovies);
  }

  async detailMovies(id: number) {
    const { movieItem, status } = await getApiDetailMovie(id);

    if (!this.isConnected(status)) {
      this.notify('unloading');
      return;
    }

    const detailMovie = {
      id: movieItem.id,
      title: movieItem.title,
      poster_path: movieItem.poster_path,
      genres: movieItem.genres.map((genre: any) => genre.name).join(', '),
      vote_average: movieItem.vote_average,
      overview: movieItem.overview,
    };

    this.notify('detail', detailMovie);
  }

  isConnected(status: number) {
    if (status >= 500) {
      this.notify('error');
      return false;
    } else if (status >= 400) {
      this.notify('error');
      return false;
    }
    return true;
  }
}

const movies = new Movies();
export default movies;

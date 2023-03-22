import { $ } from '../utils/domHelper';
import movies from '../domain/Movies';

export default class SeeMore extends HTMLElement {
  private $target;

  constructor($target: HTMLElement) {
    super();

    this.$target = $target;

    movies.subscribe('movies', this.showButton.bind(this));
  }

  setEvent() {
    $('.btn').addEventListener('click', () => {
      this.showMoreMovies();
    });
  }

  template() {
    return `<button class="btn primary full-width">더 보기</button>`;
  }

  render() {
    this.$target.insertAdjacentHTML('beforeend', this.template());

    return this;
  }

  showMoreMovies() {
    if (movies.getIsSearched()) movies.searchMovies(movies.getQuery());
    else movies.setMovies();
  }

  showButton() {
    if (movies.getIsEnd()) $('button.btn').classList.add('button--hidden');
    else $('button.btn').classList.remove('button--hidden');
  }
}

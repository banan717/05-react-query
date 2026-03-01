import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({
  movies,
  onSelect,
}: MovieGridProps) {
  return (
    <div className={css.grid}>
      {movies.map((movie) => (
        <div
          key={movie.id}
          className={css.card}
          onClick={() => onSelect(movie)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
}

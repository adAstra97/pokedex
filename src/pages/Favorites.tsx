import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { PokemonCard } from '../components/PokemonCard';

const Favorites: React.FC = () => {
  const favorites = useSelector((state: RootState) => state.pokemon.favorites);

  return (
    <div className="wrapper">
      <div className="favorites">
        <h1>Your Favorite Pokemons</h1>
        {favorites.length === 0 ? (
          <p className="message">No favorites yet.</p>
        ) : (
          <div className="favorites__list">
            {favorites.map((item, index) => (
              <PokemonCard item={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

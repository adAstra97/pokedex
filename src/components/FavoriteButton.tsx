import React from 'react';
import type { IPokemonCardData } from '../types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { toggleFavorite } from '../redux/slices/pokemonSlice';

interface IFavoriteButtonProps {
  item: IPokemonCardData;
}

export const FavoriteButton: React.FC<IFavoriteButtonProps> = React.memo(
  ({ item }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { favorites } = useSelector((state: RootState) => state.pokemon);

    const handleAddToFavorites = (
      event: React.MouseEvent<HTMLButtonElement>,
      pokemon: IPokemonCardData
    ): void => {
      event.stopPropagation();
      event.preventDefault();
      dispatch(toggleFavorite(pokemon));
    };

    const isFavorite = favorites.some(fav => fav.name === item.name);

    return (
      <button
        className="favorite-btn"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          handleAddToFavorites(event, item)
        }>
        <img src={isFavorite ? '/fill.svg' : '/empty.svg'} alt="favorite"></img>
      </button>
    );
  }
);

FavoriteButton.displayName = 'Favorite Button';

import React from 'react';
import { Link } from 'react-router-dom';
import { FavoriteButton } from './FavoriteButton';
import type { IPokemonCardData } from '../types/interfaces';

interface IPokemonCardProps {
  item: IPokemonCardData;
}

export const PokemonCard: React.FC<IPokemonCardProps> = React.memo(
  ({ item }) => {
    return (
      <Link to={`/pokemon/${item.name}`} className="pokemons__item">
        <FavoriteButton item={item} />
        <img src={item.image} alt={item.name} />
        <span className="pokemons__name">
          {item.name[0].toUpperCase() + item.name.slice(1)}
        </span>
        <div className="pokemons__types">
          {item.types.map((type: string, idx: number) => (
            <span key={idx} className={`type ${type}`}>
              {type}
            </span>
          ))}
        </div>
      </Link>
    );
  }
);

PokemonCard.displayName = 'Pokemon Card';

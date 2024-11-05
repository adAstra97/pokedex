import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchPokemons } from '../redux/slices/pokemonSlice';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.pokemon);

  useEffect(() => {
    dispatch(fetchPokemons(0));
  }, [dispatch]);

  return (
    <div className="wrapper">
      <div className="pokemons">
        <h1>Pokemons</h1>
        <div className="pokemons__list">
          {list.map((item, index) => (
            <div key={index} className="pokemons__item">
              <img src={item.image} alt={item.name} />
              <span className="pokemons__name">{item.name}</span>
              <div className="pokemons__types">
                {item.types.map((type: string, idx: number) => (
                  <span key={idx} className={`type ${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

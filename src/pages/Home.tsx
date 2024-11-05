import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchPokemons } from '../redux/slices/pokemonSlice';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, offset, loading, error } = useSelector(
    (state: RootState) => state.pokemon
  );

  const [hasMoreData, setHasMoreData] = useState(true);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 60 &&
      !loading &&
      hasMoreData
    ) {
      dispatch(fetchPokemons(offset));
    }
  }, [offset, loading, hasMoreData, dispatch]);

  useEffect(() => {
    dispatch(fetchPokemons(0));
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!loading && list.length > 0) {
      setHasMoreData(list.length % 50 === 0);
    }
  }, [loading, list]);

  const handleToPokemonDetails = (name: string): void => {
    navigate(`/pokemon/${name}`);
  };

  return (
    <div className="wrapper">
      <div className="pokemons">
        <h1>Pokemons</h1>
        <div className="pokemons__list">
          {list.map((item, index) => (
            <button
              key={index}
              className="pokemons__item"
              onClick={() => handleToPokemonDetails(item.name)}>
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
            </button>
          ))}
          {error && <p>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

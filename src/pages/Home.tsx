import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchPokemons } from '../redux/slices/pokemonSlice';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, offset, loading, error } = useSelector(
    (state: RootState) => state.pokemon
  );

  const [hasMoreData, setHasMoreData] = useState(true);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 20 &&
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
      setHasMoreData(list.length % 20 === 0);
    }
  }, [loading, list]);

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
          {error && <p>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

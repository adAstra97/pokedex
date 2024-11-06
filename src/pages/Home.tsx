import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllPokemons,
  fetchPokemonDetails,
  resetOffset
} from '../redux/slices/pokemonSlice';
import type { IPokemonItem } from '../types/interfaces';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, offset, loading, error, allPokemonUrls } = useSelector(
    (state: RootState) => state.pokemon
  );

  const [filteredUrls, setFilteredUrls] = useState<IPokemonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 60 &&
      !loading &&
      filteredUrls.length > 0
    ) {
      dispatch(fetchPokemonDetails({ offset, urls: filteredUrls }));
    }
  }, [offset, loading, filteredUrls, dispatch]);

  useEffect(() => {
    dispatch(fetchAllPokemons());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredUrls(allPokemonUrls);
      dispatch(resetOffset());
    } else {
      dispatch(resetOffset());
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUrls(allPokemonUrls);
    } else {
      const filtered = allPokemonUrls.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUrls(filtered);
    }
  }, [searchQuery, allPokemonUrls]);

  useEffect(() => {
    if (filteredUrls.length > 0 && offset === 0) {
      dispatch(fetchPokemonDetails({ offset: 0, urls: filteredUrls }));
    }
  }, [filteredUrls, offset, dispatch]);

  const filteredList = list.filter(pokemon =>
    filteredUrls.some(filtered => filtered.name === pokemon.name)
  );

  const handleToPokemonDetails = (name: string): void => {
    navigate(`/pokemon/${name}`);
  };

  return (
    <div className="wrapper">
      <div className="pokemons">
        <h1>Pokemons</h1>

        <input
          type="text"
          placeholder="Search Pokemon..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <div className="pokemons__list">
          {filteredList.map((item, index) => (
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

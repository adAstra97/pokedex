import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import {
  fetchAllPokemons,
  fetchPokemonDetails,
  fetchPokemonTypes,
  resetOffset
} from '../redux/slices/pokemonSlice';
import type { IPokemonUrl } from '../types/interfaces';
import axios from 'axios';
import { PokemonCard } from '../components/PokemonCard';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, offset, loading, error, allPokemonUrls, types } = useSelector(
    (state: RootState) => state.pokemon
  );

  const [filteredUrls, setFilteredUrls] = useState<IPokemonUrl[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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
    dispatch(fetchPokemonTypes());
    dispatch(fetchAllPokemons()).then(() => {
      setTimeout(() => {
        setIsFirstLoad(false);
      }, 1000);
    });
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const query = event.target.value;
    setIsFiltering(true);
    setSearchQuery(query);

    if (query === '') {
      setFilteredUrls(allPokemonUrls);
    }

    setSelectedType(null);
    dispatch(resetOffset());
    setTimeout(() => {
      setIsFiltering(false);
    }, 1000);
  };

  const handleTypeFilter = async (typeUrl: string) => {
    setSelectedType(typeUrl);
    setFilteredUrls([]);
    setIsFiltering(true);

    const response = await axios.get(typeUrl);
    const pokemonsWithType = response.data.pokemon.map(
      (p: { pokemon: IPokemonUrl }) => p.pokemon
    );

    setFilteredUrls(pokemonsWithType);
    dispatch(resetOffset());
    setTimeout(() => {
      setIsFiltering(false);
    }, 1000);
  };

  const filteredList = list.filter(pokemon =>
    filteredUrls.some(filtered => filtered.name === pokemon.name)
  );

  return (
    <div className="wrapper">
      <div className="pokemons">
        <h1>Pokemons</h1>

        <input
          className="pokemons__search"
          type="text"
          placeholder="Search Pokemon..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <div className="types">
          {types.map(type => (
            <button
              className={selectedType === type.url ? 'active' : ''}
              key={type.name}
              onClick={() => handleTypeFilter(type.url)}>
              {type.name[0].toUpperCase() + type.name.slice(1)}
            </button>
          ))}
        </div>

        <div className="pokemons__list">
          {isFiltering || isFirstLoad ? (
            <p className="message">Loading...</p>
          ) : filteredList.length > 0 ? (
            filteredList.map((item, index) => (
              <PokemonCard item={item} key={index} />
            ))
          ) : (
            <p className="message">No pokemons found</p>
          )}
          {error && <p className="message">Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

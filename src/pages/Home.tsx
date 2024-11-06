import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllPokemons,
  fetchPokemonDetails,
  fetchPokemonTypes,
  resetOffset
} from '../redux/slices/pokemonSlice';
import type { IPokemonUrl } from '../types/interfaces';
import axios from 'axios';

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
    dispatch(fetchPokemonTypes());
    dispatch(fetchAllPokemons()).then(() => {
      setTimeout(() => {
        setIsFirstLoad(false);
      }, 500);
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
    }, 500);
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
    }, 500);
  };

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

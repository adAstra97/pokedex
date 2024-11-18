import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { IPokemon, IPokemonUrl } from '../types/interfaces';

interface IAbilityDescription {
  abilityName: string;
  description: string;
}

interface IFlavorTextEntry {
  flavor_text: string;
  language: IPokemonUrl;
  version_group: IPokemonUrl;
}

export const Details: React.FC = React.memo(() => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<IPokemon | null>(null);
  const [abilityDescriptions, setAbilityDescriptions] = useState<
    IAbilityDescription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        setPokemon(response.data);

        const abilitiesWithDescriptions: IAbilityDescription[] = [];

        for (const ability of response.data.abilities) {
          try {
            const abilityResponse = await axios.get(ability.ability.url);
            const englishDescription =
              abilityResponse.data.flavor_text_entries.find(
                (entry: IFlavorTextEntry) => entry.language.name === 'en'
              );

            if (englishDescription) {
              abilitiesWithDescriptions.push({
                abilityName: ability.ability.name,
                description: englishDescription.flavor_text
              });
            }
          } catch (err) {
            console.error('Failed to fetch ability description', err);
          }
        }
        setLoading(false);
        setAbilityDescriptions(abilitiesWithDescriptions);
      } catch {
        setError('Failed to load Pokemon data');
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [name]);

  if (loading) {
    return <p className="message">Loading...</p>;
  }

  if (error) {
    return <p className="message">{error}</p>;
  }

  if (!pokemon) {
    return null;
  }

  const pokemonImage = pokemon.sprites.front_default
    ? pokemon.sprites.front_default
    : '/no-image.PNG';

  const weightInKg = pokemon.weight / 10;
  const heightInM = pokemon.height / 10;

  return (
    <div className="wrapper">
      <div className="details">
        <h1>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h1>
        <div className="details__content">
          <div className="details__left">
            <img src={pokemonImage} alt={pokemon.name} />
          </div>
          <div className="details__right">
            <h3>Size:</h3>
            <span>Weight: {weightInKg} kg</span>
            <span>Height: {heightInM} m</span>
            <h3>Base Stats:</h3>
            <ul>
              {pokemon.stats.map((stat, index) => (
                <li key={index}>
                  <strong>{stat.stat.name}:</strong> {stat.base_stat}
                </li>
              ))}
            </ul>
          </div>
          <div className="details__bottom">
            <h3>Abilities:</h3>
            <ul>
              {pokemon.abilities.map((ability, index) => (
                <li key={index}>
                  <strong>{ability.ability.name}</strong>
                  {ability.is_hidden && (
                    <span className="hidden-ability"> (Hidden)</span>
                  )}
                  <p>
                    {
                      abilityDescriptions.find(
                        desc => desc.abilityName === ability.ability.name
                      )?.description
                    }
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

Details.displayName = 'Details';

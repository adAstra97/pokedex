import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  IPokemonCardData,
  IPokemonUrl,
  IPokemonType
} from '../../types/interfaces';

interface IPokemonState {
  allPokemonUrls: IPokemonUrl[];
  list: IPokemonCardData[];
  loading: boolean;
  error: string | null;
  offset: number;
  types: IPokemonUrl[];
}

const initialState: IPokemonState = {
  allPokemonUrls: [],
  list: [],
  loading: false,
  error: null,
  offset: 0,
  types: []
};

export const fetchAllPokemons = createAsyncThunk<IPokemonUrl[]>(
  'pokemon/fetchAllPokemonUrls',
  async () => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
    );
    return response.data.results.map((item: IPokemonUrl) => ({
      name: item.name,
      url: item.url
    }));
  }
);

export const fetchPokemonDetails = createAsyncThunk<
  IPokemonCardData[],
  { offset: number; urls: IPokemonUrl[] }
>('pokemon/fetchPokemonDetails', async ({ offset, urls }) => {
  const pokemonDetails = await Promise.all(
    urls.slice(offset, offset + 50).map(async ({ name, url }) => {
      const details = await axios.get(url);
      const pokemonCardData: IPokemonCardData = {
        id: details.data.id,
        name,
        image: details.data.sprites.front_default,
        types: details.data.types.map((type: IPokemonType) => type.type.name)
      };
      return pokemonCardData;
    })
  );
  return pokemonDetails;
});

export const fetchPokemonTypes = createAsyncThunk<
  IPokemonUrl[],
  void,
  { rejectValue: string }
>('pokemon/fetchPokemonTypes', async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/type/?limit=100');
  return response.data.results;
});

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    resetOffset: state => {
      state.offset = 0;
      state.list = [];
    }
  },
  extraReducers: builder => {
    builder
      // all pokemons
      .addCase(fetchAllPokemons.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllPokemons.fulfilled, (state, action) => {
        state.allPokemonUrls = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPokemons.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch pokemon URLs';
        state.loading = false;
      })
      // detailed information
      .addCase(fetchPokemonDetails.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action) => {
        const uniquePokemons = action.payload.filter(
          pokemon =>
            !state.list.some(
              existingPokemon => existingPokemon.name === pokemon.name
            )
        );
        state.list.push(...uniquePokemons);
        state.offset += uniquePokemons.length;
        state.loading = false;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch pokemon details';
        state.loading = false;
      })
      // types
      .addCase(fetchPokemonTypes.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPokemonTypes.fulfilled, (state, action) => {
        state.types = action.payload;
        state.loading = false;
      })
      .addCase(fetchPokemonTypes.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch pokemon types';
        state.loading = false;
      });
  }
});

export const { resetOffset } = pokemonSlice.actions;
export default pokemonSlice.reducer;

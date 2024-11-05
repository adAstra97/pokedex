import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {
  IPokemonCardData,
  IPokemonItem,
  IPokemonType
} from '../../types/interfaces';

interface IPokemonState {
  list: IPokemonCardData[];
  loading: boolean;
  error: string | null;
}

const initialState: IPokemonState = {
  list: [],
  loading: false,
  error: null
};

export const fetchPokemons = createAsyncThunk<IPokemonCardData[], number>(
  'pokemon/fetchPokemons',
  async (offset: number) => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
    );
    const pokemonDetails = await Promise.all(
      response.data.results.map(async (item: IPokemonItem) => {
        const details = await axios.get(item.url);
        const pokemonCardData: IPokemonCardData = {
          name: item.name,
          image: details.data.sprites.front_default,
          types: details.data.types.map((type: IPokemonType) => type.type.name)
        };
        return pokemonCardData;
      })
    );
    return pokemonDetails;
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPokemons.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload];
        state.loading = false;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch pokemons';
        state.loading = false;
      });
  }
});

export default pokemonSlice.reducer;

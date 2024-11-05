import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface IPokemon {
  name: string;
  url: string;
}

interface IPokemonState {
  list: IPokemon[];
  loading: boolean;
  error: string | null;
}

const initialState: IPokemonState = {
  list: [],
  loading: false,
  error: null
};

export const fetchPokemons = createAsyncThunk(
  'pokemon/fetchPokemons',
  async (offset: number) => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
    );
    return response.data.results;
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

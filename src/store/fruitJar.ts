import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFruits, FruitApiError } from '../api/clientApi';
import { Fruit, JarItem } from '../util/types';

interface ApiErrorState {
  message: string;
  status?: number;
  statusText?: string;
}

export const fetchFruits = createAsyncThunk(
  'fruitJar/fetchFruits',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFruits();
      return data;
    } catch (error) {
      if (error instanceof FruitApiError) {
        return rejectWithValue({
          message: error.message,
          status: error.status,
          statusText: error.statusText,
        } as ApiErrorState);
      }

      return rejectWithValue({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: 0,
        statusText: 'Unknown Error',
      } as ApiErrorState);
    }
  }
);

export const fruitJarSlice = createSlice({
  name: 'fruitJar',
  initialState: {
    fruits: [] as Fruit[],
    jar: [] as JarItem[],
    loading: false,
    error: null as ApiErrorState | null,
  },
  reducers: {
    addToJar: (state, action: PayloadAction<Fruit[]>) => {
      const fruits = action.payload; // Array of fruits
      fruits.forEach((fruit: Fruit) => {
        const existingFruit = state.jar.find(
          item => item.fruit.id === fruit.id
        );

        if (existingFruit) {
          existingFruit.count += 1;
        } else {
          state.jar.push({ fruit, count: 1 });
        }
      });
    },
    removeOneFromJar: (state, action: PayloadAction<Fruit>) => {
      const fruit = action.payload;
      const existingFruit = state.jar.find(item => item.fruit.id === fruit.id);

      if (existingFruit) {
        if (existingFruit.count > 1) {
          existingFruit.count -= 1;
        } else {
          // Remove the item completely if count reaches 0
          state.jar = state.jar.filter(item => item.fruit.id !== fruit.id);
        }
      }
    },
    removeFromJar: (state, action: PayloadAction<Fruit>) => {
      state.jar = state.jar.filter(item => item.fruit.id !== action.payload.id);
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFruits.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFruits.fulfilled, (state, action) => {
        state.fruits = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFruits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiErrorState;
      });
  },
});

export const { addToJar, removeOneFromJar, removeFromJar, clearError } =
  fruitJarSlice.actions;

export default fruitJarSlice.reducer;

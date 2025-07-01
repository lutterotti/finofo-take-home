import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFruits } from '../api/clientApi';
import { Fruit, JarItem } from '../util/types';

export const fetchFruits = createAsyncThunk(
  'fruitJar/fetchFruits',
  async () => {
    const data = await getFruits();
    return data;
  }
);

export const fruitJarSlice = createSlice({
  name: 'fruitJar',
  initialState: {
    fruits: [] as Fruit[],
    jar: [] as JarItem[],
    loading: false,
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFruits.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFruits.fulfilled, (state, action) => {
        state.fruits = action.payload;
        state.loading = false;
      })
      .addCase(fetchFruits.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { addToJar, removeOneFromJar, removeFromJar } =
  fruitJarSlice.actions;

export default fruitJarSlice.reducer;

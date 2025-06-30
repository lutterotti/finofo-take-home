import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFruits } from '../api/clientApi';

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
    fruits: [] as any[],
    jar: [] as { fruit: any; count: number }[],
    loading: false,
    },
    reducers: {
        addToJar: (state, action) => {
            const fruit = action.payload;
            const existingFruit = state.jar.find(item => item.fruit.id === fruit.id);
            
            if (existingFruit) {
                existingFruit.count += 1;
            } else {
                state.jar.push({ fruit, count: 1 });
            }
        },
        removeFromJar: (state, action) => {
            state.jar = state.jar.filter(item => item.fruit.id !== action.payload.id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFruits.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFruits.fulfilled, (state, action) => {
                console.log('Fruits fetched successfully:', action.payload);
                state.fruits = action.payload;
                state.loading = false;
            })
            .addCase(fetchFruits.rejected, (state, action) => {
                console.error('Failed to fetch fruits:', action.error.message);
                state.loading = false;
            });
    }
});

export const { addToJar, removeFromJar } = fruitJarSlice.actions;

export default fruitJarSlice.reducer;

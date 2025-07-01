import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFruits } from '../api/clientApi';
import { Fruit } from '../util/types';

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
    jar: [] as { fruit: Fruit; count: number }[],
    loading: false,
    },
    reducers: {
        addToJar: (state, action: PayloadAction<Fruit[]>) => {
            const fruits = action.payload; // Array of fruits
            console.log('Adding fruits to jar:', fruits);
            fruits.forEach((fruit: Fruit) => {
                const existingFruit = state.jar.find(item => item.fruit.id === fruit.id);
                
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

export const { addToJar, removeOneFromJar, removeFromJar } = fruitJarSlice.actions;

export default fruitJarSlice.reducer;

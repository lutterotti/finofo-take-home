import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import fruitJarSlice  from './fruitJar';

export const store = configureStore({
    reducer: {
        // Add your slices here
        fruitJar: fruitJarSlice, // Uncomment and import your reducer
    },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
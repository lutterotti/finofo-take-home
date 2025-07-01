import { configureStore } from '@reduxjs/toolkit';
import { getFruits } from '../../api/clientApi';
import { Fruit } from '../../util/types';
import fruitJarReducer, {
  addToJar,
  removeOneFromJar,
  removeFromJar,
  fetchFruits,
} from '../fruitJar';

// Mock the API
jest.mock('../../api/clientApi', () => ({
  getFruits: jest.fn(),
}));

const mockedGetFruits = getFruits as jest.MockedFunction<typeof getFruits>;

// Sample test data
const mockFruit1: Fruit = {
  id: '1',
  name: 'Apple',
  family: 'Rosaceae',
  category: 'Pome',
  order: 'Rosales',
  genus: 'Malus',
  price: 1.2,
  nutritions: {
    calories: 52,
    fat: 0.4,
    sugar: 10.3,
    carbohydrates: 11.4,
    protein: 0.3,
    fiber: 2.4,
  },
};

const mockFruit2: Fruit = {
  id: '2',
  name: 'Banana',
  family: 'Musaceae',
  category: 'Berry',
  order: 'Zingiberales',
  genus: 'Musa',
  price: 0.8,
  nutritions: {
    calories: 89,
    fat: 0.3,
    sugar: 12.2,
    carbohydrates: 22.8,
    protein: 1.1,
    fiber: 2.6,
  },
};

const mockFruit3: Fruit = {
  id: '3',
  name: 'Orange',
  family: 'Rutaceae',
  category: 'Citrus',
  order: 'Sapindales',
  genus: 'Citrus',
  price: 1.0,
  nutritions: {
    calories: 47,
    fat: 0.1,
    sugar: 9.4,
    carbohydrates: 11.8,
    protein: 0.9,
    fiber: 2.4,
  },
};

describe('fruitJar slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        fruitJar: fruitJarReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = (store.getState() as any).fruitJar;
      expect(state).toEqual({
        fruits: [],
        jar: [],
        loading: false,
      });
    });
  });

  describe('addToJar action', () => {
    it('should add a single fruit to empty jar', () => {
      store.dispatch(addToJar([mockFruit1]));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(1);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 1,
      });
    });

    it('should add multiple fruits to jar', () => {
      store.dispatch(addToJar([mockFruit1, mockFruit2]));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(2);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 1,
      });
      expect(state.jar[1]).toEqual({
        fruit: mockFruit2,
        count: 1,
      });
    });

    it('should increment count when adding existing fruit', () => {
      // Add fruit first time
      store.dispatch(addToJar([mockFruit1]));
      // Add same fruit again
      store.dispatch(addToJar([mockFruit1]));

      const state = (store.getState() as any).fruitJar;
      expect(state.jar).toHaveLength(1);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 2,
      });
    });

    it('should handle adding multiple of the same fruit in one action', () => {
      store.dispatch(addToJar([mockFruit1, mockFruit1, mockFruit2]));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(2);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 2,
      });
      expect(state.jar[1]).toEqual({
        fruit: mockFruit2,
        count: 1,
      });
    });
  });

  describe('removeOneFromJar action', () => {
    beforeEach(() => {
      // Set up initial state with fruits in jar
      store.dispatch(addToJar([mockFruit1, mockFruit1, mockFruit2]));
    });

    it('should decrement count when removing one fruit', () => {
      store.dispatch(removeOneFromJar(mockFruit1));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(2);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 1,
      });
    });

    it('should remove fruit completely when count reaches 0', () => {
      // Remove the single banana
      store.dispatch(removeOneFromJar(mockFruit2));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(1);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 2,
      });
    });

    it('should do nothing when trying to remove non-existent fruit', () => {
      const initialState = (store.getState() as any).fruitJar;
      store.dispatch(removeOneFromJar(mockFruit3));
      const finalState = (store.getState() as any).fruitJar;

      expect(finalState).toEqual(initialState);
    });
  });

  describe('removeFromJar action', () => {
    beforeEach(() => {
      // Set up initial state with fruits in jar
      store.dispatch(addToJar([mockFruit1, mockFruit1, mockFruit2]));
    });

    it('should remove fruit completely regardless of count', () => {
      store.dispatch(removeFromJar(mockFruit1));
      const state = (store.getState() as any).fruitJar;

      expect(state.jar).toHaveLength(1);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit2,
        count: 1,
      });
    });

    it('should do nothing when trying to remove non-existent fruit', () => {
      const initialState = (store.getState() as any).fruitJar;
      store.dispatch(removeFromJar(mockFruit3));
      const finalState = (store.getState() as any).fruitJar;

      expect(finalState).toEqual(initialState);
    });
  });

  describe('fetchFruits async thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle fetchFruits.pending', () => {
      const action = { type: fetchFruits.pending.type };
      const state = fruitJarReducer(
        { fruits: [], jar: [], loading: false },
        action
      );

      expect(state.loading).toBe(true);
    });

    it('should handle fetchFruits.fulfilled', () => {
      const mockFruits = [mockFruit1, mockFruit2, mockFruit3];
      const action = {
        type: fetchFruits.fulfilled.type,
        payload: mockFruits,
      };
      const state = fruitJarReducer(
        { fruits: [], jar: [], loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.fruits).toEqual(mockFruits);
    });

    it('should handle fetchFruits.rejected', () => {
      const action = {
        type: fetchFruits.rejected.type,
        error: { message: 'Failed to fetch' },
      };
      const state = fruitJarReducer(
        { fruits: [], jar: [], loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.fruits).toEqual([]);
    });

    it('should successfully fetch fruits from API', async () => {
      const mockFruits = [mockFruit1, mockFruit2];
      mockedGetFruits.mockResolvedValue(mockFruits);

      const result = await store.dispatch(fetchFruits() as any);
      const state = (store.getState() as any).fruitJar;

      expect(mockedGetFruits).toHaveBeenCalledTimes(1);
      expect(result.type).toBe('fruitJar/fetchFruits/fulfilled');
      expect(state.fruits).toEqual(mockFruits);
      expect(state.loading).toBe(false);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      mockedGetFruits.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(fetchFruits() as any);
      const state = (store.getState() as any).fruitJar;

      expect(result.type).toBe('fruitJar/fetchFruits/rejected');
      expect(state.loading).toBe(false);
      expect(state.fruits).toEqual([]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle mixed operations correctly', () => {
      // Add various fruits
      store.dispatch(addToJar([mockFruit1, mockFruit2, mockFruit1]));

      // Remove one apple
      store.dispatch(removeOneFromJar(mockFruit1));

      // Remove banana completely
      store.dispatch(removeFromJar(mockFruit2));

      // Add orange
      store.dispatch(addToJar([mockFruit3]));

      const state = (store.getState() as any).fruitJar;
      expect(state.jar).toHaveLength(2);
      expect(state.jar[0]).toEqual({
        fruit: mockFruit1,
        count: 1,
      });
      expect(state.jar[1]).toEqual({
        fruit: mockFruit3,
        count: 1,
      });
    });

    it('should maintain fruit identity correctly', () => {
      const fruitCopy = { ...mockFruit1 };
      store.dispatch(addToJar([mockFruit1]));
      store.dispatch(addToJar([fruitCopy]));

      const state = (store.getState() as any).fruitJar;
      expect(state.jar).toHaveLength(1);
      expect(state.jar[0].count).toBe(2);
    });
  });
});

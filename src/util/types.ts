export type Fruit = {
  id: string;
  name: string;
  family: string;
  category: string;
  order: string;
  genus: string;
  price: number;
  nutritions: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    fiber: number;
    sugar: number;
  };
};

export enum GroupByOptions {
  NONE = 'none',
  FAMILY = 'family',
  ORDER = 'order',
  GENUS = 'genus',
}

export type Dish = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = Dish & {
  quantity: number;
};
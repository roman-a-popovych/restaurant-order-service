import { CartItem, Dish } from "@/types/cart";

const CART_KEY = "restaurant_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const cart = localStorage.getItem(CART_KEY);

  if (!cart) {
    return [];
  }

  try {
    return JSON.parse(cart);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(dish: Dish) {
  const cart = getCart();

  const existingItem = cart.find((item) => item.id === dish.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...dish,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export type { CartItem };
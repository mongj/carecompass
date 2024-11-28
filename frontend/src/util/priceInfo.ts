import { Nullable } from "@/types/util";

const CURRENCY_SYMBOL = "$";

export function formatPrice(price: number) {
  return `${CURRENCY_SYMBOL}${price}`;
}

export function formatPriceRange(maxPrice: number, minPrice: Nullable<number>) {
  if (minPrice === null) {
    return `${CURRENCY_SYMBOL}${maxPrice}`;
  }
  return `${CURRENCY_SYMBOL}${minPrice} - ${maxPrice}`;
}

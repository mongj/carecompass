import { Nullable } from "@/types/util";

const CURRENCY_SYMBOL = "$";

export function formatPrice(price: number) {
  return `${CURRENCY_SYMBOL}${price}`;
}

export function formatPriceRange(minPrice: number, maxPrice: Nullable<number>) {
  if (maxPrice === null) {
    return `${CURRENCY_SYMBOL}${minPrice}`;
  }
  return `${CURRENCY_SYMBOL}${minPrice} - ${maxPrice}`;
}

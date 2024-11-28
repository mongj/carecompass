import { Nullable } from "@/types/util";

const CURRENCY_SYMBOL = "$";

export function formatPrice(price: number) {
  return `${CURRENCY_SYMBOL}${price}`;
}

export function formatPriceRange(
  minPrice: Nullable<number>,
  maxPrice: Nullable<number>,
) {
  if (minPrice === null && maxPrice === null) {
    return "Price not available";
  }

  if (minPrice === null) {
    return `${CURRENCY_SYMBOL}${maxPrice}`;
  }

  if (maxPrice === null) {
    return `${CURRENCY_SYMBOL}${minPrice}`;
  }

  if (minPrice === maxPrice) {
    return `${CURRENCY_SYMBOL}${minPrice}`;
  }

  return `${CURRENCY_SYMBOL}${minPrice} - ${maxPrice}`;
}

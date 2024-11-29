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
    return `${CURRENCY_SYMBOL}${maxPrice!.toFixed(2)}`;
  }

  if (maxPrice === null) {
    return `${CURRENCY_SYMBOL}${minPrice.toFixed(2)}`;
  }

  if (minPrice === maxPrice) {
    return `${CURRENCY_SYMBOL}${minPrice.toFixed(2)}`;
  }

  return `${CURRENCY_SYMBOL}${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
}

import chocolateFallback from "../assets/fallback/chocolate.png";
import drinkFallback from "../assets/fallback/drink.png";
import snackFallback from "../assets/fallback/snack.png";

const FALLBACK_IMAGES = {
  CHOCOLATE: chocolateFallback,
  DRINK: drinkFallback,
  SNACK: snackFallback,
};

export const getProductFallbackImage = (categoryCode) =>
  FALLBACK_IMAGES[String(categoryCode ?? "").trim().toUpperCase()] ?? null;

export const getProductImageUrl = (imageUrl) =>
  typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : null;

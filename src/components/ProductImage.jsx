import { useState } from "react";
import {
  getProductFallbackImage,
  getProductImageUrl,
} from "../utils/productImage";

export default function ProductImage({ product, alt, fallback = null }) {
  const [failedSource, setFailedSource] = useState(null);
  const productImage = getProductImageUrl(product?.imageUrl);
  const categoryFallback = getProductFallbackImage(product?.categoryCode);
  const source =
    productImage && failedSource !== productImage
      ? productImage
      : categoryFallback && failedSource !== categoryFallback
        ? categoryFallback
        : null;

  if (!source) return fallback;

  return (
    <img
      src={source}
      alt={alt ?? product?.productName ?? ""}
      onError={() => setFailedSource(source)}
    />
  );
}

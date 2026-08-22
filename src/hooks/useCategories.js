import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";
import {
  DEFAULT_CATEGORIES,
  selectSupportedCategories,
} from "../data/categories";

export default function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const controller = new AbortController();
    getCategories({ signal: controller.signal })
      .then((items) => {
        const supported = selectSupportedCategories(items);
        if (supported.length) setCategories(supported);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCategories(DEFAULT_CATEGORIES);
      });

    return () => controller.abort();
  }, []);

  return categories;
}

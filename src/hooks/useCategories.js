import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return categories;
}

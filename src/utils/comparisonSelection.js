const STORAGE_KEY = "zeroPickComparisonSelection";
const MAX_SELECTION = 3;

export function getComparisonSelection() {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.slice(0, MAX_SELECTION) : [];
  } catch {
    return [];
  }
}

export function saveComparisonSelection(productIds) {
  const selection = [...new Set(productIds)].slice(0, MAX_SELECTION);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  return selection;
}

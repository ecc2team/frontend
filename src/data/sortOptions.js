export const SORT_OPTIONS = [
  { value: "recommended", label: "추천순" },
  { value: "latest", label: "최신순" },
  { value: "name", label: "가나다순" },
  { value: "popular", label: "인기순" },
  { value: "views", label: "조회순" },
];

export const SORT_VALUES = new Set(SORT_OPTIONS.map(({ value }) => value));

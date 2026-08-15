import { formatKstTime } from "../utils/dateTime";

const DAILY_RECORDS_API_URL = import.meta.env.VITE_DAILY_RECORDS_API_URL;

const EMPTY_NUTRIENTS = [
  { key: "sugar", label: "당류", percentage: 0, tone: "safe" },
  { key: "sodium", label: "나트륨", percentage: 0, tone: "safe" },
  {
    key: "saturatedFat",
    label: "포화지방",
    percentage: 0,
    tone: "caution",
  },
  { key: "protein", label: "단백질", percentage: 0, tone: "safe" },
  { key: "fiber", label: "식이섬유", percentage: 0, tone: "safe" },
];

const normalizePercentage = (value) =>
  Math.min(100, Math.max(0, Number(value) || 0));

const normalizeRecord = (record) => ({
  id: record.recordId ?? record.id,
  productId: record.productId,
  productName: record.productName ?? record.name ?? "상품명 없음",
  imageUrl: record.imageUrl ?? record.image ?? null,
  amount: record.amount ?? record.serving ?? record.quantityText ?? "",
  calories: Number(record.calories ?? record.nutrition?.calories) || 0,
  consumedAt:
    record.consumedAt ??
    record.recordedAt ??
    record.createdAt ??
    record.timestamp,
  time: formatKstTime(
    record.consumedAt ??
      record.recordedAt ??
      record.createdAt ??
      record.timestamp,
  ),
});

export async function getDailyRecords(date, { signal } = {}) {
  if (!DAILY_RECORDS_API_URL) {
    return {
      totalCalories: 0,
      recommendedCalories: 2800,
      nutrients: EMPTY_NUTRIENTS,
      records: [],
    };
  }

  const url = new URL(DAILY_RECORDS_API_URL, window.location.origin);
  url.searchParams.set("date", date);
  const userId = localStorage.getItem("userId");
  if (userId) url.searchParams.set("userId", userId);

  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(url, {
    signal,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "섭취 기록을 불러오지 못했습니다.");
  }

  const data = result.data ?? result;
  const records = (data.records ?? data.items ?? data.intakes ?? []).map(
    normalizeRecord,
  );
  const nutrientSource = data.nutrients ?? data.nutritionPercentages ?? {};
  const nutrients = EMPTY_NUTRIENTS.map((item) => ({
    ...item,
    percentage: normalizePercentage(
      Array.isArray(nutrientSource)
        ? nutrientSource.find((value) => value.key === item.key)?.percentage
        : nutrientSource[item.key],
    ),
  }));

  return {
    totalCalories:
      Number(data.totalCalories) ||
      records.reduce((sum, record) => sum + record.calories, 0),
    recommendedCalories: Number(data.recommendedCalories) || 2800,
    nutrients,
    records,
  };
}

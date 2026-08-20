import { formatKstTime, getKstDateKey } from "../utils/dateTime";
import { deduplicatedGet } from "./client";

const DAILY_RECORDS_API_URL = import.meta.env.VITE_DAILY_RECORDS_API_URL;
const LOCAL_RECORDS_KEY = "zeropick:consumption-records";

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
  { key: "fiber", label: "탄수화물", percentage: 0, tone: "safe" },
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
  nutrition: record.nutrition ?? {},
  isLocal: Boolean(record.isLocal),
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

const readLocalRecords = () => {
  try {
    const records = JSON.parse(localStorage.getItem(LOCAL_RECORDS_KEY) || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const getLocalRecordsByDate = (date) =>
  readLocalRecords()
    .filter((record) => getKstDateKey(record.consumedAt) === date)
    .map((record) => normalizeRecord({ ...record, isLocal: true }));

const createNutrients = (records, source = {}) => {
  const totals = records.reduce(
    (result, record) => ({
      sugar: result.sugar + (Number(record.nutrition?.sugar) || 0),
      sodium: result.sodium + (Number(record.nutrition?.sodium) || 0),
      saturatedFat:
        result.saturatedFat +
        (Number(record.nutrition?.saturatedFat) || 0),
      protein: result.protein + (Number(record.nutrition?.protein) || 0),
      fiber: result.fiber + (Number(record.nutrition?.fiber) || 0),
    }),
    { sugar: 0, sodium: 0, saturatedFat: 0, protein: 0, fiber: 0 },
  );
  const dailyValues = {
    sugar: 50,
    sodium: 2000,
    saturatedFat: 15,
    protein: 55,
    fiber: 25,
  };

  return EMPTY_NUTRIENTS.map((item) => ({
    ...item,
    percentage: normalizePercentage(
      Array.isArray(source)
        ? source.find((value) => value.key === item.key)?.percentage
        : source[item.key] ?? (totals[item.key] / dailyValues[item.key]) * 100,
    ),
  }));
};

export function addConsumptionRecord(product, consumedAt = new Date()) {
  const timestamp = new Date(consumedAt).toISOString();
  const records = readLocalRecords();
  const record = {
    recordId: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    productId: product.productId,
    productName: product.productName,
    imageUrl: product.imageUrl ?? null,
    amount: product.weight ?? "1개 기준",
    calories: Number(product.nutrition?.calories ?? product.calories) || 0,
    nutrition: product.nutrition ?? {},
    consumedAt: timestamp,
  };

  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify([...records, record]));
  return normalizeRecord(record);
}

export function deleteConsumptionRecord(recordId) {
  const records = readLocalRecords();
  const nextRecords = records.filter(
    (record) => String(record.recordId ?? record.id) !== String(recordId),
  );

  if (nextRecords.length === records.length) return false;

  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(nextRecords));
  return true;
}

export async function getDailyRecords(date, { signal } = {}) {
  if (!DAILY_RECORDS_API_URL) {
    const records = getLocalRecordsByDate(date);
    return {
      totalCalories: records.reduce(
        (sum, record) => sum + record.calories,
        0,
      ),
      recommendedCalories: 2800,
      nutrients: createNutrients(records),
      records,
    };
  }

  const url = new URL(DAILY_RECORDS_API_URL, window.location.origin);
  url.searchParams.set("date", date);
  const userId = localStorage.getItem("userId");
  if (userId) url.searchParams.set("userId", userId);

  const response = await deduplicatedGet(url.toString(), {
    signal,
    authenticated: true,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "섭취 기록을 불러오지 못했습니다.");
  }

  const data = result.data ?? result;
  const records = [
    ...(data.records ?? data.items ?? data.intakes ?? []).map(normalizeRecord),
    ...getLocalRecordsByDate(date),
  ];
  const nutrientSource = data.nutrients ?? data.nutritionPercentages ?? {};
  const nutrients = createNutrients(records, nutrientSource);

  return {
    totalCalories:
      Number(data.totalCalories) ||
      records.reduce((sum, record) => sum + record.calories, 0),
    recommendedCalories: Number(data.recommendedCalories) || 2800,
    nutrients,
    records,
  };
}

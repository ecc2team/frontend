import { formatKstTime, getKstDateKey } from "../utils/dateTime";
import {
  apiUrl,
  authenticatedFetch,
  deduplicatedGet,
  readJson,
} from "./client";

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
  id: record.intakeRecordId,
  productId: record.productId,
  productName: record.productName ?? "상품명 없음",
  imageUrl: record.imageUrl ?? record.image ?? null,
  amount: record.servingSize ?? "",
  calories: Number(record.calories) || 0,
  time: /^\d{2}:\d{2}/.test(record.intakeTime ?? "")
    ? record.intakeTime.slice(0, 5)
    : formatKstTime(record.intakeTime),
});

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

export async function addConsumptionRecord(product, quantity = 1) {
  const response = await authenticatedFetch(apiUrl("intakes"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: Number(product.productId),
      quantity,
    }),
  });
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "섭취 기록 추가에 실패했습니다.");
  }

  return result;
}

export async function deleteIntakeRecord(intakeRecordId) {
  if (intakeRecordId == null || String(intakeRecordId).trim() === "") {
    throw new Error("삭제할 섭취 기록 ID가 없습니다.");
  }

  const response = await authenticatedFetch(
    apiUrl(`intakes/${encodeURIComponent(intakeRecordId)}`),
    { method: "DELETE" },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(result?.message || "섭취 기록 삭제에 실패했습니다.");
  }

  return result;
}

export async function getDailyRecords(date, { signal } = {}) {
  if (date !== getKstDateKey()) {
    return {
      totalCalories: 0,
      recommendedCalories: 2800,
      nutrients: createNutrients([]),
      records: [],
    };
  }

  const response = await deduplicatedGet(apiUrl("intakes/today"), {
    signal,
    authenticated: true,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "섭취 기록을 불러오지 못했습니다.");
  }

  const data = result.data ?? result;
  const records = (data.intakeDetails ?? []).map(normalizeRecord);
  const nutrientSource = {
    sugar: data.nutrients?.sugarPercentage,
    sodium: data.nutrients?.sodiumPercentage,
    saturatedFat: data.nutrients?.saturatedFatPercentage,
    protein: data.nutrients?.proteinPercentage,
    fiber: data.nutrients?.carbohydratePercentage,
  };
  const nutrients = createNutrients(records, nutrientSource);

  return {
    totalCalories: Number(data.summary?.totalCalories) || 0,
    recommendedCalories: Number(data.summary?.targetCalories) || 2800,
    nutrients,
    records,
  };
}

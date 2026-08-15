import { mockDuplicates } from "../data/signupOptions";
import { apiUrl } from "../api/client";

export async function checkDuplicate(field, value) {
  if (!value.trim()) throw new Error("값을 먼저 입력해주세요.");
  if (field !== "email") {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return !mockDuplicates[field].includes(value.trim());
  }
  const response = await fetch(
    `${apiUrl("users/check-email")}?email=${encodeURIComponent(value.trim())}`,
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "중복 확인에 실패했습니다.");
  return result.data?.isAvailable ?? result.data?.available ?? false;
}

export async function signup(payload) {
  const response = await fetch(apiUrl("auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || result.status !== 201)
    throw new Error(result.message || "회원가입에 실패했습니다.");
  return result;
}

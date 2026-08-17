import { mockDuplicates } from "../data/signupOptions";
import { apiUrl, deduplicatedGet, readJson } from "../api/client";

export async function checkDuplicate(field, value) {
  if (!value.trim()) throw new Error("값을 먼저 입력해주세요.");
  if (field !== "email") {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return !mockDuplicates[field].includes(value.trim());
  }
  const response = await deduplicatedGet(
    `${apiUrl("users/check-email")}?email=${encodeURIComponent(value.trim())}`,
    { credentials: "include" },
  );
  const result = await readJson(response);
  if (!response.ok)
    throw new Error(result?.message || "중복 확인에 실패했습니다.");
  return result.data?.isAvailable ?? result.data?.available ?? false;
}

export async function signup(payload) {
  const response = await fetch(apiUrl("auth/signup"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await readJson(response);
  if (!response.ok) {
    const error = new Error(
      response.status === 409
        ? "이메일 인증 시간이 만료되었습니다. 다시 인증해주세요."
        : result?.message || "회원가입에 실패했습니다.",
    );
    error.status = response.status;
    throw error;
  }
  if (!result) throw new Error("회원가입 응답 형식이 올바르지 않습니다.");
  return result;
}

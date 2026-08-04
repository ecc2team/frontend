import { mockDuplicates } from "../data/signupOptions";

const SIGNUP_API = import.meta.env.VITE_SIGNUP_API_URL;
const DUPLICATE_API = import.meta.env.VITE_DUPLICATE_API_URL;

export async function checkDuplicate(field, value) {
  if (!value.trim()) throw new Error("값을 먼저 입력해주세요.");
  if (!DUPLICATE_API) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return !mockDuplicates[field].includes(value.trim());
  }
  const response = await fetch(
    `${DUPLICATE_API}?field=${field}&value=${encodeURIComponent(value.trim())}`,
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "중복 확인에 실패했습니다.");
  return result.data?.available ?? false;
}

export async function signup(payload) {
  if (!SIGNUP_API) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      status: 201,
      message: "회원가입 및 맞춤 취향 설정이 성공적으로 완료되었습니다.",
      data: { userId: 1, email: payload.email, nickname: payload.nickname },
    };
  }
  const response = await fetch(SIGNUP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || result.status !== 201)
    throw new Error(result.message || "회원가입에 실패했습니다.");
  return result;
}

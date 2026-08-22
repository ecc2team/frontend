import { apiUrl, deduplicatedGet, readJson } from "./client";

export async function checkNickname(nickname, options = {}) {
  const normalizedNickname = nickname.trim();
  if (!normalizedNickname) {
    throw new Error("닉네임을 먼저 입력해주세요.");
  }

  const params = new URLSearchParams({ nickname: normalizedNickname });
  const response = await deduplicatedGet(
    `${apiUrl("users/check-nickname")}?${params}`,
    { credentials: "include", ...options },
  );
  const result = await readJson(response);

  if (!response.ok) {
    throw new Error(
      result?.message || "닉네임 중복 확인에 실패했습니다. 다시 시도해주세요.",
    );
  }

  if (typeof result?.data?.isAvailable !== "boolean") {
    throw new Error("닉네임 중복 확인 응답 형식이 올바르지 않습니다.");
  }

  return result.data.isAvailable;
}

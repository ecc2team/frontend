import { apiUrl, readJson } from "./client";

async function emailRequest(path, body) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await readJson(response);

  if (!response.ok) {
    const error = new Error(
      result?.message ||
        (response.status === 409
          ? "인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요."
          : "이메일 인증 요청에 실패했습니다."),
    );
    error.status = response.status;
    throw error;
  }

  if (!result) {
    throw new Error("이메일 인증 응답 형식이 올바르지 않습니다.");
  }

  return result;
}

export function sendEmailCode(email) {
  return emailRequest("emails/send-code", { email });
}

export function verifyEmailCode(email, code) {
  return emailRequest("emails/verify-code", { email, code });
}

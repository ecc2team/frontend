import { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { findAccount } from "../api/account";

const Page = styled.div`min-height: 100vh; background: #f9f4fd;`;
const Card = styled.main`
  width: min(662px, calc(100% - 40px)); margin: 80px auto; padding: 52px 44px;
  border: 1px solid #f3deff; border-radius: 10px; background: #fff;
`;
const Title = styled.h1`margin: 0; text-align: center; font-size: 42px;`;
const Guide = styled.p`margin: 20px 0 32px; color: #5c5454; text-align: center;`;
const Input = styled.input`
  width: 100%; height: 62px; padding: 0 22px; border: 1px solid #f3deff;
  border-radius: 10px; font-size: 20px; outline: none;
  &:focus { border-color: #a032be; }
`;
const Button = styled.button`
  width: 100%; height: 58px; margin-top: 18px; border: 0; border-radius: 10px;
  background: #a032be; color: #fff; font-size: 20px; font-weight: 700; cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const Message = styled.p`margin: 20px 0 0; color: #c62828; text-align: center;`;
const Result = styled.div`
  margin-top: 28px; padding: 24px; border-radius: 10px; background: #f9f4fd;
  text-align: center; line-height: 1.8;
  strong { color: #a032be; }
`;
const Back = styled(Link)`display: block; margin-top: 24px; color: #7b278f; text-align: center;`;

const PROVIDER_LABELS = {
  LOCAL: "일반 로그인",
  KAKAO: "카카오 로그인",
  GOOGLE: "구글 로그인",
};

export default function FindAccount() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await findAccount(email.trim());
      setResult(response?.data ?? null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header />
      <Card>
        <Title>계정 찾기</Title>
        <Guide>가입한 이메일을 입력해주세요.</Guide>
        <form onSubmit={submit}>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일 입력" autoComplete="email" required />
          <Button disabled={loading}>{loading ? "확인 중..." : "계정 찾기"}</Button>
        </form>
        {error && <Message role="alert">{error}</Message>}
        {result && (
          <Result role="status">
            <strong>가입된 계정을 찾았습니다.</strong><br />
            이메일: {result.email}<br />
            로그인 방식: {PROVIDER_LABELS[result.provider] || result.provider}
          </Result>
        )}
        <Back to="/login">로그인으로 돌아가기</Back>
      </Card>
    </Page>
  );
}

import { useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SocialLoginButton from "../components/SocialLoginButton";
import PasswordInput from "../components/PasswordInput";
import { login } from "../api/auth";
import { startOAuth } from "../config/oauth";
const Page = styled.div`
  min-height: 100vh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  min-height: 847px;
  padding: 80px 20px 96px;
`;
const Form = styled.form`
  width: min(662px, 100%);
  margin: auto;
`;
const Title = styled.h1`
  margin: 0 0 68px;
  text-align: center;
  font-size: 50px;
  line-height: 1;
`;
const Input = styled.input`
  width: 100%;
  height: 77px;
  margin-bottom: 24px;
  padding: 0 29px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  color: #332d33;
  font-size: 25px;
  font-weight: 700;
  outline: none;
  &::placeholder {
    color: #8f8686;
  }
  &:focus {
    border-color: #a032be;
  }
`;
const Button = styled.button`
  width: 100%;
  height: 68px;
  margin-bottom: 24px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-size: 25px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
  }
`;
const Signup = styled(Link)`
  width: 100%;
  height: 68px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #a032be;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 700;
  text-decoration: none;
`;
const Error = styled.p`
  color: #c62828;
  text-align: center;
`;
const RecoveryLinks = styled.div`
  margin: 4px 0 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
  color: #8f8686;
  a { color: #5c5454; text-decoration: none; }
  a:hover { color: #a032be; text-decoration: underline; }
`;
const Divider = styled.div`
  width: 78%;
  height: 1px;
  margin: 57px auto 26px;
  background: #242024;
`;
const Social = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;
export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const json = await login({
        email: f.get("email"),
        password: f.get("password"),
      });
      if (!json?.data?.accessToken) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }
      localStorage.setItem("accessToken", json.data.accessToken);
      localStorage.setItem("userId", String(json.data.userId));
      nav("/", { replace: true });
    } catch (err) {
      setError(err.message || "로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Page>
      <Header />
      <Main>
        <Form onSubmit={submit}>
          <Title>로그인</Title>
          <Input
            name="email"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            required
          />
          <PasswordInput
            name="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
            large
          />
          <Button disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          <RecoveryLinks>
            <Link to="/find-account">계정 찾기</Link>
            <span aria-hidden="true">|</span>
            <Link to="/reset-password">비밀번호 재설정</Link>
          </RecoveryLinks>
          <Signup to="/signup">회원가입</Signup>
          {error && <Error role="alert">{error}</Error>}
          <Divider />
          <p style={{ textAlign: "center", color: "#5c5454" }}>
            소셜 계정으로 로그인
          </p>
          <Social>
            <SocialLoginButton
              provider="kakao"
              onClick={() => startOAuth("kakao")}
              label="카카오톡으로 로그인"
            />
            <SocialLoginButton
              provider="google"
              onClick={() => startOAuth("google")}
              label="Google로 로그인"
            />
          </Social>
        </Form>
      </Main>
    </Page>
  );
}

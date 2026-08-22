import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PasswordInput from "../components/PasswordInput";
import { sendEmailCode, verifyEmailCode } from "../api/email";
import { resetPassword } from "../api/account";

const Page = styled.div`min-height: 100vh; background: #f9f4fd;`;
const Card = styled.main`
  width: min(662px, calc(100% - 40px)); margin: 80px auto; padding: 52px 44px;
  border: 1px solid #f3deff; border-radius: 10px; background: #fff;
`;
const Title = styled.h1`margin: 0; text-align: center; font-size: 42px;`;
const Guide = styled.p`margin: 20px 0 32px; color: #5c5454; text-align: center;`;
const Label = styled.label`display: block; margin: 18px 0 8px; font-weight: 700;`;
const Row = styled.div`display: flex; gap: 10px; @media (max-width: 520px) { flex-direction: column; }`;
const Input = styled.input`
  width: 100%; height: 58px; padding: 0 20px; border: 1px solid #f3deff;
  border-radius: 10px; font-size: 18px; outline: none;
  &:focus { border-color: #a032be; }
`;
const Button = styled.button`
  min-width: 132px; height: 58px; padding: 0 18px; border: 0; border-radius: 10px;
  background: #a032be; color: #fff; font-size: 18px; font-weight: 700;
  white-space: nowrap; cursor: pointer;
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;
const FullButton = styled(Button)`width: 100%; margin-top: 24px;`;
const Timer = styled.p`margin: 10px 0 0; color: ${({ $expired }) => ($expired ? "#c62828" : "#248a3d")};`;
const Message = styled.p`margin: 18px 0 0; color: ${({ $error }) => ($error ? "#c62828" : "#248a3d")}; text-align: center;`;
const Back = styled(Link)`display: block; margin-top: 24px; color: #7b278f; text-align: center;`;

const formatTime = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const sendCode = async () => {
    if (!email.trim() || loading || seconds > 0) return;
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const result = await sendEmailCode(email.trim());
      setCode("");
      setStep("verify");
      setSeconds(300);
      setMessage({ text: result?.message || "인증번호를 발송했습니다.", error: false });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (seconds <= 0) {
      setMessage({ text: "인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.", error: true });
      return;
    }
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const result = await verifyEmailCode(email.trim(), code.trim());
      if (result?.data?.emailVerified !== true) throw new Error("인증번호가 올바르지 않습니다.");
      setStep("password");
      setSeconds(0);
      setCode("");
      setMessage({ text: "이메일 인증이 완료되었습니다.", error: false });
    } catch (error) {
      if (error.status === 409) {
        setStep("verify");
        setCode("");
        setSeconds(0);
      }
      setMessage({ text: error.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage({ text: "비밀번호와 비밀번호 확인이 일치하지 않습니다.", error: true });
      return;
    }
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const result = await resetPassword(email.trim(), password);
      setPassword("");
      setConfirmation("");
      setCode("");
      setMessage({ text: result?.message || "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.", error: false });
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      if (error.status === 409) {
        setStep("verify");
        setSeconds(0);
        setCode("");
      }
      setMessage({ text: error.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header />
      <Card>
        <Title>비밀번호 재설정</Title>
        <Guide>{step === "password" ? "새 비밀번호를 입력해주세요." : "가입한 이메일을 입력해주세요."}</Guide>
        {step === "email" && <Row><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일 입력" autoComplete="email" required /><Button type="button" onClick={sendCode} disabled={loading || !email.trim()}>인증번호 받기</Button></Row>}
        {step === "verify" && <><Label htmlFor="verification-code">인증번호</Label><Row><Input id="verification-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="인증번호 6자리 입력" inputMode="numeric" autoComplete="one-time-code" /><Button type="button" onClick={verifyCode} disabled={loading || seconds <= 0 || code.length !== 6}>인증</Button></Row><Timer $expired={seconds === 0}>{formatTime(seconds)}</Timer><Button type="button" onClick={sendCode} disabled={loading || seconds > 0}>{seconds > 0 ? "재전송 대기" : "인증번호 재전송"}</Button></>}
        {step === "password" && <form onSubmit={submitPassword}><Label htmlFor="new-password">새 비밀번호</Label><PasswordInput id="new-password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /><Label htmlFor="confirm-password">새 비밀번호 확인</Label><PasswordInput id="confirm-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required /><FullButton disabled={loading}>{loading ? "변경 중..." : "비밀번호 변경"}</FullButton></form>}
        {message.text && <Message $error={message.error} role={message.error ? "alert" : "status"}>{message.text}</Message>}
        <Back to="/login">로그인으로 돌아가기</Back>
      </Card>
    </Page>
  );
}

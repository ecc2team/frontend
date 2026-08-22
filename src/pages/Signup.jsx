import { Fragment, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PreferenceRow from "../components/PreferenceRow";
import SocialLoginButton from "../components/SocialLoginButton";
import PasswordInput from "../components/PasswordInput";
import AdditionalSignupInfo from "../components/AdditionalSignupInfo";
import { signupOptions } from "../data/signupOptions";
import { checkDuplicate, signup } from "../services/signupApi";
import { sendEmailCode, verifyEmailCode } from "../api/email";
import { submitSocialOnboarding } from "../api/auth";
import { startOAuth } from "../config/oauth";
import checkIcon from "../assets/signup-check.svg";

const Page = styled.div`
  min-height: 100vh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  padding: 19px 20px 29px;
`;
const Card = styled.form`
  width: min(1151px, 100%);
  min-height: 795px;
  margin: auto;
  padding: 14px 42px 36px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
`;
const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 50px;
  line-height: 76px;
  font-weight: 600;
`;
const Divider = styled.hr`
  margin: 0 0 24px;
  border: 0;
  border-top: 1px solid #222;
`;
const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 25px;
`;
const Info = styled.div`
  display: grid;
  gap: 18px;
  margin-bottom: 23px;
`;
const Field = styled.div`
  display: grid;
  grid-template-columns: ${({ $withoutAction }) =>
    $withoutAction
      ? "155px minmax(0, 602px)"
      : "155px minmax(0, 602px) 145px"};
  align-items: center;
  gap: 27px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;
const FieldLabel = styled.label`
  font-size: 20px;
`;
const Input = styled.input`
  height: 45px;
  padding: 0 18px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  font-size: 20px;
  outline: none;
  &::placeholder {
    color: #8f8686;
  }
  &:focus {
    border-color: #a032be;
  }
  &:read-only {
    background: #f1eff2;
    color: #6d6670;
    cursor: default;
  }
`;
const VerifyArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Verify = styled.button`
  width: 118px;
  flex-shrink: 0;
  height: 45px;
  padding: 0;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: ${({ $secondary }) => ($secondary ? "#fff" : "#a032be")};
  color: ${({ $secondary }) => ($secondary ? "#a032be" : "#fff")};
  font-size: 20px;
  white-space: nowrap;
  cursor: pointer;
`;
const Check = styled.span`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 36px;
    height: 26px;
  }
`;
const VerificationCodeRow = styled.div`
  width: 602px;
  height: 40px;
  margin-left: 182px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 760px) {
    width: 100%;
    height: auto;
    margin-left: 0;
    flex-wrap: wrap;
    gap: 8px;
  }
`;
const VerificationCodeLabel = styled.label`
  flex: 0 0 64px;
  padding-top: 9px;
  font-size: 18px;
  white-space: nowrap;
`;
const VerificationInput = styled(Input)`
  flex: 0 0 299px;
  width: 299px;
  height: 40px;

  @media (max-width: 760px) {
    flex: 1 1 220px;
    width: auto;
  }
`;
const VerificationActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-left: 3px;

  @media (max-width: 760px) {
    margin-left: 72px;
  }
`;
const ResendArea = styled.div`
  position: relative;
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const VerificationButton = styled(Verify)`
  width: 100px;
  height: 40px;
  font-size: 18px;
`;
const ResendButton = styled(VerificationButton)`
  background: ${({ disabled }) => (disabled ? "#a9a4aa" : "#a032be")};
  border-color: ${({ disabled }) => (disabled ? "#a9a4aa" : "#a032be")};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
const Countdown = styled.span`
  position: absolute;
  top: 43px;
  left: 0;
  width: 100%;
  color: #248a3d;
  font-size: 10px;
  line-height: 12px;
`;
const Preferences = styled.div`
  display: grid;
  gap: 23px;
  margin: 0 0 30px;
`;
const Submit = styled.button`
  display: block;
  width: min(677px, 100%);
  height: 51px;
  margin: auto;
  border: 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-size: 25px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
  }
`;
const Message = styled.p`
  margin: 12px 0 0;
  text-align: center;
  color: ${({ $error }) => ($error ? "#c62828" : "#248a3d")};
`;
const SocialDivider = styled.div`
  width: 78%;
  height: 1px;
  margin: 36px auto 22px;
  background: #242024;
`;
const SocialGuide = styled.p`
  margin: 0 0 18px;
  color: #5c5454;
  text-align: center;
`;
const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const initialSelections = Object.fromEntries(
  signupOptions.map(({ key }) => [key, []]),
);
const fields = [
  {
    key: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력해주세요",
  },
  {
    key: "nickname",
    label: "닉네임",
    type: "text",
    placeholder: "닉네임을 입력해주세요",
  },
  {
    key: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요",
  },
];

export default function Signup({ onboarding = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const socialOnboarding = location.state?.socialOnboarding;
  const isSocialOnboarding = Boolean(socialOnboarding);
  const visibleFields = fields.filter(({ key }) => {
    if (onboarding) return key !== "email";
    if (isSocialOnboarding) return key !== "password";
    return true;
  });
  const [values, setValues] = useState({
    email: socialOnboarding?.email ?? "",
    password: "",
    nickname: socialOnboarding?.nickname ?? "",
  });
  const [verified, setVerified] = useState({
    email: false,
    password: false,
    nickname: false,
  });
  const [selections, setSelections] = useState(initialSelections);
  const [message, setMessage] = useState({ text: "", error: false });
  const [loading, setLoading] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [checkingField, setCheckingField] = useState(null);
  const currentEmailRef = useRef("");
  const currentNicknameRef = useRef(socialOnboarding?.nickname ?? "");

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const sendVerificationCode = async (email = values.email.trim()) => {
    if (resendSeconds > 0 || sendingCode) return;
    const requestedEmail = email.trim();
    if (!requestedEmail) {
      setMessage({ text: "이메일을 먼저 입력해주세요.", error: true });
      return false;
    }

    setSendingCode(true);
    setMessage({ text: "", error: false });
    try {
      const result = await sendEmailCode(requestedEmail);
      if (currentEmailRef.current.trim() !== requestedEmail) return false;
      setResendSeconds(60);
      setEmailCodeVerified(false);
      setMessage({
        text: result?.message || "인증번호를 전송했습니다.",
        error: false,
      });
      return true;
    } catch (error) {
      setMessage({ text: error.message, error: true });
      return false;
    } finally {
      setSendingCode(false);
    }
  };
  const changeValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setVerified((prev) => ({ ...prev, [field]: false }));
    if (field === "email") {
      currentEmailRef.current = value;
      setEmailCodeVerified(false);
      setEmailCode("");
    }
    if (field === "nickname") currentNicknameRef.current = value;
  };
  const verifyCode = async () => {
    if (!values.email.trim() || !emailCode.trim() || verifyingCode) {
      setMessage({
        text: "이메일과 인증번호를 모두 입력해주세요.",
        error: true,
      });
      return;
    }

    const requestedEmail = values.email.trim();
    setVerifyingCode(true);
    setMessage({ text: "", error: false });
    try {
      const result = await verifyEmailCode(requestedEmail, emailCode.trim());
      if (currentEmailRef.current.trim() !== requestedEmail) return;
      const success = result?.data?.emailVerified === true;
      setEmailCodeVerified(success);
      setMessage({
        text: success
          ? result?.message || "이메일 인증이 완료되었습니다."
          : "인증번호가 올바르지 않습니다.",
        error: !success,
      });
    } catch (error) {
      setEmailCodeVerified(false);
      if (error.status === 409) {
        setEmailCode("");
        setResendSeconds(0);
      }
      setMessage({
        text:
          error.message ||
          (error.status === 409
            ? "인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요."
            : "이메일 인증에 실패했습니다."),
        error: true,
      });
    } finally {
      setVerifyingCode(false);
    }
  };
  const verify = async (field) => {
    if (checkingField) return;
    const requestedValue = values[field].trim();
    setVerified((prev) => ({ ...prev, [field]: false }));
    setCheckingField(field);
    try {
      const available = await checkDuplicate(field, requestedValue);
      if (
        field === "nickname" &&
        currentNicknameRef.current.trim() !== requestedValue
      ) {
        return;
      }
      setVerified((prev) => ({ ...prev, [field]: available }));
      if (field === "email" && available) {
        await sendVerificationCode(values.email);
        return;
      }
      setMessage({
        text:
          field === "nickname"
            ? available
              ? "사용 가능한 닉네임입니다."
              : "이미 사용 중인 닉네임입니다."
            : available
              ? "사용할 수 있습니다."
              : "이미 사용 중인 값입니다.",
        error: !available,
      });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setCheckingField(null);
    }
  };
  const toggle = (key, value) =>
    setSelections((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  const submit = async (event) => {
    event.preventDefault();
    if (!isSocialOnboarding && !verified.nickname) {
      setMessage({ text: "닉네임 중복 확인을 해주세요.", error: true });
      return;
    }
    if (
      !isSocialOnboarding &&
      !visibleFields
        .filter(({ key }) => key !== "password")
        .every(({ key }) => verified[key])
    ) {
      setMessage({
        text: "기본 정보의 중복 확인을 모두 완료해주세요.",
        error: true,
      });
      return;
    }
    if (!onboarding && !isSocialOnboarding && !emailCodeVerified) {
      setMessage({ text: "이메일 인증을 완료해주세요.", error: true });
      return;
    }
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const onboardingData = {
        preferredCategories: selections.preferredCategories,
        dislikedIngredients: selections.dislikedIngredients,
        allergyFlags: selections.allergyFlags,
      };
      const result = onboarding || isSocialOnboarding
        ? await submitSocialOnboarding(onboardingData)
        : await signup({
            email: values.email,
            password: values.password,
            nickname: values.nickname,
            onboarding: onboardingData,
          });
      setMessage({
        text:
          result?.message ||
          "회원가입이 완료되었습니다.",
        error: false,
      });
      setTimeout(() => navigate("/", { replace: true }), 700);
    } catch (error) {
      if (!onboarding && !isSocialOnboarding && error.status === 409) {
        setEmailCodeVerified(false);
        setEmailCode("");
        setResendSeconds(0);
      }
      setMessage({ text: error.message, error: true });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Page>
      <Header />
      <Main>
        <Card onSubmit={submit}>
          <Title>회원가입</Title>
          <Divider />
          <SectionTitle>기본 정보</SectionTitle>
          <Info>
            {visibleFields.map(({ key, label, type, placeholder }) => (
              <Fragment key={key}>
                <Field $withoutAction={key === "password"}>
                  <FieldLabel htmlFor={key}>{label}</FieldLabel>
                  {key === "password" ? (
                    <PasswordInput
                      id={key}
                      value={values[key]}
                      onChange={(event) => changeValue(key, event.target.value)}
                      placeholder={placeholder}
                      autoComplete="new-password"
                      required
                    />
                  ) : (
                    <Input
                      id={key}
                      type={type}
                      value={values[key]}
                      onChange={(event) => changeValue(key, event.target.value)}
                      placeholder={placeholder}
                      readOnly={isSocialOnboarding}
                      required={!isSocialOnboarding}
                    />
                  )}
                  {key !== "password" &&
                    (isSocialOnboarding ? (
                      <span />
                    ) : (
                      <VerifyArea>
                        <Verify
                          type="button"
                          disabled={checkingField === key}
                          onClick={() => verify(key)}
                        >
                          {checkingField === key ? "확인 중" : "중복 확인"}
                        </Verify>
                        {((key === "email" && verified.email === true) ||
                          (key === "nickname" &&
                            verified.nickname === true)) && (
                          <Check>
                            <img src={checkIcon} alt="사용 가능" />
                          </Check>
                        )}
                      </VerifyArea>
                    ))}
                </Field>
                {key === "email" && !isSocialOnboarding && !onboarding && (
                  <VerificationCodeRow>
                    <VerificationCodeLabel htmlFor="email-verification-code">
                      인증 번호
                    </VerificationCodeLabel>
                    <VerificationInput
                      id="email-verification-code"
                      type="text"
                      inputMode="numeric"
                      value={emailCode}
                      onChange={(event) => setEmailCode(event.target.value)}
                      placeholder="인증 번호를 입력해주세요"
                      autoComplete="one-time-code"
                    />
                    <VerificationActions>
                      <ResendArea>
                        <ResendButton
                          type="button"
                          disabled={resendSeconds > 0 || sendingCode}
                          onClick={() => sendVerificationCode()}
                        >
                          {sendingCode ? "전송 중" : "재전송"}
                        </ResendButton>
                        <Countdown aria-live="polite">
                          {resendSeconds > 0
                            ? `00:${String(resendSeconds).padStart(2, "0")}`
                            : ""}
                        </Countdown>
                      </ResendArea>
                      <VerificationButton
                        type="button"
                        $secondary
                        disabled={verifyingCode}
                        onClick={verifyCode}
                      >
                        {verifyingCode ? "확인 중" : "인증"}
                      </VerificationButton>
                      {emailCodeVerified && (
                        <Check>
                          <img src={checkIcon} alt="이메일 인증 완료" />
                        </Check>
                      )}
                    </VerificationActions>
                  </VerificationCodeRow>
                )}
              </Fragment>
            ))}
          </Info>
          <Divider />
          <AdditionalSignupInfo />
          <Divider />
          <SectionTitle>취향 설정</SectionTitle>
          <Preferences>
            {signupOptions.map((group) => (
              <PreferenceRow
                key={group.key}
                group={group}
                selected={selections[group.key]}
                onToggle={toggle}
              />
            ))}
          </Preferences>
          <Submit disabled={loading}>
            {loading ? "가입 중..." : "회원가입 완료"}
          </Submit>
          {message.text && (
            <Message role="status" $error={message.error}>
              {message.text}
            </Message>
          )}
          {!onboarding && !isSocialOnboarding && (
            <>
              <SocialDivider />
              <SocialGuide>소셜 계정으로 회원가입</SocialGuide>
              <SocialButtons>
                <SocialLoginButton
                  provider="kakao"
                  onClick={() => startOAuth("kakao")}
                  label="카카오톡으로 회원가입"
                />
                <SocialLoginButton
                  provider="google"
                  onClick={() => startOAuth("google")}
                  label="Google로 회원가입"
                />
              </SocialButtons>
            </>
          )}
        </Card>
      </Main>
    </Page>
  );
}

import { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PreferenceRow from "../components/PreferenceRow";
import { signupOptions } from "../data/signupOptions";
import { checkDuplicate, signup } from "../services/signupApi";
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
  grid-template-columns: 155px minmax(0, 602px) 145px;
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
`;
const VerifyArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const Verify = styled.button`
  height: 45px;
  padding: 0 15px;
  border: 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
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
    key: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력해주세요",
  },
  {
    key: "nickname",
    label: "닉네임",
    type: "text",
    placeholder: "닉네임을 입력해주세요",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [verified, setVerified] = useState({
    email: false,
    password: false,
    nickname: false,
  });
  const [selections, setSelections] = useState(initialSelections);
  const [message, setMessage] = useState({ text: "", error: false });
  const [loading, setLoading] = useState(false);
  const changeValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setVerified((prev) => ({ ...prev, [field]: false }));
  };
  const verify = async (field) => {
    try {
      const available = await checkDuplicate(field, values[field]);
      setVerified((prev) => ({ ...prev, [field]: available }));
      setMessage({
        text: available ? "사용할 수 있습니다." : "이미 사용 중인 값입니다.",
        error: !available,
      });
    } catch (error) {
      setMessage({ text: error.message, error: true });
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
    if (!Object.values(verified).every(Boolean)) {
      setMessage({
        text: "기본 정보의 중복 확인을 모두 완료해주세요.",
        error: true,
      });
      return;
    }
    setLoading(true);
    setMessage({ text: "", error: false });
    try {
      const result = await signup({
        email: values.email,
        password: values.password,
        nickname: values.nickname,
        onboarding: {
          preferredCategories: selections.preferredCategories,
          dislikedIngredients: selections.dislikedIngredients,
          allergyFlags: selections.allergyFlags,
        },
      });
      setMessage({ text: result.message, error: false });
      setTimeout(() => navigate("/", { replace: true }), 700);
    } catch (error) {
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
            {fields.map(({ key, label, type, placeholder }) => (
              <Field key={key}>
                <FieldLabel htmlFor={key}>{label}</FieldLabel>
                <Input
                  id={key}
                  type={type}
                  value={values[key]}
                  onChange={(event) => changeValue(key, event.target.value)}
                  placeholder={placeholder}
                  required
                />
                <VerifyArea>
                  <Verify type="button" onClick={() => verify(key)}>
                    중복 확인
                  </Verify>
                  {verified[key] && (
                    <Check>
                      <img src={checkIcon} alt="사용 가능" />
                    </Check>
                  )}
                </VerifyArea>
              </Field>
            ))}
          </Info>
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
        </Card>
      </Main>
    </Page>
  );
}

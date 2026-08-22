import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PreferenceRow from "../components/PreferenceRow";
import { signupOptions } from "../data/signupOptions";
import { getProfile } from "../api/profile";
import { submitSocialOnboarding } from "../api/auth";

const Page = styled.div`min-height: 100vh; background: #f9f4fd; color: #242024;`;
const Main = styled.main`width: min(1151px, calc(100% - 40px)); margin: 0 auto; padding: 20px 0 70px;`;
const Card = styled.form`
  padding: 28px 42px 38px; border: 1px solid #f3deff; border-radius: 10px; background: #fff;
  @media (max-width: 760px) { padding: 26px 20px; }
`;
const Title = styled.h1`
  margin: 0 0 28px; padding-bottom: 20px; border-bottom: 1px solid #242024;
  text-align: center; font-size: 46px;
`;
const SectionTitle = styled.h2`margin: 26px 0 18px; font-size: 25px;`;
const Info = styled.div`display: grid; gap: 16px;`;
const Field = styled.div`
  display: grid; grid-template-columns: 155px minmax(0, 602px); align-items: center; gap: 27px;
  @media (max-width: 760px) { grid-template-columns: 1fr; gap: 8px; }
`;
const Label = styled.label`font-size: 20px;`;
const Input = styled.input`
  height: 45px; padding: 0 18px; border: 1px solid #f3deff; border-radius: 10px;
  background: ${({ readOnly }) => (readOnly ? "#f1eff2" : "#fff")};
  color: ${({ readOnly }) => (readOnly ? "#6d6670" : "#242024")};
  font-size: 20px;
  outline: none;
  &:focus { border-color: #a032be; }
`;
const NicknameRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 145px;
  gap: 12px;
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;
const DuplicateButton = styled.button`
  height: 45px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #f1eff2;
  color: #8f8686;
  font-size: 16px;
  white-space: nowrap;
  cursor: not-allowed;
`;
const Notice = styled.p`
  margin: 8px 0 0 182px; color: #6d6670; font-size: 13px;
  @media (max-width: 760px) { margin-left: 0; }
`;
const Preferences = styled.div`display: grid; gap: 23px;`;
const Submit = styled.button`
  display: block; width: min(677px, 100%); height: 52px; margin: 34px auto 0;
  border: 0; border-radius: 10px; background: #a032be; color: #fff;
  font-size: 22px; font-weight: 700; cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const Status = styled.div`
  padding: 90px 20px; border: 1px solid #f3deff; border-radius: 10px;
  background: #fff; color: #5c5454; text-align: center;
`;
const Message = styled.p`margin: 18px 0 0; color: #c62828; text-align: center;`;

const emptySelections = () =>
  Object.fromEntries(signupOptions.map(({ key }) => [key, []]));

export default function Onboarding() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [selections, setSelections] = useState(emptySelections);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    getProfile({ signal: controller.signal })
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setNickname(data.nickname);
        setSelections({
          preferredCategories: data.preferredCategories,
          dislikedIngredients: data.dislikedIngredients,
          allergyFlags: data.allergyFlags,
        });
        setStatus("success");
      })
      .catch((requestError) => {
        if (active && requestError.name !== "AbortError") {
          setError(requestError.message);
          setStatus("error");
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const toggle = (key, value) =>
    setSelections((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await submitSocialOnboarding(selections);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Header />
      <Main>
        {status === "loading" && <Status role="status">회원 정보를 불러오고 있습니다...</Status>}
        {status === "error" && <Status role="alert">{error}</Status>}
        {status === "success" && profile && (
          <Card onSubmit={submit}>
            <Title>회원가입</Title>
            <SectionTitle>기본 정보</SectionTitle>
            <Info>
              <Field><Label htmlFor="social-email">이메일</Label><Input id="social-email" value={profile.email} readOnly /></Field>
              <Field>
                <Label htmlFor="social-nickname">닉네임</Label>
                <NicknameRow>
                  <Input
                    id="social-nickname"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    autoComplete="nickname"
                  />
                  <DuplicateButton type="button" disabled>중복 확인 준비 중</DuplicateButton>
                </NicknameRow>
              </Field>
            </Info>
            <Notice>
              닉네임 변경과 중복 확인 API는 준비 중이며, 현재 온보딩 저장에는 반영되지 않습니다.
            </Notice>
            <SectionTitle>취향 설정</SectionTitle>
            <Preferences>
              {signupOptions.map((group) => (
                <PreferenceRow key={group.key} group={group} selected={selections[group.key]} onToggle={toggle} />
              ))}
            </Preferences>
            <Submit disabled={saving}>{saving ? "저장 중..." : "시작하기"}</Submit>
            {error && <Message role="alert">{error}</Message>}
          </Card>
        )}
      </Main>
    </Page>
  );
}

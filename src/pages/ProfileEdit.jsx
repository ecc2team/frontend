import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  ACTIVITY_LEVEL_LABELS,
  GENDER_LABELS,
  getProfile,
  updateProfilePreferences,
} from "../api/profile";
import { signupOptions } from "../data/signupOptions";
import profileImage from "../assets/default-profile.png";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1296px, calc(100% - 36px));
  margin: auto;
  padding: 38px 56px 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fbf7ff 0%, #f8f1fd 100%);
  @media (max-width: 760px) {
    padding: 28px 20px;
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
`;
const Title = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 700;
`;
const Actions = styled.div`
  display: flex;
  gap: 12px;
`;
const Action = styled.button`
  width: 120px;
  height: 50px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: ${({ $primary }) => ($primary ? "#b536db" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#000")};
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
const Card = styled.section`
  margin-bottom: 12px;
  padding: 22px 27px;
  border: 1px solid #cb71ff;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.88);
`;
const Basic = styled(Card)`
  display: grid;
  grid-template-columns: 140px 1fr 1px 1fr;
  align-items: center;
  gap: 34px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
const Avatar = styled.img`
  width: 112px;
  height: 112px;
  object-fit: contain;
`;
const Vertical = styled.div`
  width: 1px;
  height: 96px;
  background: #d4cdd6;
  @media (max-width: 760px) {
    display: none;
  }
`;
const Field = styled.label`
  display: grid;
  gap: 10px;
  font-size: 16px;
  span {
    color: #8f8686;
    font-size: 14px;
  }
`;
const Input = styled.input`
  width: 100%;
  height: 47px;
  padding: 0 17px;
  border: 1px solid #cfc7d1;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? "#f5f3f5" : "#fff")};
  font-size: 17px;
  outline: none;
  &:focus {
    border-color: #a032be;
  }
`;
const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 22px;
`;
const ExtraGrid = styled.div`
  display: grid;
  grid-template-columns:
    minmax(330px, 1.45fr) minmax(200px, 1fr) minmax(120px, 0.6fr)
    minmax(120px, 0.6fr);
  column-gap: 32px;
  row-gap: 28px;
  align-items: end;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
const ChoiceGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const ActivityField = styled(Field)`
  grid-column: 1 / -1;
  align-items: start;
`;
const ActivityChoiceGroup = styled(ChoiceGroup)`
  gap: 12px;
`;
const Choice = styled.button`
  min-width: 98px;
  height: 43px;
  padding: 0 17px;
  border: 1px solid #d8b5e4;
  border-radius: 8px;
  background: ${({ $selected }) => ($selected ? "#f5e8fa" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#8c20aa" : "#222")};
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  cursor: pointer;
`;
const AdditionalChoice = styled(Choice)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
`;
const AdditionalInput = styled(Input)`
  text-align: center;
`;
const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Option = styled(Choice)`
  min-width: 130px;
`;
const Message = styled.p`
  margin: 14px 0 0;
  color: ${({ $error }) => ($error ? "#c62828" : "#248a3d")};
  text-align: right;
`;
const Status = styled.div`
  padding: 120px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
`;

const genderOptions = [
  { value: "MALE", label: GENDER_LABELS.MALE },
  { value: "FEMALE", label: GENDER_LABELS.FEMALE },
  { value: "NONE", label: GENDER_LABELS.NONE },
];
const activityOptions = Object.entries(ACTIVITY_LEVEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [additional, setAdditional] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getProfile({ signal: controller.signal })
      .then((data) => {
        setProfile(data);
        setPreferences({
          preferredCategories: [...(data.preferredCategories || [])],
          dislikedIngredients: [...(data.dislikedIngredients || [])],
          allergyFlags: [...(data.allergyFlags || [])],
        });
        setAdditional({
          gender: data.gender,
          birthDate: data.birthDate,
          height: data.height ?? "",
          weight: data.weight ?? "",
          activityLevel: data.activityLevel,
        });
        setStatus({ loading: false, error: "" });
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setStatus({ loading: false, error: error.message });
      });
    return () => controller.abort();
  }, []);

  const toggle = (field, value) =>
    setPreferences((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  const changeAdditional = (field, value) =>
    setAdditional((current) => ({ ...current, [field]: value }));
  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      await updateProfilePreferences({
        profile: additional,
        preferredCategories: preferences.preferredCategories,
        dislikedIngredients: preferences.dislikedIngredients,
        allergyFlags: preferences.allergyFlags,
      });
      navigate("/profile", { replace: true });
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  if (status.loading || status.error)
    return (
      <Page>
        <Header />
        <Status role={status.error ? "alert" : "status"}>
          {status.error || "프로필을 불러오고 있습니다..."}
        </Status>
      </Page>
    );
  return (
    <Page>
      <Header />
      <Main>
        <Top>
          <Title>내 프로필 수정</Title>
          <Actions>
            <Action type="button" onClick={() => navigate("/profile")}>
              취소
            </Action>
            <Action type="button" $primary disabled={saving} onClick={save}>
              {saving ? "저장 중..." : "저장"}
            </Action>
          </Actions>
        </Top>
        <Basic>
          <Avatar src={profileImage} alt="" />
          <Field>
            닉네임
            <Input
              value={profile.nickname || ""}
              onChange={(event) =>
                setProfile((current) => ({
                  ...current,
                  nickname: event.target.value,
                }))
              }
            />
            <span>닉네임 수정 API가 없어 서버에는 저장되지 않습니다.</span>
          </Field>
          <Vertical />
          <Field>
            이메일 (변경 불가)
            <Input value={profile.email || ""} disabled readOnly />
          </Field>
        </Basic>
        <Card>
          <SectionTitle>추가 정보</SectionTitle>
          <ExtraGrid>
            <Field as="div">
              성별
              <ChoiceGroup>
                {genderOptions.map((option) => (
                  <AdditionalChoice
                    key={option.value}
                    type="button"
                    $selected={additional.gender === option.value}
                    onClick={() => changeAdditional("gender", option.value)}
                  >
                    {option.label}
                  </AdditionalChoice>
                ))}
              </ChoiceGroup>
            </Field>
            <Field>
              생년월일
              <AdditionalInput
                type="date"
                value={additional.birthDate}
                onChange={(event) =>
                  changeAdditional("birthDate", event.target.value)
                }
              />
            </Field>
            <Field>
              키 (cm)
              <AdditionalInput
                type="number"
                min="0"
                value={additional.height}
                onChange={(event) =>
                  changeAdditional("height", event.target.value)
                }
              />
            </Field>
            <Field>
              체중 (kg)
              <AdditionalInput
                type="number"
                min="0"
                value={additional.weight}
                onChange={(event) =>
                  changeAdditional("weight", event.target.value)
                }
              />
            </Field>
            <ActivityField as="div">
              활동량
              <ActivityChoiceGroup>
                {activityOptions.map((option) => (
                  <AdditionalChoice
                    key={option.value}
                    type="button"
                    $selected={additional.activityLevel === option.value}
                    onClick={() =>
                      changeAdditional("activityLevel", option.value)
                    }
                  >
                    {option.label}
                  </AdditionalChoice>
                ))}
              </ActivityChoiceGroup>
            </ActivityField>
          </ExtraGrid>
        </Card>
        {signupOptions.map((group) => {
          const knownValues = new Set(
            group.options.map((option) => option.value),
          );
          const existingOnly = preferences[group.key]
            .filter((value) => !knownValues.has(value))
            .map((value) => ({ value, label: value }));
          return (
            <Card key={group.key}>
              <SectionTitle>{group.label}</SectionTitle>
              <Options>
                {[...group.options, ...existingOnly].map((option) => (
                  <Option
                    key={option.value}
                    type="button"
                    $selected={preferences[group.key].includes(option.value)}
                    aria-pressed={preferences[group.key].includes(option.value)}
                    onClick={() => toggle(group.key, option.value)}
                  >
                    {option.label}
                  </Option>
                ))}
              </Options>
            </Card>
          );
        })}
        {message && (
          <Message role="alert" $error>
            {message}
          </Message>
        )}
      </Main>
    </Page>
  );
}

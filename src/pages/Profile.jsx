import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  ACTIVITY_LEVEL_LABELS,
  GENDER_LABELS,
  getProfile,
} from "../api/profile";
import { signupOptions } from "../data/signupOptions";
import profileImage from "../assets/default-profile.png";
import removeIcon from "../assets/profile-remove.svg";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1266px, calc(100% - 48px));
  margin: auto;
  padding: 42px 0 106px;
`;
const Top = styled.div`
  min-height: 75px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
`;
const Title = styled.h1`
  margin: 0;
  font-size: 50px;
  line-height: 1.18;
  font-weight: 600;
`;
const Actions = styled.div`
  display: flex;
  gap: 12px;
`;
const ActionButton = styled.button`
  min-width: 139px;
  height: 64px;
  padding: 0 24px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: ${({ $primary }) => ($primary ? "#a032be" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#000")};
  font-size: 25px;
  font-weight: 700;
  cursor: pointer;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.section`
  min-height: 128px;
  padding: 18px 20px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
`;
const Identity = styled(Card)`
  min-height: 179px;
  padding: 25px 54px;
  display: flex;
  align-items: center;
  gap: 30px;
  @media (max-width: 600px) {
    padding-inline: 24px;
    gap: 20px;
  }
`;
const Avatar = styled.img`
  width: 121px;
  height: 121px;
  object-fit: contain;
  @media (max-width: 600px) {
    width: 88px;
    height: 88px;
  }
`;
const Divider = styled.div`
  width: 1px;
  height: 102px;
  background: #a032be;
`;
const UserInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 10px;
  strong,
  span {
    font-size: 25px;
    overflow-wrap: anywhere;
  }
`;
const Details = styled(Card)`
  min-height: 179px;
  padding: 25px 31px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 13px 24px;
`;
const Detail = styled.div`
  min-height: ${({ $large }) => ($large ? "75px" : "46px")};
  padding: ${({ $large }) => ($large ? "9px 21px" : "0 13px")};
  border: 1px solid #a032be;
  border-radius: 15px;
  display: ${({ $large }) => ($large ? "grid" : "flex")};
  align-items: center;
  align-content: center;
  gap: ${({ $large }) => ($large ? "3px" : "12px")};
  grid-column: span ${({ $large }) => ($large ? 2 : 3)};
  strong {
    color: #a032be;
    font-size: 20px;
  }
  span {
    font-size: 18px;
    overflow-wrap: anywhere;
  }
`;
const SectionTitle = styled.h2`
  margin: 0 0 20px 4px;
  font-size: 25px;
  line-height: 1.2;
`;
const Tags = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;
const Tag = styled.div`
  position: relative;
  min-width: 136px;
  min-height: 55px;
  padding: 8px ${({ $removable }) => ($removable ? "42px" : "18px")} 7px 18px;
  border: 1px solid ${({ $category }) => ($category ? "#df69ff" : "#8f8686")};
  border-radius: 10px;
  background: ${({ $category }) => ($category ? "#fff" : "#e9e7e7")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  strong {
    color: ${({ $category }) => ($category ? "#df69ff" : "#000")};
    font-size: 18px;
  }
  span {
    color: #5c5454;
    font-size: 16px;
  }
`;
const Remove = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #000;
  font-size: 25px;
  line-height: 20px;
  transform: translateY(-50%);
  cursor: pointer;
  display: grid;
  place-items: center;

  img {
    display: block;
    width: 13.5px;
    height: 13.5px;
  }
`;
const Options = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3deff;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const Option = styled.button`
  min-height: 40px;
  padding: 7px 16px;
  border: 1px solid ${({ $selected }) => ($selected ? "#a032be" : "#f3deff")};
  border-radius: 10px;
  background: ${({ $selected }) => ($selected ? "#a032be" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#5c5454")};
  font-size: 16px;
  cursor: pointer;
`;
const Empty = styled.p`
  margin: 12px 4px;
  color: #8f8686;
  font-size: 18px;
`;
const Status = styled.div`
  padding: 120px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
`;

const EXTRA_LABELS = { SOY: "대두", FROZEN: "냉동식품" };
function ProfileTag({ code, label, category, onRemove }) {
  return (
    <Tag $category={category} $removable={Boolean(onRemove)}>
      <strong>{label}</strong>
      <span>{code}</span>
      {onRemove && (
        <Remove type="button" onClick={onRemove} aria-label={`${label} 삭제`}>
          <img src={removeIcon} alt="" />
        </Remove>
      )}
    </Tag>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const labels = useMemo(() => {
    const entries = signupOptions.flatMap((section) =>
      section.options.map((option) => [option.value, option.label]),
    );
    return { ...Object.fromEntries(entries), ...EXTRA_LABELS };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getProfile({ signal: controller.signal })
      .then((data) => setState({ status: "success", data, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ status: "error", data: null, error: error.message });
      });
    return () => controller.abort();
  }, []);

  const beginEdit = () => navigate("/profile/edit");
  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
  };
  const saveEdit = () => {
    // TODO: 프로필 수정 API가 제공되면 현재 draft를 기존 명세 그대로 전달합니다.
    setState((current) => ({
      ...current,
      data: { ...current.data, ...draft },
    }));
    setDraft(null);
    setEditing(false);
  };
  const toggle = (field, code) =>
    setDraft((current) => ({
      ...current,
      [field]: current[field].includes(code)
        ? current[field].filter((item) => item !== code)
        : [...current[field], code],
    }));

  if (state.status !== "success")
    return (
      <Page>
        <Header />
        <Status role={state.status === "error" ? "alert" : "status"}>
          {state.status === "error"
            ? state.error
            : "프로필을 불러오고 있습니다..."}
        </Status>
      </Page>
    );

  const profile = state.data;
  const detailItems = [
    ["성별", GENDER_LABELS[profile.gender] || "미입력", false],
    ["생년월일", profile.birthDate || "미입력", false],
    ["키", profile.height == null ? "미입력" : `${profile.height} cm`, true],
    ["체중", profile.weight == null ? "미입력" : `${profile.weight} kg`, true],
    ["활동량", ACTIVITY_LEVEL_LABELS[profile.activityLevel] || "미입력", true],
  ];
  const displayed = editing ? { ...profile, ...draft } : profile;
  const sections = [
    ["preferredCategories", "선호하는 제품 카테고리", true],
    ["allergyFlags", "알레르기 유발 물질", false],
    ["dislikedIngredients", "피하고 싶은 성분", false, true],
  ];
  return (
    <Page>
      <Header />
      <Main>
        <Top>
          <Title>내 프로필</Title>
          <Actions>
            {editing ? (
              <>
                <ActionButton type="button" onClick={cancelEdit}>
                  취소
                </ActionButton>
                <ActionButton type="button" $primary onClick={saveEdit}>
                  저장
                </ActionButton>
              </>
            ) : (
              <ActionButton type="button" onClick={beginEdit}>
                수정
              </ActionButton>
            )}
          </Actions>
        </Top>
        <Grid>
          <Identity>
            <Avatar src={profileImage} alt="" />
            <Divider />
            <UserInfo>
              <strong>{profile.nickname}</strong>
              <span>{profile.email}</span>
            </UserInfo>
          </Identity>
          <Details aria-label="추가 프로필 정보">
            {/* TODO: 백엔드 프로필 필드가 제공되면 실제 데이터로 교체합니다. */}
            {detailItems.map(([label, value, large]) => (
              <Detail key={label} $large={large}>
                <strong>{label}</strong>
                <span>{value}</span>
              </Detail>
            ))}
          </Details>
          {sections.map(([field, title, category, wide]) => {
            const values = Array.isArray(displayed[field])
              ? displayed[field]
              : [];
            const group = signupOptions.find((option) => option.key === field);
            return (
              <Card key={field} $wide={wide}>
                <SectionTitle>{title}</SectionTitle>
                {values.length ? (
                  <Tags>
                    {values.map((code) => (
                      <ProfileTag
                        key={code}
                        code={code}
                        label={labels[code] || code}
                        category={category}
                        onRemove={
                          editing ? () => toggle(field, code) : undefined
                        }
                      />
                    ))}
                  </Tags>
                ) : (
                  <Empty>선택된 항목이 없습니다.</Empty>
                )}
                {editing && group && (
                  <Options aria-label={`${title} 선택`}>
                    {group.options.map((option) => (
                      <Option
                        key={option.value}
                        type="button"
                        $selected={values.includes(option.value)}
                        aria-pressed={values.includes(option.value)}
                        onClick={() => toggle(field, option.value)}
                      >
                        {option.label}
                      </Option>
                    ))}
                  </Options>
                )}
              </Card>
            );
          })}
        </Grid>
      </Main>
    </Page>
  );
}

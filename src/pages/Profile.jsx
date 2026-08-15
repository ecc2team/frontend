import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import Header from "../components/Header";
import { getProfile } from "../api/profile";
import { signupOptions } from "../data/signupOptions";
import profileImage from "../assets/zeropick-mark.png";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1267px, calc(100% - 48px));
  margin: 0 auto;
  padding: 49px 0 106px;
`;
const Top = styled.div`
  margin-bottom: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;
const Title = styled.h1`
  margin: 0;
  font-size: 50px;
  font-weight: 600;
`;
const EditButton = styled.button`
  width: 139px;
  height: 64px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #000;
  font-size: 25px;
  font-weight: 700;
  cursor: pointer;
`;
const Identity = styled.section`
  min-height: 179px;
  padding: 25px 54px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 30px;
`;
const Avatar = styled.img`
  width: 121px;
  height: 121px;
  object-fit: contain;
`;
const Divider = styled.div`
  width: 1px;
  height: 102px;
  background: #a032be;
`;
const UserInfo = styled.div`
  display: grid;
  gap: 10px;
  strong,
  span {
    font-size: 25px;
  }
`;
const PreferenceGrid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Section = styled.section`
  min-height: 179px;
  padding: 13px 32px 21px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  grid-column: ${({ $wide }) => ($wide ? "1 / -1" : "auto")};
  h2 {
    margin: 0 0 38px;
    font-size: 25px;
  }
`;
const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 2px;
`;
const Tag = styled.div`
  position: relative;
  min-width: max-content;
  height: 75px;
  padding: 9px 48px 8px 18px;
  border: 1px solid ${({ $category }) => ($category ? "#df69ff" : "#8f8686")};
  border-radius: 10px;
  background: ${({ $category }) => ($category ? "#fff" : "#e9e7e7")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  strong {
    color: ${({ $category }) => ($category ? "#df69ff" : "#000")};
    font-size: 20px;
  }
  span {
    color: #5c5454;
    font-size: 16px;
  }
`;
const Remove = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5c5454;
  font-size: 26px;
  line-height: 20px;
  transform: translateY(-50%);
  cursor: pointer;
`;
const Empty = styled.p`
  margin: 9px 0;
  color: #8f8686;
  font-size: 18px;
`;
const Status = styled.div`
  padding: 120px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
`;

const EXTRA_LABELS = {
  SOY: "대두",
  FROZEN: "냉동식품",
};

function ProfileTag({ code, label, category, onRemove }) {
  return (
    <Tag $category={category}>
      <strong>{label}</strong>
      <span>{code}</span>
      <Remove type="button" onClick={onRemove} aria-label={`${label} 삭제`}>
        ×
      </Remove>
    </Tag>
  );
}

export default function Profile() {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });

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
        if (error.name !== "AbortError") {
          setState({ status: "error", data: null, error: error.message });
        }
      });
    return () => controller.abort();
  }, []);

  const removePreference = (field, code) => {
    setState((current) => ({
      ...current,
      data: {
        ...current.data,
        [field]: current.data[field].filter((item) => item !== code),
      },
    }));
  };

  if (state.status !== "success") {
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
  }

  const profile = state.data;
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
          <EditButton type="button">수정</EditButton>
        </Top>
        <Identity>
          <Avatar src={profileImage} alt="" />
          <Divider />
          <UserInfo>
            <strong>{profile.nickname}</strong>
            <span>{profile.email}</span>
          </UserInfo>
        </Identity>
        <PreferenceGrid>
          {sections.map(([field, title, category, wide]) => {
            const values = Array.isArray(profile[field]) ? profile[field] : [];
            return (
              <Section key={field} $wide={wide}>
                <h2>{title}</h2>
                {values.length ? (
                  <Tags>
                    {values.map((code) => (
                      <ProfileTag
                        key={code}
                        code={code}
                        label={labels[code] || code}
                        category={category}
                        onRemove={() => removePreference(field, code)}
                      />
                    ))}
                  </Tags>
                ) : (
                  <Empty>선택된 항목이 없습니다.</Empty>
                )}
              </Section>
            );
          })}
        </PreferenceGrid>
      </Main>
    </Page>
  );
}

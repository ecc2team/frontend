import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { loginWithGoogle, loginWithKakao } from "../api/auth";

const Page = styled.div`
  min-height: 100vh;
  background: #f9f4fd;
`;
const Card = styled.main`
  width: min(560px, calc(100% - 40px));
  margin: 100px auto;
  padding: 52px 36px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  text-align: center;
`;
const Title = styled.h1`
  margin: 0;
  color: #a032be;
  font-size: 28px;
`;
const Message = styled.p`
  margin: 18px 0 0;
  color: ${({ $error }) => ($error ? "#c62828" : "#5c5454")};
  line-height: 1.6;
`;
const LoginLink = styled(Link)`
  width: 180px;
  height: 48px;
  margin: 28px auto 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-decoration: none;
`;

export default function OAuthCallback({ provider }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const authCode = searchParams.get("code");
  const displayedError =
    error || (!authCode ? "로그인 인증 코드가 없습니다. 다시 로그인해주세요." : "");

  useEffect(() => {
    let active = true;

    if (!authCode) {
      return () => {
        active = false;
      };
    }

    const callback = provider === "kakao" ? loginWithKakao : loginWithGoogle;
    callback(authCode)
      .then((result) => {
        if (!active) return;
        const data = result?.data;

        if (!data?.accessToken || typeof data.isNewUser !== "boolean") {
          throw new Error("소셜 로그인 응답 형식이 올바르지 않습니다.");
        }

        localStorage.setItem("accessToken", data.accessToken);
        if (data.userId != null) {
          localStorage.setItem("userId", String(data.userId));
        }

        if (data.isNewUser) {
          navigate("/signup", {
            replace: true,
            state: {
              socialOnboarding: {
                email: data.email ?? "",
                nickname: data.nickname ?? "",
              },
            },
          });
          return;
        }

        navigate("/", { replace: true });
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "소셜 로그인에 실패했습니다.");
        }
      });

    return () => {
      active = false;
    };
  }, [authCode, navigate, provider]);

  return (
    <Page>
      <Header />
      <Card>
        <Title>
          {displayedError ? "로그인에 실패했습니다" : "로그인 처리 중..."}
        </Title>
        <Message
          $error={Boolean(displayedError)}
          role={displayedError ? "alert" : "status"}
        >
          {displayedError || "소셜 계정 정보를 확인하고 있습니다."}
        </Message>
        {displayedError && (
          <LoginLink to="/login">로그인 페이지로 이동</LoginLink>
        )}
      </Card>
    </Page>
  );
}

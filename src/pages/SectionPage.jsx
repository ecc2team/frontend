import styled from "@emotion/styled";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;

const Content = styled.main`
  width: min(1174px, calc(100% - 40px));
  min-height: 480px;
  margin: 72px auto;
  padding: 64px;
  border: 1px solid #cb71ff;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.86);
  text-align: center;

  @media (max-width: 600px) {
    margin-top: 40px;
    padding: 48px 24px;
  }
`;

const Title = styled.h1`
  margin: 0 0 20px;
  color: #000;
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.15;
`;

const Description = styled.p`
  margin: 0 0 40px;
  color: #5c5454;
  font-size: 22px;
  line-height: 1.5;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  height: 56px;
  padding: 0 28px;
  border-radius: 50px;
  background: #df69ff;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
`;

function SectionPage({ title, showQuery = false }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  return (
    <Page>
      <Header />
      <Content>
        <Title>{title}</Title>
        <Description>
          {showQuery && query
            ? `“${query}”에 대한 검색 결과 페이지입니다.`
            : `${title} 페이지입니다. 상세 콘텐츠는 준비 중입니다.`}
        </Description>
        <HomeLink to="/">홈으로 돌아가기</HomeLink>
      </Content>
    </Page>
  );
}

export default SectionPage;

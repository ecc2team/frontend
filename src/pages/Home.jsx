import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import heroImage from "../assets/zeropick-hero.png";

const categories = [
  ["음료수", "/categories/drinks"],
  ["단백질 바", "/categories/protein-bars"],
  ["간식류", "/categories/snacks"],
  ["냉동식품", "/categories/frozen-food"],
  ["소스류", "/categories/sauces"],
  ["기타", "/categories/other"],
];

const Page = styled.div`
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
  overflow-x: hidden;
`;

const Main = styled.main`
  max-width: 1440px;
  min-height: 847px;
  margin: 0 auto;
  padding: 14px 9.1% 118px;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    padding-inline: 6%;
  }

  @media (max-width: 760px) {
    padding: 28px 20px 64px;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.18fr;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Copy = styled.div`
  padding-top: 78px;
  position: relative;
  z-index: 1;

  @media (max-width: 760px) {
    padding-top: 10px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font:
    700 64px/1.15 Inter,
    Arial,
    sans-serif;
  letter-spacing: -2.6px;

  span {
    color: #df69ff;
  }

  @media (max-width: 1100px) {
    font-size: 52px;
  }

  @media (max-width: 760px) {
    font-size: clamp(42px, 12vw, 56px);
  }
`;

const Description = styled.p`
  margin: 23px 0 47px;
  color: #5c5454;
  font:
    700 24px/1.25 Inter,
    Arial,
    sans-serif;
  letter-spacing: -0.7px;

  @media (max-width: 760px) {
    margin: 22px 0 30px;
    font-size: 20px;
  }
`;

const HomeSearchBar = styled(SearchBar)`
  width: 547px;
  max-width: 100%;
`;

const Visual = styled.div`
  height: 450px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 760px) {
    height: auto;
    margin-top: 32px;

    img {
      aspect-ratio: 3 / 2;
    }
  }
`;

const CategoryPanel = styled.nav`
  margin-top: 94px;
  min-height: 157px;
  padding: 28px 75px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  border: 1px solid #cb71ff;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);

  @media (max-width: 1100px) {
    padding-inline: 42px;
    gap: 20px;
  }

  @media (max-width: 760px) {
    margin-top: 48px;
    padding: 28px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px 18px;
  }

  a {
    color: #000;
    font-size: 30px;
    line-height: 1.2;
    text-decoration: none;
    text-align: center;
    white-space: nowrap;

    @media (max-width: 1100px) {
      font-size: 24px;
    }

    @media (max-width: 760px) {
      font-size: 22px;
    }
  }
`;

function Home() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(query ? `/search?query=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <Page>
      <Header />
      <Main>
        <Hero>
          <Copy>
            <Title>
              성분을 알면,
              <br />
              <span>선택</span>이 바뀝니다.
            </Title>
            <Description>
              나에게 맞는 제로 식품을 찾고
              <br />
              건강한 선택을 시작해보세요!
            </Description>
            <HomeSearchBar onSearch={handleSearch} />
          </Copy>
          <Visual>
            <img src={heroImage} alt="다양한 제로 식품" />
          </Visual>
        </Hero>
        <CategoryPanel aria-label="제품 카테고리">
          {categories.map(([label, path]) => (
            <Link to={path} key={path}>
              {label}
            </Link>
          ))}
        </CategoryPanel>
      </Main>
    </Page>
  );
}

export default Home;

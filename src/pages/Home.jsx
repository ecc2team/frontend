import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

import logoImg from '../assets/logo.png';
import heroImg from '../assets/hero.png';

const Home = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      // 검색 페이지로 이동하면서 쿼리 파라미터 전달
      navigate(`/search?keyword=${searchKeyword}`);
    }
  };

  return (
    <PageWrapper>
      {/* 1. 헤더 영역 */}
      <Header>
        <Logo to="/">
          <img src={logoImg} alt="ZeroPick Logo" />
        </Logo>

        <Nav>
          <NavLink to="/category">카테고리</NavLink>
          <NavLink to="/recommend">추천</NavLink>
          <NavLink to="/ranking">랭킹</NavLink>
          <NavLink to="/compare">비교함</NavLink>
          <NavLink to="/group-buy">공구</NavLink>
          <NavLink to="/history">기록</NavLink>
        </Nav>

        <AuthButtons>
          <LoginButton to="/login">로그인</LoginButton>
          <SignupButton to="/signup">회원가입</SignupButton>
        </AuthButtons>
      </Header>

      {/* 2. 메인 히어로 영역 */}
      <MainContainer>
        <HeroSection>
          <HeroContent>
            <HeroText>
              <h1>
                성분을 알면,
                <br />
                <span>선택</span>이 바뀝니다.
              </h1>
              <p>
                나에게 맞는 제로 식품을 찾고
                <br />
                건강한 선택을 시작해보세요!
              </p>

              <SearchForm onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="제품명, 성분을 검색해보세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit">
                  {/* 돋보기 아이콘 (유니코드 또는 SVG로 대체 가능) */}
                  🔍
                </button>
              </SearchForm>
            </HeroText>

            <HeroImage>
              <img src={heroImg} alt="Zero Products" />
            </HeroImage>
          </HeroContent>
        </HeroSection>

        {/* 3. 카테고리 바로가기 영역 */}
        <CategorySection>
          <CategoryList>
            <CategoryItem to="/category/beverage">음료수</CategoryItem>
            <CategoryItem to="/category/protein-bar">단백질 바</CategoryItem>
            <CategoryItem to="/category/snack">간식류</CategoryItem>
            <CategoryItem to="/category/frozen">냉동식품</CategoryItem>
            <CategoryItem to="/category/sauce">소스류</CategoryItem>
            <CategoryItem to="/category/etc">기타</CategoryItem>
          </CategoryList>
        </CategorySection>
      </MainContainer>

      <BottomSpacer />
    </PageWrapper>
  );
};

export default Home;

// --- Emotion Styled Components ---

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Pretendard', sans-serif; /* 폰트는 프로젝트에 맞게 변경하세요 */
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  height: 40px;
  img {
    height: 100%;
    object-fit: contain;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  &:hover {
    color: #a855f7;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const LoginButton = styled(Link)`
  text-decoration: none;
  padding: 8px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

const SignupButton = styled(Link)`
  text-decoration: none;
  padding: 8px 20px;
  background-color: #d946ef; /* 로고와 비슷한 보라색 계열 */
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const HeroSection = styled.section`
  width: 100%;
  background-color: #fcfaff; /* 연한 보라색 배경 */
  display: flex;
  justify-content: center;
  padding: 60px 20px 100px; /* 아래 카테고리 박스를 위해 하단 여백을 넉넉히 줌 */
`;

const MainContainer = styled.main`
  width: 100%;
  max-width: 1200px; /* 헤더 너비와 맞춤 */
  background-color: #fcfaff; /* 연한 보라색 배경 */
  border-radius: 24px; /* 피그마처럼 배경 모서리를 둥글게 */
  padding: 60px 60px; /* 상하/좌우 안쪽 여백 넉넉하게 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeroText = styled.div`
  flex: 1;
  h1 {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 20px;
    color: #111;
    span {
      color: #d946ef; /* 보라색 강조 */
    }
  }
  p {
    font-size: 18px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 40px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 450px;
  border: 1px solid #e0d4f5;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;

  input {
    flex: 1;
    padding: 15px 20px;
    border: none;
    outline: none;
    font-size: 15px;
    &::placeholder {
      color: #aaa;
    }
  }

  button {
    background-color: #b026ff;
    border: none;
    padding: 0 20px;
    cursor: pointer;
    color: white;
    font-size: 18px;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  img {
    max-width: 100%;
    height: auto;
  }
`;

const CategorySection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin-top: -50px; /* 히어로 섹션 위로 살짝 걸치게 설정 */
  padding: 0 20px;
  z-index: 10;
`;

const CategoryList = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px 40px;
  border: 1px solid #f0e6ff;
`;

const CategoryItem = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  &:hover {
    color: #b026ff;
  }
`;

const BottomSpacer = styled.div`
  height: 50px; /* 맨 아래 스크롤 여유 공간 */
`;

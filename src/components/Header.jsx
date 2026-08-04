import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import logoMark from "../assets/zeropick-mark.png";
import logoWordmark from "../assets/zeropick-wordmark.png";

const navItems = [
  ["카테고리", "/categories"],
  ["추천", "/recommendations"],
  ["랭킹", "/ranking"],
  ["비교함", "/compare"],
  ["공구", "/group-buy"],
  ["기록", "/records"],
];

const Shell = styled.header`
  position: relative;
  z-index: 10;
  display: block;
  height: 177px;
  background: #fff;

  @media (max-width: 900px) {
    height: 104px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 38px 0 25px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    padding-right: 24px;
  }

  @media (max-width: 900px) {
    padding: 0 20px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  flex: 0 0 266px;
  text-decoration: none;

  @media (max-width: 1180px) {
    flex-basis: 230px;
  }

  @media (max-width: 900px) {
    flex-basis: auto;
  }

  img:first-of-type {
    width: 129px;
    height: 129px;
    object-fit: contain;
  }

  img:last-of-type {
    width: 161px;
    height: 77px;
    margin-left: -24px;
    object-fit: contain;
  }

  @media (max-width: 900px) {
    img:first-of-type {
      width: 76px;
      height: 76px;
    }
    img:last-of-type {
      width: 128px;
      height: 61px;
      margin-left: -14px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex: 1;

  @media (max-width: 1180px) {
    gap: 24px;
  }

  @media (max-width: 900px) {
    display: none;
  }

  a {
    color: #000;
    font-size: 25px;
    line-height: 1.2;
    text-decoration: none;
    white-space: nowrap;

    @media (max-width: 1180px) {
      font-size: 21px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 30px;
  margin-left: 24px;

  @media (max-width: 1180px) {
    gap: 12px;
    margin-left: 16px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Action = styled(Link)`
  height: 64px;
  padding: 0 34px;
  border: 1px solid #df6bff;
  border-radius: 50px;
  background: ${({ $primary }) => ($primary ? "#df69ff" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#000")};
  font:
    700 25px/1 Inter,
    Arial,
    sans-serif;
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  @media (max-width: 1180px) {
    padding: 0 22px;
    font-size: 20px;
  }
`;

const MobileMenu = styled.button`
  display: none;
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 30px;
  cursor: pointer;

  @media (max-width: 900px) {
    display: block;
  }
`;

function Header() {
  return (
    <Shell>
      <Inner>
        <Brand to="/" aria-label="ZeroPick 홈">
          <img src={logoMark} alt="" />
          <img src={logoWordmark} alt="ZeroPick" />
        </Brand>
        <Nav aria-label="주요 메뉴">
          {navItems.map(([label, path]) => (
            <Link to={path} key={path}>
              {label}
            </Link>
          ))}
        </Nav>
        <Actions>
          <Action to="/login">로그인</Action>
          <Action to="/signup" $primary>
            회원가입
          </Action>
        </Actions>
        <MobileMenu type="button" aria-label="메뉴 열기">
          ☰
        </MobileMenu>
      </Inner>
    </Shell>
  );
}

export default Header;

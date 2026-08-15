import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
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

const categoryItems = [
  ["음료수", "/categories/drinks"],
  ["단백질 바", "/categories/protein-bars"],
  ["간식류", "/categories/snacks"],
  ["냉동식품", "/categories/frozen-food"],
  ["소스류", "/categories/sauces"],
  ["기타", "/categories/other"],
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

const CategoryMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover > div,
  &:focus-within > div {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0);
    pointer-events: auto;
  }
`;

const CategoryDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  width: 190px;
  padding-top: 16px;
  visibility: hidden;
  opacity: 0;
  transform: translate(-50%, -8px);
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    visibility 0.16s ease;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 50%;
    width: 12px;
    height: 12px;
    border-top: 1px solid #f3deff;
    border-left: 1px solid #f3deff;
    background: #fff;
    transform: translateX(-50%) rotate(45deg);
  }
`;

const CategoryDropdownPanel = styled.div`
  padding: 8px 0;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(82 48 91 / 14%);
  overflow: hidden;

  a {
    display: block;
    padding: 11px 20px;
    color: #332d33;
    font-size: 18px;
    line-height: 24px;
    text-align: left;

    &:hover,
    &:focus-visible {
      background: #f3deff;
      color: #8b25a8;
      outline: none;
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

const actionStyles = ({ $primary }) => `
  height: 64px;
  padding: 0 34px;
  border: 1px solid #df6bff;
  border-radius: 50px;
  background: ${$primary ? "#df69ff" : "#fff"};
  color: ${$primary ? "#fff" : "#000"};
  font: 700 25px/1 Inter, Arial, sans-serif;
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

const Action = styled(Link, {
  shouldForwardProp: (prop) => prop !== "$primary",
})`
  ${actionStyles}
`;

const LogoutButton = styled.button`
  ${actionStyles}
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
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    navigate("/", { replace: true });
  };

  return (
    <Shell>
      <Inner>
        <Brand to="/" aria-label="ZeroPick 홈">
          <img src={logoMark} alt="" />
          <img src={logoWordmark} alt="ZeroPick" />
        </Brand>
        <Nav aria-label="주요 메뉴">
          {navItems.map(([label, path]) =>
            path === "/categories" ? (
              <CategoryMenu key={path}>
                <Link to={path}>{label}</Link>
                <CategoryDropdown>
                  <CategoryDropdownPanel>
                    {categoryItems.map(([categoryLabel, categoryPath]) => (
                      <Link to={categoryPath} key={categoryPath}>
                        {categoryLabel}
                      </Link>
                    ))}
                  </CategoryDropdownPanel>
                </CategoryDropdown>
              </CategoryMenu>
            ) : (
              <Link to={path} key={path}>
                {label}
              </Link>
            ),
          )}
        </Nav>
        <Actions>
          {isLoggedIn ? (
            <>
              <Action to="/profile">마이 페이지</Action>
              <LogoutButton type="button" $primary onClick={logout}>
                로그아웃
              </LogoutButton>
            </>
          ) : (
            <>
              <Action to="/login">로그인</Action>
              <Action to="/signup" $primary>
                회원가입
              </Action>
            </>
          )}
        </Actions>
        <MobileMenu type="button" aria-label="메뉴 열기">
          ☰
        </MobileMenu>
      </Inner>
    </Shell>
  );
}

export default Header;

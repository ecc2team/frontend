import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import logoMark from "../assets/zeropick-mark.png";
import logoWordmark from "../assets/zeropick-wordmark.png";
import defaultProfile from "../assets/default-profile.png";
import { logout as requestLogout } from "../api/auth";
import useCategories from "../hooks/useCategories";
import { categoryPath } from "../data/categories";

const navItems = [
  ["카테고리", "/categories"],
  ["추천", "/recommendations"],
  ["랭킹", "/ranking"],
  ["비교함", "/compare"],
  ["최근 조회 상품", "/recent-products"],
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
  width: 220px;
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
    white-space: normal; 
    word-break: keep-all;

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

const ProfileLink = styled(Link)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 70px;
  display: block;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  &:focus-visible {
    outline: 3px solid #df69ff;
    outline-offset: 3px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;

  @media (max-width: 900px) {
    display: block;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(20 12 22 / 48%);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (min-width: 901px) {
    display: none;
  }
`;

const MobilePanel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 101;
  width: min(320px, 80vw);
  height: 100vh;
  height: 100dvh;
  padding: 26px 22px 32px;
  background: #fff;
  box-shadow: -8px 0 28px rgb(82 48 91 / 18%);
  box-sizing: border-box;
  overflow-y: auto;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition:
    transform 0.3s ease,
    visibility 0.3s ease;

  @media (min-width: 901px) {
    display: none;
  }
`;

const MobilePanelHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
`;

const MobileCloseButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #332d33;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;

  > a,
  > button {
    width: 100%;
    min-height: 52px;
    padding: 12px 10px;
    border: 0;
    border-bottom: 1px solid #f3deff;
    background: transparent;
    color: #332d33;
    font: 700 18px/1.4 Inter, Arial, sans-serif;
    text-align: left;
    text-decoration: none;
    box-sizing: border-box;
    cursor: pointer;
  }

  > a:hover,
  > a:focus-visible,
  > button:hover,
  > button:focus-visible {
    background: #fbf4ff;
    color: #8b25a8;
    outline: none;
  }
`;

const MobileCategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::after {
    content: "⌄";
    font-size: 22px;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0")});
    transition: transform 0.2s ease;
  }
`;

const MobileCategoryList = styled.div`
  display: ${({ $open }) => ($open ? "block" : "none")};
  padding: 6px 0 8px 14px;
  background: #fbf4ff;

  a {
    display: block;
    padding: 11px 14px;
    color: #5c5454;
    font-size: 16px;
    line-height: 1.4;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      color: #8b25a8;
      outline: none;
    }
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 28px;

  a,
  button {
    width: 100%;
    min-height: 48px;
    padding: 0 18px;
    border: 1px solid #df6bff;
    border-radius: 24px;
    background: #fff;
    color: #332d33;
    font: 700 17px/1 Inter, Arial, sans-serif;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
  }

  > :last-child {
    background: #df69ff;
    color: #fff;
  }
`;

function Header() {
  const navigate = useNavigate();
  const categories = useCategories();
  const menuButtonRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("accessToken")),
  );

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoryOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const handleDesktopChange = (event) => {
      if (event.matches) closeMobileMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isMobileMenuOpen]);

  const logout = async () => {
    closeMobileMenu();
    try {
      await requestLogout();
    } catch {
      // 서버 로그아웃 실패 시에도 로컬 인증 상태는 logout()에서 정리됩니다.
    } finally {
      setIsLoggedIn(false);
      navigate("/", { replace: true });
    }
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
                    {categories.map((category) => (
                      <Link
                        to={categoryPath(category.code)}
                        key={category.code}
                      >
                        {category.name}
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
              <ProfileLink to="/profile" aria-label="마이 페이지">
                <img src={defaultProfile} alt="" />
              </ProfileLink>
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
        <MobileMenuButton
          ref={menuButtonRef}
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          ☰
        </MobileMenuButton>
      </Inner>
      <MobileOverlay $open={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobilePanel
        id="mobile-navigation"
        $open={isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        aria-hidden={!isMobileMenuOpen}
      >
        <MobilePanelHeader>
          <MobileCloseButton
            type="button"
            aria-label="메뉴 닫기"
            onClick={closeMobileMenu}
          >
            ×
          </MobileCloseButton>
        </MobilePanelHeader>
        <MobileNav aria-label="모바일 주요 메뉴">
          <MobileCategoryButton
            type="button"
            $open={isMobileCategoryOpen}
            aria-expanded={isMobileCategoryOpen}
            aria-controls="mobile-category-list"
            onClick={() => setIsMobileCategoryOpen((open) => !open)}
          >
            카테고리
          </MobileCategoryButton>
          <MobileCategoryList
            id="mobile-category-list"
            $open={isMobileCategoryOpen}
          >
            {categories.map((category) => (
              <Link
                to={categoryPath(category.code)}
                key={category.code}
                onClick={closeMobileMenu}
              >
                {category.name}
              </Link>
            ))}
          </MobileCategoryList>
          {navItems.slice(1).map(([label, path]) => (
            <Link to={path} key={path} onClick={closeMobileMenu}>
              {label}
            </Link>
          ))}
        </MobileNav>
        <MobileActions>
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={closeMobileMenu}>
                프로필
              </Link>
              <button type="button" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu}>
                로그인
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                회원가입
              </Link>
            </>
          )}
        </MobileActions>
      </MobilePanel>
    </Shell>
  );
}

export default Header;

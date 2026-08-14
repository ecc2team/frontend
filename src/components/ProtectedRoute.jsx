import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  padding: 20px;
  background: rgb(0 0 0 / 28%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  width: min(390px, 100%);
  padding: 34px 30px 26px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #a032be;
  text-align: center;
  box-shadow: 0 10px 32px rgb(71 33 80 / 18%);
`;

const Message = styled.p`
  margin: 0 0 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
`;

const ConfirmButton = styled.button`
  width: 112px;
  height: 43px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #a032be;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: #f9f0fc;
    outline: none;
  }
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  if (isLoggedIn) return children;

  const moveToLogin = () => {
    navigate("/login", {
      replace: true,
      state: { from: location.pathname },
    });
  };

  return (
    <Overlay>
      <Dialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="login-required-message"
      >
        <Message id="login-required-message">
          로그인이 필요한 서비스입니다.
          <br />
          로그인해 주세요.
        </Message>
        <ConfirmButton type="button" onClick={moveToLogin} autoFocus>
          확인
        </ConfirmButton>
      </Dialog>
    </Overlay>
  );
}

export default ProtectedRoute;

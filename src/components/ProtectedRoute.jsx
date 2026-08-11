import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AUTH_ALERT_LOCK = "zeropick-auth-alert-lock";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (isLoggedIn) return;

    if (!sessionStorage.getItem(AUTH_ALERT_LOCK)) {
      sessionStorage.setItem(AUTH_ALERT_LOCK, "true");
      window.alert("로그인이 필요한 서비스입니다. 로그인해 주세요.");
      window.setTimeout(() => sessionStorage.removeItem(AUTH_ALERT_LOCK), 1000);
    }

    navigate("/login", {
      replace: true,
      state: { from: location.pathname },
    });
  }, [isLoggedIn, location.pathname, navigate]);

  if (!isLoggedIn) return null;
  return children;
}

export default ProtectedRoute;

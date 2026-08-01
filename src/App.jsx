import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SectionPage from "./pages/SectionPage";

const sections = [
  ["/categories", "카테고리"],
  ["/recommendations", "추천"],
  ["/ranking", "랭킹"],
  ["/compare", "비교함"],
  ["/group-buy", "공구"],
  ["/records", "기록"],
  ["/signup", "회원가입"],
  ["/auth/kakao", "카카오 로그인"],
  ["/auth/google", "Google 로그인"],
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {sections
          .filter(([path]) => path !== "/signup")
          .map(([path, title]) => (
            <Route
              key={path}
              path={path}
              element={<SectionPage title={title} />}
            />
          ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

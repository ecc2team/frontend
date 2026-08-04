import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SectionPage from "./pages/SectionPage";

const routes = [
  ["/categories", "카테고리"],
  ["/recommendations", "추천"],
  ["/ranking", "랭킹"],
  ["/compare", "비교함"],
  ["/group-buy", "공구"],
  ["/records", "기록"],
  ["/login", "로그인"],
  ["/signup", "회원가입"],
  ["/categories/drinks", "음료수"],
  ["/categories/protein-bars", "단백질 바"],
  ["/categories/snacks", "간식류"],
  ["/categories/frozen-food", "냉동식품"],
  ["/categories/sauces", "소스류"],
  ["/categories/other", "기타"],
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SectionPage title="검색 결과" showQuery />} />
        {routes.map(([path, title]) => (
          <Route key={path} path={path} element={<SectionPage title={title} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

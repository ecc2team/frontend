import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SectionPage from "./pages/SectionPage";
import ProductSearchResult from "./pages/ProductSearchResult";
import ProductDetail from "./pages/ProductDetail";
import ComparisonList from "./pages/ComparisonList";
import Profile from "./pages/Profile";
import ProductComparison from "./pages/ProductComparison";
import ProtectedRoute from "./components/ProtectedRoute";
import Records from "./pages/Records";

const routes = [
  ["/categories", "카테고리"],
  ["/recommendations", "추천"],
  ["/ranking", "랭킹"],
  ["/compare", "비교함"],
  ["/group-buy", "공구"],
  ["/records", "기록"],
  ["/auth/kakao", "카카오 로그인"],
  ["/auth/google", "Google 로그인"],
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<ProductSearchResult />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <ComparisonList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare/products"
          element={
            <ProtectedRoute>
              <ProductComparison />
            </ProtectedRoute>
          }
        />
        {routes
          .filter(([path]) => path !== "/compare" && path !== "/records")
          .map(([path, title]) => (
            <Route
              key={path}
              path={path}
              element={<SectionPage title={title} />}
            />
          ))}
        <Route
          path="/records"
          element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

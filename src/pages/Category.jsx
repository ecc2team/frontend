import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import ProductSearchCard from "../components/ProductSearchCard";
import {
  getCategories,
  getCategoryBestProducts,
  getCategoryProducts,
} from "../api/categories";

const PAGE_SIZE = 20;
const LEGACY_CATEGORY_CODES = {
  drinks: "DRINK",
  "protein-bars": "PROTEIN_BAR",
  snacks: "SNACK",
  "frozen-food": "FROZEN_FOOD",
  sauces: "SAUCE",
  other: "OTHER",
};

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1158px, calc(100% - 40px));
  margin: 0 auto;
  padding: 14px 0 90px;
`;
const Categories = styled.div`
  width: min(1028px, 100%);
  min-height: 81px;
  margin: 0 auto 17px;
  padding: 14px 16px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: clamp(12px, 3.45vw, 50px);
  overflow-x: auto;
`;
const Category = styled.button`
  flex: 0 0 auto;
  padding: 14px 22px;
  border: 1px solid #df6bff;
  border-radius: 50px;
  background: ${({ $active }) => ($active ? "#a032be" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`;
const SortPanel = styled.div`
  width: min(1028px, 100%);
  min-height: 68px;
  margin: 0 auto 17px;
  padding: 13px 38px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 35px;
`;
const SortLabel = styled.label`
  font-size: 18px;
  font-weight: 700;
`;
const SortSelect = styled.select`
  width: min(309px, 100%);
  height: 40px;
  padding: 0 18px;
  border: 1px solid #df6bff;
  border-radius: 10px;
  background: #fff;
  color: #332d33;
  font-size: 17px;
`;
const SectionTitle = styled.h1`
  margin: 24px 0 0;
  font-size: 20px;
`;
const Status = styled.div`
  padding: 72px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 30px;
  margin-top: 32px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }
  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
`;

export default function CategoryPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCode = searchParams.get("category");
  const parsedPage = Number(searchParams.get("page") || 0);
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
  const sort = searchParams.get("sort") || "recommended";
  const [categories, setCategories] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [state, setState] = useState({
    status: "loading",
    content: [],
    best: [],
    pageInfo: null,
    error: "",
  });
  const resultsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getCategories({ signal: controller.signal })
      .then((items) => {
        setCategories(items);
        const legacySlug = location.pathname.split("/").filter(Boolean).at(-1);
        const legacyCode = LEGACY_CATEGORY_CODES[legacySlug];
        const initial =
          items.find(({ code }) => code === requestedCode)?.code ||
          items.find(({ code }) => code === legacyCode)?.code ||
          items[0]?.code ||
          "";
        setSelectedCode(initial);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setState((previous) => ({
            ...previous,
            status: "error",
            error: error.message,
          }));
      });
    return () => controller.abort();
  }, [location.pathname, requestedCode]);

  useEffect(() => {
    if (!selectedCode) return undefined;
    const controller = new AbortController();
    let active = true;
    queueMicrotask(() => {
      if (active)
        setState((previous) => ({
          ...previous,
          status: "loading",
          error: "",
        }));
    });
    Promise.all([
      getCategoryProducts(selectedCode, page, PAGE_SIZE, sort, {
        signal: controller.signal,
      }),
      getCategoryBestProducts(selectedCode, 5, { signal: controller.signal }),
    ])
      .then(([products, best]) => {
        if (active)
          setState({
            status: "success",
            content: products.content,
            best,
            pageInfo: products.pageInfo,
            error: "",
          });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setState({
            status: "error",
            content: [],
            best: [],
            pageInfo: null,
            error: error.message,
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedCode, page, sort]);

  const selectCategory = (code) => {
    setSelectedCode(code);
    setSearchParams({ category: code, page: "0", sort });
  };
  const selectSort = (nextSort) =>
    setSearchParams({ category: selectedCode, page: "0", sort: nextSort });
  const changePage = (nextPage) => {
    setSearchParams({
      category: selectedCode,
      page: String(nextPage),
      sort,
    });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Page>
      <Header />
      <Main>
        <Categories aria-label="제품 카테고리">
          {categories.map((category) => (
            <Category
              key={category.code}
              type="button"
              $active={category.code === selectedCode}
              onClick={() => selectCategory(category.code)}
            >
              {category.name}
            </Category>
          ))}
        </Categories>
        <SortPanel>
          <SortLabel htmlFor="category-sort">정렬 기준</SortLabel>
          <SortSelect
            id="category-sort"
            value={sort}
            onChange={(event) => selectSort(event.target.value)}
          >
            <option value="recommended">추천순</option>
            <option value="latest">최신순</option>
            <option value="name">가나다순</option>
            <option value="popular">비교함 인기순</option>
            <option value="views">조회수순</option>
          </SortSelect>
        </SortPanel>
        {state.status === "loading" && (
          <Status role="status">상품을 불러오고 있어요...</Status>
        )}
        {state.status === "error" && <Status role="alert">{state.error}</Status>}
        {state.status === "success" && (
          <>
            <SectionTitle>베스트 상품</SectionTitle>
            {state.best.length > 0 ? (
              <Grid>
                {state.best.map((product) => (
                  <ProductSearchCard key={product.productId} product={product} />
                ))}
              </Grid>
            ) : (
              <Status>베스트 상품이 없습니다.</Status>
            )}
            <SectionTitle ref={resultsRef}>상품 목록</SectionTitle>
            {state.content.length > 0 ? (
              <>
                <Grid>
                  {state.content.map((product) => (
                    <ProductSearchCard key={product.productId} product={product} />
                  ))}
                </Grid>
                <Pagination
                  totalPages={state.pageInfo.totalPages}
                  currentPage={state.pageInfo.pageNumber}
                  onChange={changePage}
                />
              </>
            ) : (
              <Status>해당 카테고리의 상품이 없습니다.</Status>
            )}
          </>
        )}
      </Main>
    </Page>
  );
}

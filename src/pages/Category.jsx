import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import ProductSearchCard from "../components/ProductSearchCard";
import {
  getCategories,
  getCategoryBestProducts,
  getCategoryProducts,
} from "../api/categories";
import {
  categoryPath,
  isSupportedCategoryCode,
  selectSupportedCategories,
} from "../data/categories";

const PAGE_SIZE = 20;

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
  justify-content: space-evenly;
  gap: 24px;
  overflow-x: auto;
`;
const Category = styled.button`
  flex: 1 0 auto;
  max-width: 280px;
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
  margin: 24px auto 17px;
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
const SectionStatus = styled(Status)`
  padding: 38px 20px;
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

const getRouteCategoryCode = (pathname) => {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (!segment || segment.toLowerCase() === "categories") return "";
  return decodeURIComponent(segment).toUpperCase();
};

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeCode = getRouteCategoryCode(location.pathname);
  const legacyQueryCode = searchParams.get("category")?.toUpperCase() || "";
  const parsedPage = Number(searchParams.get("page") || 0);
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
  const sort = searchParams.get("sort") || "recommended";
  const [categories, setCategories] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [productsState, setProductsState] = useState({
    status: "idle",
    content: [],
    pageInfo: null,
    error: "",
  });
  const [bestState, setBestState] = useState({
    status: "idle",
    content: [],
    error: "",
  });
  const resultsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getCategories({ signal: controller.signal })
      .then((items) => {
        const supported = selectSupportedCategories(items);
        setCategories(supported);
        setCategoryError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCategoryError(error.message);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    let active = true;
    const requestedCode = isSupportedCategoryCode(routeCode)
      ? routeCode
      : isSupportedCategoryCode(legacyQueryCode)
        ? legacyQueryCode
        : categories[0].code;

    queueMicrotask(() => {
      if (active) setSelectedCode(requestedCode);
    });

    if (routeCode !== requestedCode) {
      navigate(
        `${categoryPath(requestedCode)}?page=${page}&sort=${encodeURIComponent(sort)}`,
        { replace: true },
      );
    }

    return () => {
      active = false;
    };
  }, [categories, legacyQueryCode, navigate, page, routeCode, sort]);

  useEffect(() => {
    if (!selectedCode) return undefined;
    const controller = new AbortController();
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      setProductsState((previous) => ({
        ...previous,
        status: "loading",
        error: "",
      }));
    });

    getCategoryProducts(selectedCode, page, PAGE_SIZE, sort, {
      signal: controller.signal,
    })
      .then((products) => {
        if (active)
          setProductsState({
            status: "success",
            content: products.content,
            pageInfo: products.pageInfo,
            error: "",
          });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setProductsState({
            status: "error",
            content: [],
            pageInfo: null,
            error: error.message,
          });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedCode, page, sort]);

  useEffect(() => {
    if (!selectedCode) return undefined;
    const controller = new AbortController();
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      setBestState((previous) => ({
        ...previous,
        status: "loading",
        error: "",
      }));
    });

    getCategoryBestProducts(selectedCode, 5, {
      signal: controller.signal,
    })
      .then((products) => {
        if (active)
          setBestState({ status: "success", content: products, error: "" });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setBestState({
            status: "error",
            content: [],
            error: error.message,
          });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedCode]);

  const navigateToCategory = (code, nextPage = 0, nextSort = sort) => {
    navigate(
      `${categoryPath(code)}?page=${nextPage}&sort=${encodeURIComponent(nextSort)}`,
    );
  };
  const selectedCategory = categories.find(({ code }) => code === selectedCode);

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
              onClick={() => navigateToCategory(category.code)}
            >
              {category.name}
            </Category>
          ))}
        </Categories>

        {categoryError ? (
          <Status role="alert">{categoryError}</Status>
        ) : (
          <>
            <SectionTitle>{selectedCategory?.name || "카테고리"} BEST 5</SectionTitle>
            {bestState.status === "loading" && (
              <SectionStatus role="status">베스트 상품을 불러오고 있습니다...</SectionStatus>
            )}
            {bestState.status === "error" && (
              <SectionStatus role="alert">
                베스트 상품을 불러오지 못했습니다.
              </SectionStatus>
            )}
            {bestState.status === "success" &&
              (bestState.content.length > 0 ? (
                <Grid>
                  {bestState.content.map((product) => (
                    <ProductSearchCard key={product.productId} product={product} />
                  ))}
                </Grid>
              ) : (
                <SectionStatus>베스트 상품이 없습니다.</SectionStatus>
              ))}

            <SortPanel>
              <SortLabel htmlFor="category-sort">정렬 기준</SortLabel>
              <SortSelect
                id="category-sort"
                value={sort}
                onChange={(event) =>
                  navigateToCategory(selectedCode, 0, event.target.value)
                }
              >
                <option value="recommended">추천순</option>
                <option value="latest">최신순</option>
                <option value="name">가나다순</option>
                <option value="views">조회수순</option>
              </SortSelect>
            </SortPanel>

            <SectionTitle ref={resultsRef}>전체 상품</SectionTitle>
            {productsState.status === "loading" && (
              <Status role="status">상품을 불러오고 있습니다...</Status>
            )}
            {productsState.status === "error" && (
              <Status role="alert">{productsState.error}</Status>
            )}
            {productsState.status === "success" &&
              (productsState.content.length > 0 ? (
                <>
                  <Grid>
                    {productsState.content.map((product) => (
                      <ProductSearchCard key={product.productId} product={product} />
                    ))}
                  </Grid>
                  {productsState.pageInfo && (
                    <Pagination
                      totalPages={productsState.pageInfo.totalPages}
                      currentPage={productsState.pageInfo.pageNumber}
                      onChange={(nextPage) => {
                        navigateToCategory(selectedCode, nextPage);
                        resultsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    />
                  )}
                </>
              ) : (
                <Status>해당 카테고리에 상품이 없습니다.</Status>
              ))}
          </>
        )}
      </Main>
    </Page>
  );
}

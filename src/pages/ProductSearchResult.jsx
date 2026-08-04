import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import ProductSearchCard from "../components/ProductSearchCard";
import SearchBar from "../components/SearchBar";
import { searchProducts } from "../api/products";

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
const SearchWrap = styled.div`
  width: min(1028px, 100%);
  margin: 0 auto 16px;
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
const Category = styled.span`
  flex: 0 0 auto;
  padding: 14px 22px;
  border: 1px solid #df6bff;
  border-radius: 50px;
  background: ${({ $active }) => ($active ? "#a032be" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
`;
const ResultPanel = styled.section`
  min-height: 68px;
  padding: 16px 50px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
`;
const Count = styled.h1`
  margin: 0;
  font-size: 25px;
  line-height: 35px;
  font-weight: 400;
`;
const Status = styled.div`
  padding: 72px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
  line-height: 1.6;
`;
const Retry = styled.button`
  margin-top: 18px;
  padding: 12px 24px;
  border: 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
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
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;
const categories = [
  "전체",
  "음료수",
  "단백질 바",
  "간식류",
  "냉동식품",
  "소스류",
  "기타",
];

export default function ProductSearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").trim();
  const parsedPage = Number(searchParams.get("page") || 0);
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
  const retryKey = searchParams.get("retry") || "";
  const [state, setState] = useState({
    status: "idle",
    content: [],
    pageInfo: null,
    error: "",
  });
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!query) return undefined;
    const controller = new AbortController();
    let active = true;
    queueMicrotask(() => {
      if (active)
        setState((previous) => ({ ...previous, status: "loading", error: "" }));
    });
    searchProducts({ query, page, size: 20, signal: controller.signal })
      .then((data) => {
        if (active)
          setState({
            status: "success",
            content: data.content,
            pageInfo: data.pageInfo,
            error: "",
          });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setState({
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
  }, [query, page, retryKey]);

  const search = (nextQuery) =>
    setSearchParams(nextQuery ? { query: nextQuery } : {});
  const changePage = (nextPage) => {
    setSearchParams({ query, page: String(nextPage) });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const retry = () =>
    setSearchParams({ query, page: String(page), retry: String(Date.now()) });
  const displayStatus = query ? state.status : "idle";
  return (
    <Page>
      <Header />
      <Main>
        <SearchWrap>
          <SearchBar key={query} initialQuery={query} onSearch={search} large />
        </SearchWrap>
        <Categories aria-label="제품 카테고리">
          {categories.map((category) => (
            <Category key={category} $active={category === "전체"}>
              {category}
            </Category>
          ))}
        </Categories>
        <ResultPanel ref={resultsRef}>
          <Count>
            {query
              ? `‘${query}’ 검색 결과 ${state.pageInfo?.totalElements ?? 0}개`
              : "검색어를 입력해주세요"}
          </Count>
        </ResultPanel>
        {displayStatus === "idle" && (
          <Status>
            제품명이나 성분을 입력하면 검색 결과를 확인할 수 있어요.
          </Status>
        )}
        {displayStatus === "loading" && (
          <Status role="status">제품을 검색하고 있어요...</Status>
        )}
        {displayStatus === "error" && (
          <Status role="alert">
            {state.error}
            <br />
            <Retry type="button" onClick={retry}>
              다시 시도
            </Retry>
          </Status>
        )}
        {displayStatus === "success" && state.content.length === 0 && (
          <Status>
            ‘{query}’에 맞는 제품을 찾을 수 없어요.
            <br />
            다른 검색어로 다시 검색해보세요.
          </Status>
        )}
        {displayStatus === "success" && state.content.length > 0 && (
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
        )}
      </Main>
    </Page>
  );
}

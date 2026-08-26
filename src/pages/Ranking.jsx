import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getCategoryBestProducts } from "../api/categories";
import useCategories from "../hooks/useCategories";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #242024;
`;
const Main = styled.main`
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 90px;
`;
const Title = styled.h1`
  margin: 0 0 30px;
  font-size: clamp(32px, 4vw, 46px);
`;
const Sections = styled.div`
  display: grid;
  gap: 24px;
`;
const Section = styled.section`
  padding: 28px;
  border: 1px solid #dfb8f3;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(91 39 105 / 7%);
`;
const SectionTitle = styled.h2`
  margin: 0 0 20px;
  color: #7b278f;
  font-size: 26px;
`;
const List = styled.ol`
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  list-style: none;
`;
const Product = styled(Link)`
  min-height: 76px;
  padding: 14px 18px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  color: inherit;
  text-decoration: none;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 18px;
  transition: border-color 0.16s ease, transform 0.16s ease;

  &:hover {
    border-color: #a032be;
    transform: translateY(-2px);
  }
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 2px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 54px minmax(0, 1fr) auto;
    gap: 10px;
  }
`;
const Rank = styled.strong`
  color: #a032be;
  font-size: 22px;
`;
const Name = styled.strong`
  min-width: 0;
  font-size: 18px;
  overflow-wrap: anywhere;
`;
const Score = styled.strong`
  color: #a032be;
  font-size: 18px;
`;
const Views = styled.span`
  color: #6d6670;
  white-space: nowrap;
  @media (max-width: 760px) { grid-column: 2; }
`;
const Warning = styled.span`
  padding: 6px 10px;
  border-radius: 20px;
  background: ${({ $warning }) => ($warning ? "#fff0f0" : "#eff9f1")};
  color: ${({ $warning }) => ($warning ? "#b42318" : "#287a3d")};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  @media (max-width: 760px) { grid-column: 3; grid-row: 2; }
`;
const Status = styled.div`
  min-height: 110px;
  display: grid;
  place-items: center;
  color: #6d6670;
  text-align: center;
`;

export default function Ranking() {
  const categories = useCategories();
  const [rankings, setRankings] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const requests = categories.map(async ({ code }) => {
      try {
        const products = await getCategoryBestProducts(code, 5, {
          signal: controller.signal,
        });
        if (active) {
          setRankings((current) => ({
            ...current,
            [code]: { status: "success", products, error: "" },
          }));
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setRankings((current) => ({
            ...current,
            [code]: {
              status: "error",
              products: [],
              error: error.message,
            },
          }));
        }
      }
    });

    void Promise.allSettled(requests);

    return () => {
      active = false;
      controller.abort();
    };
  }, [categories]);

  return (
    <Page>
      <Header />
      <Main>
        <Title>카테고리별 TOP 5</Title>
        <Sections>
          {categories.map(({ code, name }) => {
            const state = rankings[code] ?? {
              status: "loading",
              products: [],
              error: "",
            };
            return (
              <Section key={code}>
                <SectionTitle>{name}</SectionTitle>
                {state.status === "loading" && (
                  <Status role="status">랭킹을 불러오고 있습니다...</Status>
                )}
                {state.status === "error" && (
                  <Status role="alert">
                    {state.error || "랭킹을 불러오지 못했습니다."}
                  </Status>
                )}
                {state.status === "success" && state.products.length === 0 && (
                  <Status>등록된 랭킹 상품이 없습니다.</Status>
                )}
                {state.status === "success" && state.products.length > 0 && (
                  <List>
                    {state.products.map((product) => (
                      <li key={product.productId}>
                        <Product to={`/products/${encodeURIComponent(product.productId)}`}>
                          <Rank>{product.rank}위</Rank>
                          <Name>{product.productName}</Name>
                          <Score>{Number(product.score)}점</Score>
                          <Views>조회수 {Number(product.viewCount).toLocaleString("ko-KR")}</Views>
                          <Warning $warning={Boolean(product.warningAdditive)}>
                            {product.warningAdditive ? "주의 첨가물 있음" : "주의 첨가물 없음"}
                          </Warning>
                        </Product>
                      </li>
                    ))}
                  </List>
                )}
              </Section>
            );
          })}
        </Sections>
      </Main>
    </Page>
  );
}

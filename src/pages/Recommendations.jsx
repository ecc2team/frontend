import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Header from "../components/Header";
import ProductSearchCard from "../components/ProductSearchCard";
import { getRecommendations } from "../api/recommendations";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;

const Main = styled.main`
  width: min(1158px, calc(100% - 40px));
  margin: 0 auto;
  padding: 38px 0 100px;
`;

const Heading = styled.div`
  margin-bottom: 30px;
  padding-bottom: 22px;
  border-bottom: 1px solid #a032be;

  h1 {
    margin: 0 0 8px;
    font-size: 32px;
  }

  p {
    margin: 0;
    color: #5c5454;
    font-size: 15px;
  }
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 30px;

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

const Status = styled.div`
  padding: 90px 20px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  color: #5c5454;
  font-size: 18px;
  text-align: center;
`;

const Retry = styled.button`
  margin-top: 18px;
  padding: 11px 22px;
  border: 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;

export default function Recommendations() {
  const [retryKey, setRetryKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    content: [],
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    getRecommendations({ size: 20, signal: controller.signal })
      .then((content) => {
        if (active) setState({ status: "success", content, error: "" });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setState({ status: "error", content: [], error: error.message });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [retryKey]);

  return (
    <Page>
      <Header />
      <Main>
        <Heading>
          <h1>맞춤 추천</h1>
          <p>나의 취향과 설정을 반영한 상품을 확인해보세요.</p>
        </Heading>
        {state.status === "loading" && (
          <Status role="status">추천 상품을 불러오고 있어요...</Status>
        )}
        {state.status === "error" && (
          <Status role="alert">
            {state.error}
            <br />
            <Retry type="button" onClick={() => setRetryKey(Date.now())}>
              다시 시도
            </Retry>
          </Status>
        )}
        {state.status === "success" && state.content.length === 0 && (
          <Status>추천할 상품이 없습니다.</Status>
        )}
        {state.status === "success" && state.content.length > 0 && (
          <Grid>
            {state.content.map((product) => (
              <ProductSearchCard
                key={product.productId}
                product={product}
                recommendation
              />
            ))}
          </Grid>
        )}
      </Main>
    </Page>
  );
}

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getRecentProducts } from "../api/recent-products";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 38px 0 100px;
`;
const Heading = styled.div`
  margin-bottom: 30px;
  padding-bottom: 22px;
  border-bottom: 1px solid #a032be;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  h1 {
    margin: 0;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 680px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled(Link)`
  min-width: 0;
  min-height: 265px;
  padding: 18px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  color: #332d33;
  text-decoration: none;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgb(71 33 80 / 14%);
  }
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 3px;
  }
`;
const ProductVisual = styled.div`
  height: 128px;
  border-radius: 8px;
  background: #f9f4fd;
  display: grid;
  place-items: center;
  color: #a032be;
  font-size: 42px;
  font-weight: 700;
`;
const ProductName = styled.h2`
  margin: 14px 0 10px;
  font-size: 19px;
  overflow-wrap: anywhere;
`;
const Tags = styled.div`
  min-height: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  span {
    padding: 5px 9px;
    border-radius: 20px;
    background: #f3deff;
    color: #7b278f;
    font-size: 12px;
    font-weight: 700;
  }
`;
const Meta = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  time {
    color: #8f8686;
    font-size: 12px;
  }
`;
const Risk = styled.span`
  padding: 5px 9px;
  border-radius: 20px;
  background: ${({ $level }) =>
    $level === "SAFE"
      ? "#e9f9ee"
      : $level === "CAUTION"
        ? "#fff4df"
        : "#fff0f0"};
  color: ${({ $level }) =>
    $level === "SAFE"
      ? "#248a3d"
      : $level === "CAUTION"
        ? "#b66a00"
        : "#b42318"};
  font-size: 12px;
  font-weight: 700;
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

const TAG_LABELS = {
  LOW_CALORIE: "저칼로리",
  ZERO_SUGAR: "무설탕",
  HIGH_PROTEIN: "고단백",
  LOW_SODIUM: "저나트륨",
};
const RISK_LABELS = {
  SAFE: "안전",
  CAUTION: "주의",
  RISKY: "위험",
};

const formatViewedAt = (value) => {
  if (!value) return "조회 시간 정보 없음";
  const [date, time = ""] = value.split("T");
  return `${date.replaceAll("-", ".")} ${time.slice(0, 5)}`.trim();
};

export default function RecentProducts() {
  const [retryKey, setRetryKey] = useState(0);
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    getRecentProducts({ signal: controller.signal })
      .then((data) => {
        if (active) setState({ status: "success", data, error: "" });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setState({ status: "error", data: null, error: error.message });
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
          <h1>최근 조회 상품</h1>
          <p>최근 확인한 상품을 다시 살펴보세요.</p>
        </Heading>
        {state.status === "loading" && (
          <Status role="status">최근 조회 상품을 불러오고 있어요...</Status>
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
        {state.status === "success" && state.data.content.length === 0 && (
          <Status>최근 조회한 상품이 없습니다.</Status>
        )}
        {state.status === "success" && state.data.content.length > 0 && (
          <>
            <p>총 {state.data.totalElements}개</p>
            <Grid>
              {state.data.content.map((product) => (
                <Card
                  key={`${product.productId}-${product.viewedAt}`}
                  to={`/products/${encodeURIComponent(product.productId)}`}
                >
                  <ProductVisual aria-hidden="true">Z</ProductVisual>
                  <ProductName>{product.productName}</ProductName>
                  <Tags>
                    {product.dietaryTags.map((tag) => (
                      <span key={tag}>{TAG_LABELS[tag] || tag}</span>
                    ))}
                  </Tags>
                  <Meta>
                    <Risk $level={product.riskLevel}>
                      {RISK_LABELS[product.riskLevel] || product.riskLevel}
                    </Risk>
                    <time dateTime={product.viewedAt}>
                      {formatViewedAt(product.viewedAt)}
                    </time>
                  </Meta>
                </Card>
              ))}
            </Grid>
          </>
        )}
      </Main>
    </Page>
  );
}

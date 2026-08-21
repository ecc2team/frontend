import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import IngredientAnalysis from "../components/IngredientAnalysis";
import NutritionInfo from "../components/NutritionInfo";
import { getProductDetail } from "../api/products";
import { addConsumptionRecord } from "../api/records";
import { addToComparisonList } from "../api/comparison-list";
import { recordRecentProduct } from "../api/recent-products";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1339px, calc(100% - 40px));
  margin: 0 auto;
  padding: 35px 0 32px;
  display: grid;
  gap: 16px;
`;
const Panel = styled.section`
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
`;
const Summary = styled(Panel)`
  min-height: 271px;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: 330px 1fr 329px;
  align-items: center;
  gap: 46px;
  @media (max-width: 980px) {
    grid-template-columns: 240px 1fr;
    gap: 28px;
  }
  .score {
    justify-self: center;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;
const ProductVisual = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
const ImageBox = styled.div`
  width: 317px;
  max-width: 100%;
  height: 200px;
  border-radius: 8px;
  background: #f5eff7;
  display: grid;
  place-items: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
    transform: none;
  }
  .fallback {
    color: #8f8686;
  }
`;
const OutlineButton = styled.button`
  height: 50px;
  padding: 0 23px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #a032be;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`;
const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;
const RecordButton = styled(OutlineButton)`
  background: #a032be;
  color: #fff;
`;
const ProductInfo = styled.div`
  min-width: 0;
  .view-count {
    margin: 0 0 7px;
    color: #8f8686;
    font-size: 13px;
  }
  h1 {
    margin: 0 0 12px;
    font-size: 30px;
    overflow-wrap: anywhere;
  }
  .id {
    margin: 0 0 18px;
    color: #5c5454;
    font-size: 15px;
  }
`;
const ActionError = styled.p`
  margin: 0;
  color: #c62828;
  font-size: 13px;
  text-align: center;
`;
const ProductSummary = styled.p`
  width: min(470px, 100%);
  min-height: 33px;
  margin: 0;
  padding: 9px 18px;
  border-radius: 18px;
  background: #f3deff;
  color: #6d2281;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
  overflow-wrap: anywhere;
`;
const ScoreCard = styled.div`
  width: 329px;
  max-width: 100%;
  height: 237px;
  border-radius: 10px;
  background: #f9f4fd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
  color: #5c5454;
  font-size: 20px;
  text-align: center;
`;
const ScoreLabel = styled.div`
  width: 100%;
  text-align: center;
`;
const Ring = styled.div`
  position: relative;
  width: 169px;
  height: 167px;
  margin-top: 8px;
  margin-right: auto;
  margin-left: auto;
  svg {
    position: absolute;
    inset: 0;
    width: 169px;
    height: 167px;
  }
  .track,
  .progress {
    fill: none;
    stroke-width: 10;
  }
  .track {
    stroke: #e8ddf4;
  }
  .progress {
    stroke: #a032be;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dasharray 0.35s ease;
  }
  .value {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    color: #a032be;
    font-size: 42px;
    font-weight: 700;
    span {
      color: rgba(0, 0, 0, 0.75);
      font-size: 20px;
      font-weight: 500;
    }
  }
`;
const Nutrition = styled(Panel)`
  min-height: 149px;
  padding: 10px 38px 7px;
  h2 {
    margin: 0;
    font-size: 20px;
  }
`;
const Analysis = styled(Panel)`
  padding: 14px 21px 24px;
  min-height: ${({ $expanded }) => ($expanded ? "550px" : "344px")};
`;
const Footer = styled(Panel)`
  min-height: 117px;
  padding: 14px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  h2 {
    margin: 0;
    font-size: 20px;
    white-space: nowrap;
    flex: 0 0 auto;
  }
  .actions {
    display: flex;
    gap: 36px;
    align-items: center;
  }
  @media (max-width: 650px) {
    align-items: flex-start;
    flex-direction: column;
  }
  .actions {
    width: auto;
    margin-left: auto;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;
const SearchAgain = styled(Link)`
  height: 50px;
  padding: 0 53px;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const Status = styled.div`
  padding: 120px 20px;
  text-align: center;
  color: #5c5454;
  font-size: 20px;
`;

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    status: "loading",
    product: null,
    error: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    getProductDetail(productId, { signal: controller.signal })
      .then((product) => {
        if (!active) return;
        setActionError("");
        setState({ status: "success", product, error: "" });

        if (localStorage.getItem("accessToken")) {
          recordRecentProduct(product.productId).catch((error) => {
            if (active) setActionError(error.message);
          });
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError")
          setState({ status: "error", product: null, error: error.message });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [productId]);
  if (state.status === "loading")
    return (
      <Page>
        <Header />
        <Status role="status">상품 정보를 불러오고 있어요...</Status>
      </Page>
    );
  if (state.status === "error")
    return (
      <Page>
        <Header />
        <Status role="alert">
          {state.error}
          <br />
          <SearchAgain to="/search">검색으로 돌아가기</SearchAgain>
        </Status>
      </Page>
    );
  const product = state.product;
  const handleRecord = () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/records");
      return;
    }

    addConsumptionRecord(product, new Date());
    navigate("/records");
  };
  const handleAddToComparison = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/compare");
      return;
    }

    setActionError("");
    try {
      await addToComparisonList(product);
      navigate("/compare");
    } catch (error) {
      setActionError(error.message);
    }
  };
  const productSummary = product.summary || "주요 성분 정보 없음";
  return (
    <Page>
      <Header />
      <Main>
        <Summary>
          <ProductVisual>
            <ImageBox>
              {product.imageUrl && !imageFailed ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="fallback">제품 이미지 없음</span>
              )}
            </ImageBox>
            <ProductActions>
              <OutlineButton type="button" onClick={handleAddToComparison}>
                비교함 담기
              </OutlineButton>
              <RecordButton type="button" onClick={handleRecord}>
                기록하기
              </RecordButton>
            </ProductActions>
            {actionError && <ActionError role="status">{actionError}</ActionError>}
          </ProductVisual>
          <ProductInfo>
            <p className="view-count">조회수: {product.viewCount}번</p>
            <h1>{product.productName}</h1>
            <p className="id">제품 ID {product.productId}</p>
            <ProductSummary>{productSummary}</ProductSummary>
          </ProductInfo>
          <ScoreCard className="score">
            <ScoreLabel>ZeroPick 점수</ScoreLabel>
            <Ring>
              <svg viewBox="0 0 169 167" aria-hidden="true">
                <circle className="track" cx="84.5" cy="83.5" r="74" />
                <circle
                  className="progress"
                  cx="84.5"
                  cy="83.5"
                  r="74"
                  pathLength="100"
                  strokeDasharray={`${product.score} 100`}
                />
              </svg>
              <div className="value">
                {product.score}
                <span>점</span>
              </div>
            </Ring>
          </ScoreCard>
        </Summary>
        <Nutrition>
          <h2>영양 정보 (1개 기준)</h2>
          <NutritionInfo nutrition={product.nutrition} />
        </Nutrition>
        <Analysis $expanded={expanded}>
          <IngredientAnalysis
            analysis={product.ingredientsAnalysis}
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
          />
        </Analysis>
        <Footer>
          <h2>이런 제품은 어때요?</h2>
          <div className="actions">
            <OutlineButton type="button" onClick={handleAddToComparison}>
              비교함 담기
            </OutlineButton>
            <SearchAgain to="/search">다시 검색하기</SearchAgain>
          </div>
        </Footer>
      </Main>
    </Page>
  );
}

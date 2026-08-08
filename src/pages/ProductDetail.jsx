import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import IngredientAnalysis from "../components/IngredientAnalysis";
import NutritionInfo from "../components/NutritionInfo";
import { getProductDetail } from "../api/products";
import scoreBase from "../assets/score-ring-base.svg";
import scoreProgress from "../assets/score-ring-progress.svg";
import scoreInner from "../assets/score-ring-inner.svg";

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
    display: block;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
  .score {
    justify-self: stretch;
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
    object-fit: contain;
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
const ProductInfo = styled.div`
  min-width: 0;
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
const Tags = styled.div`
  display: grid;
  gap: 16px;
  width: min(236px, 100%);
  span {
    min-height: 33px;
    padding: 7px 20px;
    border-radius: 50px;
    background: #f3deff;
    color: #6d2281;
    font-size: 15px;
    text-align: center;
    overflow-wrap: anywhere;
  }
  span:nth-of-type(2) {
    background: #d6ffe1;
    color: #005530;
  }
  span:nth-of-type(3) {
    background: #a89eff;
    color: #1f0042;
  }
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
  padding-top: 8px;
  color: #5c5454;
  font-size: 20px;
`;
const Ring = styled.div`
  position: relative;
  width: 169px;
  height: 167px;
  margin-top: 8px;
  img {
    position: absolute;
    inset: 0;
    width: 169px;
    height: 167px;
  }
  img:last-of-type {
    width: 150px;
    height: 148px;
    inset: 10px 9px;
  }
  .value {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #a032be;
    font-size: 42px;
    font-weight: 700;
    small {
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
  const [state, setState] = useState({
    status: "loading",
    product: null,
    error: "",
  });
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    getProductDetail(productId, { signal: controller.signal })
      .then((product) => {
        if (active) setState({ status: "success", product, error: "" });
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
  const tags = Array.isArray(product.keyIngredients)
    ? product.keyIngredients.slice(0, 3)
    : [];
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
            <OutlineButton type="button">비교함 담기</OutlineButton>
          </ProductVisual>
          <ProductInfo>
            <h1>{product.productName}</h1>
            <p className="id">제품 ID {product.productId}</p>
            <Tags>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              {tags.length === 0 && <span>주요 성분 정보 없음</span>}
            </Tags>
          </ProductInfo>
          <ScoreCard className="score">
            ZeroPick 점수
            <Ring>
              <img src={scoreBase} alt="" />
              <img src={scoreProgress} alt="" />
              <img src={scoreInner} alt="" />
              <div className="value">
                {product.grade}
                <small>등급</small>
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
            <OutlineButton type="button">비교함 담기</OutlineButton>
            <SearchAgain to="/search">다시 검색하기</SearchAgain>
          </div>
        </Footer>
      </Main>
    </Page>
  );
}

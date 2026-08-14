import { useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 11px 11px 14px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  color: #000;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 18px rgba(160, 50, 190, 0.16);
  }
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 3px;
  }
`;
const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 143/112;
  border-radius: 6px;
  background: #f5eff7;
  overflow: hidden;
  display: grid;
  place-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .fallback {
    padding: 12px;
    color: #8f8686;
    font-size: 13px;
    text-align: center;
  }
`;
const Name = styled.h2`
  min-width: 0;
  margin: 8px 0 4px;
  font-size: 16px;
  line-height: 1.3;
  overflow-wrap: anywhere;
`;
const Meta = styled.p`
  margin: 0;
  color: #5c5454;
  font-size: 12px;
  line-height: 1.4;
`;
const Grade = styled.strong`
  margin-top: 4px;
  color: #a032be;
  font-size: 16px;
`;
const Ingredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
  span {
    max-width: 100%;
    padding: 4px 7px;
    border-radius: 12px;
    background: #f3deff;
    color: #6d2281;
    font-size: 11px;
    overflow-wrap: anywhere;
  }
`;
const Warning = styled.p`
  margin: 8px 0 0;
  padding: 6px;
  border-radius: 6px;
  background: ${({ $warning }) => ($warning ? "#fff0f0" : "#eff9f1")};
  color: ${({ $warning }) => ($warning ? "#b42318" : "#287a3d")};
  font-size: 11px;
  font-weight: 700;
`;
const Allergy = styled.p`
  margin: 5px 0 0;
  padding: 6px;
  border-radius: 6px;
  background: ${({ $hasAllergy }) => ($hasAllergy ? "#fff6e7" : "#eff9f1")};
  color: ${({ $hasAllergy }) => ($hasAllergy ? "#a15c00" : "#287a3d")};
  font-size: 11px;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

export default function ProductSearchCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const calories =
    product.calories == null ? "칼로리 정보 없음" : `${product.calories} kcal`;
  const weight = product.weight || "함량 정보 없음";
  return (
    <Card
      to={`/products/${encodeURIComponent(product.productId)}`}
      aria-label={`${product.productName} 상세 보기`}
    >
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
      <Name>{product.productName}</Name>
      <Meta>
        {calories} · {weight}
      </Meta>
      <Grade>{product.grade}등급</Grade>
      <Ingredients>
        {Array.isArray(product.keyIngredients) &&
          product.keyIngredients.map((ingredient) => (
            <span key={ingredient}>{ingredient}</span>
          ))}
      </Ingredients>
      <Warning $warning={product.warningAdditive}>
        {product.warningAdditive ? "주의 첨가물이 있어요" : "주의 첨가물 없음"}
      </Warning>
      <Allergy $hasAllergy={product.allergicIngredients?.length > 0}>
        {product.allergicIngredients?.length > 0
          ? `알레르기 유발 성분: ${product.allergicIngredients.join(", ")}`
          : "알레르기 유발 성분 없음"}
      </Allergy>
    </Card>
  );
}

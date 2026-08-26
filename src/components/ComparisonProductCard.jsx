import styled from "@emotion/styled";
import removeCircle from "../assets/compare-remove-circle.svg";
import removeLine from "../assets/compare-remove-line.svg";
import ProductFallbackImage from "./ProductImage";

const Card = styled.article`
  position: relative;
  width: 100%;
  height: 263px;
  border: 1px solid #8f8686;
  border-radius: 10px;
  background: ${({ $disabled }) => ($disabled ? "#eeeeee" : "#fff")};
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.58 : 1)};
  filter: ${({ $disabled }) => ($disabled ? "grayscale(0.75)" : "none")};
  transition:
    opacity 0.2s ease,
    filter 0.2s ease,
    background 0.2s ease;
`;

const Select = styled.input`
  position: absolute;
  top: 12px;
  left: 13px;
  z-index: 2;
  width: 25px;
  height: 25px;
  margin: 0;
  accent-color: #a032be;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 13px;
  z-index: 2;
  width: 25px;
  height: 25px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  img:first-of-type {
    width: 25px;
    height: 25px;
  }

  img:last-of-type {
    position: absolute;
    top: 12px;
    left: 4.5px;
    width: 16px;
    height: 1px;
  }
`;

const ProductImage = styled.div`
  height: 188px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 31px 40px 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const EmptyImage = styled.div`
  width: 104px;
  height: 122px;
  border-radius: 8px;
  background: #f3eff5;
  color: #8f8797;
  font-size: 12px;
  display: grid;
  place-items: center;
  text-align: center;
`;

const Name = styled.h2`
  margin: 0 16px 9px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Badges = styled.div`
  display: flex;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
`;

const Badge = styled.span`
  min-width: 72px;
  height: 20px;
  padding: 0 10px;
  border-radius: 10px;
  background: ${({ $tone }) => ($tone === "warning" ? "#ff9c60" : "#63c78b")};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
`;

function ComparisonProductCard({
  product,
  selected,
  disabled,
  onSelect,
  onRemove,
}) {
  const badges = product.badges ?? product.tags ?? [];

  return (
    <Card $disabled={disabled} aria-disabled={disabled}>
      <Select
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(product.productId)}
        aria-label={`${product.productName} 선택`}
      />
      <RemoveButton
        type="button"
        onClick={() => onRemove(product.productId)}
        aria-label={`${product.productName} 비교함에서 삭제`}
      >
        <img src={removeCircle} alt="" />
        <img src={removeLine} alt="" />
      </RemoveButton>
      <ProductImage>
        <ProductFallbackImage
          product={product}
          fallback={<EmptyImage>제품 이미지 없음</EmptyImage>}
        />
      </ProductImage>
      <Name>{product.productName}</Name>
      <Badges>
        {badges.slice(0, 2).map((badge, index) => {
          const label = typeof badge === "string" ? badge : badge.label;
          const tone = typeof badge === "string" ? "normal" : badge.tone;
          return (
            <Badge key={`${label}-${index}`} $tone={tone}>
              {label}
            </Badge>
          );
        })}
      </Badges>
    </Card>
  );
}

export default ComparisonProductCard;

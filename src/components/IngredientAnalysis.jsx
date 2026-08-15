import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import IngredientDetailModal from "./IngredientDetailModal";
import safeIcon from "../assets/risk-safe.svg";
import cautionIcon from "../assets/risk-caution.svg";
import riskyIcon from "../assets/risk-risky.svg";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;
const Title = styled.h2`
  margin: 0;
  font-size: 20px;
`;
const Legend = styled.div`
  display: flex;
  gap: 28px;
  color: #5c5454;
  font-size: 13px;
  font-weight: 700;
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  img {
    width: 17px;
    height: 17px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 30px;
  margin-top: 25px;
  padding: 10px;
  background: #f9f4fd;
  border-radius: 10px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.article`
  min-width: 0;
  min-height: 121px;
  padding: 20px 26px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
`;
const Type = styled.span`
  display: block;
  margin-bottom: 14px;
  color: #a032be;
  font-size: 13px;
  font-weight: 700;
`;
const IngredientList = styled.div`
  display: grid;
  gap: 16px;
`;
const IngredientName = styled.div`
  margin: 0 0 7px;
  display: flex;
  align-items: center;
  gap: 9px;

  h3 {
    margin: 0;
  }
`;
const RiskDot = styled.span`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${({ $tone }) => {
    if ($tone === "risky") return "#d93636";
    if ($tone === "caution") return "#d98b16";
    return "#2ca35c";
  }};
  flex: 0 0 11px;
`;
const Ingredient = styled.button`
  width: 100%;
  padding-top: 14px;
  border-top: 1px solid #f3deff;
  border-right: 0;
  border-bottom: 0;
  border-left: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  &:first-of-type {
    padding-top: 0;
    border-top: 0;
  }
  h3 {
    font-size: 17px;
    overflow-wrap: anywhere;
  }
  p {
    margin: 0;
    color: #5c5454;
    font-size: 15px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  &:hover h3,
  &:focus-visible h3 {
    color: #a032be;
  }
  &:focus-visible {
    border-radius: 6px;
    outline: 2px solid #df6bff;
    outline-offset: 4px;
  }
`;
const Risk = styled.span`
  display: inline-block;
  margin-bottom: 6px;
  color: #a032be;
  font-size: 12px;
  font-weight: 700;
`;
const Empty = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  padding: 34px;
  color: #5c5454;
  text-align: center;
`;
const More = styled.button`
  display: block;
  margin: 24px auto 0;
  padding: 8px 30px;
  border: 0;
  background: transparent;
  color: #5c5454;
  font-size: 20px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 3px;
  }
`;

const riskLabel = {
  SAFE: "안전",
  GENERAL: "일반",
  WARNING: "주의",
  CAUTION: "주의",
  RISKY: "위험",
};
const groupLabel = {
  sweeteners: "대체당",
  additives: "첨가물",
  cautionIngredients: "주의 성분",
  allergicIngredients: "알레르기 유발 성분",
};
const riskTone = (riskLevel) => {
  if (riskLevel === "RISKY") return "risky";
  if (riskLevel === "WARNING" || riskLevel === "CAUTION") return "caution";
  return "safe";
};
export default function IngredientAnalysis({
  analysis = {},
  expanded,
  onToggle,
}) {
  const [selectedCode, setSelectedCode] = useState(null);
  const closeModal = useCallback(() => setSelectedCode(null), []);
  const groups = Object.entries(analysis).filter(
    ([, ingredients]) => Array.isArray(ingredients) && ingredients.length > 0,
  );
  const hasHiddenIngredients = groups.some(
    ([, ingredients]) => ingredients.length > 2,
  );
  return (
    <>
      <Header>
        <Title>성분 분석</Title>
        <Legend aria-label="성분 안전도 범례">
          <span>
            <img src={safeIcon} alt="" />
            안전 (SAFE)
          </span>
          <span>
            <img src={cautionIcon} alt="" />
            주의 (CAUTION)
          </span>
          <span>
            <img src={riskyIcon} alt="" />
            위험 (RISKY)
          </span>
        </Legend>
      </Header>
      <Grid $columns={Math.min(Math.max(groups.length, 1), 5)}>
        {groups.length === 0 && <Empty>성분 분석 정보가 없습니다.</Empty>}
        {groups.map(([groupKey, ingredients]) => {
          const visibleIngredients = expanded
            ? ingredients
            : ingredients.slice(0, 2);
          return (
            <Card key={groupKey}>
              <Type>{groupLabel[groupKey] || groupKey}</Type>
              <IngredientList>
                {visibleIngredients.map((item, index) => (
                  <Ingredient
                    type="button"
                    key={`${item.code || item.name}-${index}`}
                    onClick={() => setSelectedCode(item.code || item.name)}
                    aria-label={`${item.name} 상세 정보 보기`}
                  >
                    <Risk>{riskLabel[item.riskLevel] || item.riskLevel}</Risk>
                    <IngredientName>
                      <RiskDot
                        $tone={riskTone(item.riskLevel)}
                        aria-hidden="true"
                      />
                      <h3>{item.name}</h3>
                    </IngredientName>
                    <p>{item.summary}</p>
                  </Ingredient>
                ))}
              </IngredientList>
            </Card>
          );
        })}
      </Grid>
      {hasHiddenIngredients && (
        <More type="button" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? "접기" : "더보기"}
        </More>
      )}
      {selectedCode && (
        <IngredientDetailModal code={selectedCode} onClose={closeModal} />
      )}
    </>
  );
}

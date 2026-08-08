import styled from "@emotion/styled";
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  h3 {
    margin: 0 0 7px;
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
`;
const Type = styled.span`
  display: block;
  margin-bottom: 14px;
  color: #a032be;
  font-size: 13px;
  font-weight: 700;
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
export default function IngredientAnalysis({
  analysis = {},
  expanded,
  onToggle,
}) {
  const entries = [
    ...(analysis.sweeteners || []).map((item) => ({ ...item, type: "대체당" })),
    ...(analysis.additives || []).map((item) => ({ ...item, type: "첨가물" })),
  ];
  const visible = expanded ? entries : entries.slice(0, 2);
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
      <Grid>
        {visible.map((item, index) => (
          <Card key={`${item.type}-${item.name}-${index}`}>
            <Type>
              {item.type} · {riskLabel[item.riskLevel] || item.riskLevel}
            </Type>
            <h3>{item.name}</h3>
            <p>{item.summary}</p>
          </Card>
        ))}
      </Grid>
      {entries.length > 2 && (
        <More type="button" onClick={onToggle} aria-expanded={expanded}>
          {expanded ? "접기" : "더보기"}
        </More>
      )}
    </>
  );
}

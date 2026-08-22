import styled from "@emotion/styled";
import { SORT_OPTIONS } from "../data/sortOptions";

const Panel = styled.div`
  width: min(1028px, 100%);
  min-height: 68px;
  margin: ${({ $afterBest }) => ($afterBest ? "24px auto 17px" : "0 auto 17px")};
  padding: 13px 38px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 35px;

  @media (max-width: 600px) {
    padding-inline: 20px;
    gap: 18px;
  }
`;

const Title = styled.span`
  flex: 0 0 auto;
  font-size: 18px;
  font-weight: 700;
`;

const Options = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(14px, 2.4vw, 32px);
`;

const Option = styled.label`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #000;
  font-size: 16px;
  white-space: nowrap;
  cursor: pointer;

  input {
    appearance: none;
    width: 16px;
    height: 16px;
    margin: 0;
    border: 1px solid #cfc9d2;
    border-radius: 50%;
    background: #fff;
    display: grid;
    place-content: center;
    cursor: pointer;
  }

  input::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a032be;
    transform: scale(0);
  }

  input:checked {
    border-color: #a032be;
  }

  input:checked::before {
    transform: scale(1);
  }

  input:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 2px;
  }
`;

export default function SortSection({ value, onChange, afterBest = false }) {
  const labelId = `sort-label-${afterBest ? "category" : "search"}`;

  return (
    <Panel $afterBest={afterBest}>
      <Title id={labelId}>정렬 기준</Title>
      <Options role="radiogroup" aria-labelledby={labelId}>
        {SORT_OPTIONS.map((option) => (
          <Option key={option.value}>
            <input
              type="radio"
              name={labelId}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </Option>
        ))}
      </Options>
    </Panel>
  );
}

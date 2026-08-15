import styled from "@emotion/styled";

const Row = styled.div`
  display: grid;
  grid-template-columns: 182px 1fr;
  align-items: center;
  gap: 40px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;
const Label = styled.span`
  font-size: 20px;
  white-space: nowrap;
`;
const Options = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  padding: 3px 2px 9px;
  overflow-x: ${({ $scrollable }) => ($scrollable ? "auto" : "visible")};
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  scrollbar-color: #d9b7e4 transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #d9b7e4;
  }

  @media (max-width: 760px) {
    gap: 10px;
    overflow-x: auto;
  }
`;
const Option = styled.button`
  flex: 0 0 auto;
  height: 41px;
  padding: 0 20px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: ${({ $selected }) => ($selected ? "#a032be" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#5c5454")};
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;
  &:focus-visible {
    outline: 2px solid #a032be;
    outline-offset: 2px;
  }
`;

export default function PreferenceRow({ group, selected, onToggle }) {
  return (
    <Row>
      <Label>{group.label}</Label>
      <Options $scrollable={group.options.length >= 4}>
        {group.options.map((option) => (
          <Option
            key={option.value}
            type="button"
            $selected={selected.includes(option.value)}
            aria-pressed={selected.includes(option.value)}
            onClick={() => onToggle(group.key, option.value)}
          >
            {option.label}
          </Option>
        ))}
      </Options>
    </Row>
  );
}

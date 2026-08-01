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
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 20px;
  width: 100%;
  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;
const Option = styled.button`
  min-width: 0;
  height: 41px;
  padding: 0 16px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: ${({ $selected }) => ($selected ? "#f3deff" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#a032be" : "#5c5454")};
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
      <Options $count={group.options.length}>
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

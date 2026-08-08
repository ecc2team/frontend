import styled from "@emotion/styled";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;
  margin-top: 12px;
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.div`
  min-width: 0;
  height: 75px;
  padding: 10px 20px;
  border: 1px solid #a032be;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 28px;
`;
const IconPlaceholder = styled.div`
  flex: 0 0 50px;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f3deff;
`;
const Text = styled.div`
  min-width: 0;
  text-align: center;
  strong {
    display: block;
    font-size: 20px;
    white-space: nowrap;
  }
  span {
    display: block;
    margin-top: 3px;
    color: #5c5454;
    font-size: 15px;
  }
`;

export default function NutritionInfo({ nutrition = {} }) {
  const items = [
    {
      label: "칼로리",
      value:
        nutrition.calories == null ? "정보 없음" : `${nutrition.calories} kcal`,
    },
    {
      label: "당류",
      value: nutrition.sugar == null ? "정보 없음" : `${nutrition.sugar} g`,
    },
    {
      label: "나트륨",
      value: nutrition.sodium == null ? "정보 없음" : `${nutrition.sodium} mg`,
    },
  ];
  return (
    <Grid>
      {items.map((item) => (
        <Card key={item.label}>
          <IconPlaceholder aria-hidden="true" />
          <Text>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </Text>
        </Card>
      ))}
    </Grid>
  );
}

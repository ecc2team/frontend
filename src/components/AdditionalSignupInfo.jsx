import { useState } from "react";
import styled from "@emotion/styled";

const Section = styled.section`
  width: min(970px, 100%);
  margin: 0 auto 20px;
`;

const Title = styled.h2`
  margin: 0 0 14px -36px;
  font-size: 22px;

  @media (max-width: 800px) {
    margin-left: 0;
  }
`;

const Fields = styled.div`
  width: calc(100% + 36px);
  margin-left: -36px;
  display: grid;
  gap: 13px;

  @media (max-width: 800px) {
    width: 100%;
    margin-left: 0;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 145px minmax(0, 1fr);
  align-items: center;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 17px;
  font-weight: 500;
  white-space: nowrap;
`;

const ChoiceGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 18px;

  @media (max-width: 800px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const Choice = styled.button`
  width: 112px;
  flex: 0 0 112px;
  min-height: 37px;
  padding: 7px 18px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#e2bcef" : "#f0e2f5")};
  border-radius: 9px;
  background: ${({ $selected }) => ($selected ? "#f1d7fa" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#a032be" : "#5c5454")};
  font-size: 16px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #a032be;
    outline-offset: 2px;
  }
`;

const InputWrap = styled.div`
  position: relative;
  width: min(520px, 100%);
`;

const Input = styled.input`
  width: 100%;
  height: 41px;
  padding: 0 ${({ $hasUnit }) => ($hasUnit ? "52px" : "15px")} 0 15px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  color: #332d33;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #8f8686;
  }

  &:focus {
    border-color: #a032be;
  }
`;

const Unit = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  color: #8f8686;
  font-size: 15px;
  transform: translateY(-50%);
  pointer-events: none;
`;

const genderOptions = [
  { value: "FEMALE", label: "여성" },
  { value: "MALE", label: "남성" },
  { value: "NONE", label: "선택 안 함" },
];

const activityOptions = [
  { value: "LOW", label: "낮음" },
  { value: "NORMAL", label: "보통" },
  { value: "HIGH", label: "높음" },
  { value: "VERY_HIGH", label: "매우 높음" },
];

export default function AdditionalSignupInfo() {
  // 백엔드 명세 확정 전까지 이 섹션의 값은 화면 내부에서만 관리합니다.
  const [values, setValues] = useState({
    gender: "FEMALE",
    birthDate: "",
    height: "",
    weight: "",
    activityLevel: "NORMAL",
  });

  const changeValue = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <Section aria-labelledby="additional-info-title">
      <Title id="additional-info-title">추가 정보</Title>
      <Fields>
        <Row>
          <Label as="span">성별</Label>
          <ChoiceGroup aria-label="성별 선택">
            {genderOptions.map((option) => (
              <Choice
                key={option.value}
                type="button"
                $selected={values.gender === option.value}
                aria-pressed={values.gender === option.value}
                onClick={() => changeValue("gender", option.value)}
              >
                {option.label}
              </Choice>
            ))}
          </ChoiceGroup>
        </Row>

        <Row>
          <Label htmlFor="additional-birth-date">생년월일</Label>
          <InputWrap>
            <Input
              id="additional-birth-date"
              type="text"
              inputMode="numeric"
              placeholder="YYYY.MM.DD"
              value={values.birthDate}
              onChange={(event) =>
                changeValue("birthDate", event.target.value)
              }
            />
          </InputWrap>
        </Row>

        <Row>
          <Label htmlFor="additional-height">키</Label>
          <InputWrap>
            <Input
              id="additional-height"
              type="number"
              min="0"
              step="0.1"
              placeholder="키를 입력해주세요"
              value={values.height}
              $hasUnit
              onChange={(event) => changeValue("height", event.target.value)}
            />
            <Unit>cm</Unit>
          </InputWrap>
        </Row>

        <Row>
          <Label htmlFor="additional-weight">체중</Label>
          <InputWrap>
            <Input
              id="additional-weight"
              type="number"
              min="0"
              step="0.1"
              placeholder="체중을 입력해주세요"
              value={values.weight}
              $hasUnit
              onChange={(event) => changeValue("weight", event.target.value)}
            />
            <Unit>kg</Unit>
          </InputWrap>
        </Row>

        <Row>
          <Label as="span">활동량</Label>
          <ChoiceGroup aria-label="활동량 선택">
            {activityOptions.map((option) => (
              <Choice
                key={option.value}
                type="button"
                $selected={values.activityLevel === option.value}
                aria-pressed={values.activityLevel === option.value}
                onClick={() => changeValue("activityLevel", option.value)}
              >
                {option.label}
              </Choice>
            ))}
          </ChoiceGroup>
        </Row>
      </Fields>
    </Section>
  );
}

import { useState } from "react";
import styled from "@emotion/styled";
import { ACTIVITY_LEVEL_LABELS, GENDER_LABELS } from "../api/profile";

const Section = styled.section`
  margin: 26px 0 24px;
  padding: 24px 28px;
  border: 1px solid #f3deff;
  border-radius: 10px;
`;
const Title = styled.h2`margin: 0 0 20px; font-size: 22px;`;
const Fields = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1.4fr) minmax(190px, 1fr) minmax(110px, 0.6fr) minmax(110px, 0.6fr);
  column-gap: 28px;
  row-gap: 26px;
  align-items: end;
  @media (max-width: 1000px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;
const Field = styled.label`display: grid; gap: 9px; font-size: 16px;`;
const ChoiceGroup = styled.div`display: flex; flex-wrap: wrap; gap: 8px;`;
const ActivityField = styled(Field)`grid-column: 1 / -1;`;
const Choice = styled.button`
  min-width: 98px; height: 43px; padding: 0 16px; border: 1px solid #d8b5e4;
  border-radius: 8px; background: ${({ $selected }) => ($selected ? "#f5e8fa" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#8c20aa" : "#222")};
  font-size: 15px; font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  white-space: nowrap; cursor: pointer;
`;
const InputWrap = styled.div`position: relative;`;
const Input = styled.input`
  width: 100%; height: 43px; padding: 0 ${({ $hasUnit }) => ($hasUnit ? "48px" : "14px")} 0 14px;
  border: 1px solid #d8b5e4; border-radius: 8px; background: #fff;
  font-size: 16px; text-align: center; outline: none;
  &:focus { border-color: #a032be; }
`;
const Unit = styled.span`
  position: absolute; top: 50%; right: 14px; color: #8f8686;
  transform: translateY(-50%); pointer-events: none;
`;

const genderOptions = [
  { value: "FEMALE", label: GENDER_LABELS.FEMALE },
  { value: "MALE", label: GENDER_LABELS.MALE },
  { value: "NONE", label: GENDER_LABELS.NONE },
];
const activityOptions = Object.entries(ACTIVITY_LEVEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const defaultValues = {
  gender: "NONE",
  birthDate: "",
  height: "",
  weight: "",
  activityLevel: "",
};

export default function AdditionalSignupInfo({ value, onChange }) {
  const [localValues, setLocalValues] = useState(defaultValues);
  const values = value ?? localValues;
  const changeValue = (key, nextValue) => {
    const next = { ...values, [key]: nextValue };
    if (onChange) onChange(next);
    else setLocalValues(next);
  };

  return (
    <Section aria-labelledby="additional-info-title">
      <Title id="additional-info-title">추가 정보</Title>
      <Fields>
        <Field as="div">
          <span>성별</span>
          <ChoiceGroup>
            {genderOptions.map((option) => (
              <Choice key={option.value} type="button" $selected={values.gender === option.value} aria-pressed={values.gender === option.value} onClick={() => changeValue("gender", option.value)}>{option.label}</Choice>
            ))}
          </ChoiceGroup>
        </Field>
        <Field htmlFor="additional-birth-date">
          <span>생년월일</span>
          <Input id="additional-birth-date" type="date" value={values.birthDate} onChange={(event) => changeValue("birthDate", event.target.value)} />
        </Field>
        <Field htmlFor="additional-height">
          <span>키</span>
          <InputWrap><Input id="additional-height" type="number" min="0" step="0.1" value={values.height} $hasUnit onChange={(event) => changeValue("height", event.target.value)} /><Unit>cm</Unit></InputWrap>
        </Field>
        <Field htmlFor="additional-weight">
          <span>체중</span>
          <InputWrap><Input id="additional-weight" type="number" min="0" step="0.1" value={values.weight} $hasUnit onChange={(event) => changeValue("weight", event.target.value)} /><Unit>kg</Unit></InputWrap>
        </Field>
        <ActivityField as="div">
          <span>활동량</span>
          <ChoiceGroup>
            {activityOptions.map((option) => (
              <Choice key={option.value} type="button" $selected={values.activityLevel === option.value} aria-pressed={values.activityLevel === option.value} onClick={() => changeValue("activityLevel", option.value)}>{option.label}</Choice>
            ))}
          </ChoiceGroup>
        </ActivityField>
      </Fields>
    </Section>
  );
}

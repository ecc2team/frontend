import { useState } from "react";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${({ $large }) => ($large ? "24px" : "0")};
`;

const Input = styled.input`
  width: 100%;
  height: ${({ $large }) => ($large ? "77px" : "45px")};
  padding: ${({ $large }) => ($large ? "0 70px 0 29px" : "0 54px 0 18px")};
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  color: #332d33;
  font-size: ${({ $large }) => ($large ? "25px" : "20px")};
  font-weight: ${({ $large }) => ($large ? "700" : "400")};
  outline: none;

  &::placeholder {
    color: #8f8686;
  }

  &:focus {
    border-color: #a032be;
  }
`;

const Toggle = styled.button`
  position: absolute;
  top: 50%;
  right: ${({ $large }) => ($large ? "24px" : "15px")};
  width: ${({ $large }) => ($large ? "34px" : "28px")};
  height: ${({ $large }) => ($large ? "34px" : "28px")};
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #6f6671;
  transform: translateY(-50%);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: #f3deff;
    color: #a032be;
    outline: none;
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export default function PasswordInput({ large = false, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <Wrapper $large={large}>
      <Input
        {...inputProps}
        type={visible ? "text" : "password"}
        $large={large}
      />
      <Toggle
        type="button"
        $large={large}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={visible}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="2.8"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          {!visible && (
            <path
              d="m4 4 16 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </Toggle>
    </Wrapper>
  );
}

import styled from "@emotion/styled";
const Circle = styled.button`
  width: 62px;
  height: 62px;
  padding: 0;
  border: 1px solid ${(p) => (p.$kakao ? "#f5d900" : "#ddd")};
  border-radius: 50%;
  background: ${(p) => (p.$kakao ? "#fee500" : "#fff")};
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: 0.16s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px #47265624;
  }
  svg {
    width: 32px;
    height: 32px;
  }
`;
export default function SocialLoginButton({ provider, onClick, label }) {
  const kakao = provider === "kakao";
  return (
    <Circle
      type="button"
      onClick={onClick}
      $kakao={kakao}
      aria-label={label}
      title={label}
    >
      {kakao ? (
        <svg viewBox="0 0 36 36">
          <path
            fill="#191919"
            d="M18 7C10.8 7 5 11.5 5 17c0 3.6 2.5 6.7 6.2 8.4L10 29.9c-.1.4.3.7.6.4l5.3-3.5c.7.1 1.4.2 2.1.2 7.2 0 13-4.5 13-10S25.2 7 18 7Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 36 36">
          <path
            fill="#4285F4"
            d="M31 18c0-1-.1-2-.3-3H18v6h7.4a7 7 0 0 1-2.7 4l4.5 4c2.5-2.5 3.8-6 3.8-11Z"
          />
          <path
            fill="#34A853"
            d="M18 32c4 0 7-1 9.2-3l-4.5-4c-1.2 1-3 1-4.7 1-3.6 0-6.7-2.4-7.8-5.7l-4.6 3.9A14 14 0 0 0 18 32Z"
          />
          <path
            fill="#FBBC05"
            d="M10.2 20.3A8 8 0 0 1 10 18c0-.8 0-1.5.2-2.3l-4.6-3.9A14 14 0 0 0 4 18c0 2.2.5 4.3 1.6 6.2Z"
          />
          <path
            fill="#EA4335"
            d="M18 10c2 0 4 .7 5.3 2l4-4c-2.5-2.3-5.5-3.8-9.3-3.8A14 14 0 0 0 5.6 11.8l4.6 3.9C11.3 12.4 14.4 10 18 10Z"
          />
        </svg>
      )}
    </Circle>
  );
}

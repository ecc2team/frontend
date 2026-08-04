import { useState } from "react";
import styled from "@emotion/styled";
import searchIcon from "../assets/search-icon.svg";

const Form = styled.form`
  display: flex;
  width: 100%;
  height: ${({ $large }) => ($large ? "79px" : "60px")};
`;
const Input = styled.input`
  min-width: 0;
  flex: 1;
  padding: 0 ${({ $large }) => ($large ? "49px" : "50px")};
  border: 1px solid #a032be;
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: #fff;
  color: #332d33;
  outline: none;
  font-size: ${({ $large }) => ($large ? "32px" : "20px")};
  font-weight: 700;
  &::placeholder {
    color: #8f8686;
    opacity: 1;
  }
  &:focus {
    box-shadow: inset 0 0 0 1px #a032be;
  }
  @media (max-width: 760px) {
    padding-inline: 20px;
    font-size: 18px;
  }
`;
const Button = styled.button`
  width: ${({ $large }) => ($large ? "90px" : "71px")};
  border: 0;
  border-radius: 10px;
  background: #a032be;
  display: grid;
  place-items: center;
  cursor: pointer;
  margin-left: -10px;
  img {
    width: ${({ $large }) => ($large ? "42.528px" : "36px")};
    height: ${({ $large }) => ($large ? "42.133px" : "35.666px")};
    object-fit: contain;
  }
  &:hover {
    background: #8926a5;
  }
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 3px;
  }
`;

export default function SearchBar({
  initialQuery = "",
  onSearch,
  large = false,
  className,
}) {
  const [value, setValue] = useState(initialQuery);
  const submit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };
  return (
    <Form role="search" onSubmit={submit} className={className} $large={large}>
      <Input
        name="query"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="제품명 또는 성분 검색"
        placeholder="제품명, 성분을 검색해보세요"
        $large={large}
      />
      <Button type="submit" aria-label="검색" $large={large}>
        <img src={searchIcon} alt="" />
      </Button>
    </Form>
  );
}

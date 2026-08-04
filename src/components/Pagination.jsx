import styled from "@emotion/styled";

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 42px;
`;
const PageButton = styled.button`
  width: 42px;
  height: 42px;
  border: 1px solid #df6bff;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#a032be" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#5c5454")};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    border-color: #a032be;
  }
  &:focus-visible {
    outline: 3px solid #df6bff;
    outline-offset: 2px;
  }
`;

export default function Pagination({ totalPages, currentPage, onChange }) {
  if (totalPages < 2) return null;
  return (
    <Nav aria-label="검색 결과 페이지">
      {Array.from({ length: totalPages }, (_, index) => (
        <PageButton
          key={index}
          type="button"
          $active={index === currentPage}
          aria-current={index === currentPage ? "page" : undefined}
          onClick={() => onChange(index)}
        >
          {index + 1}
        </PageButton>
      ))}
    </Nav>
  );
}

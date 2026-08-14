import styled from "@emotion/styled";

const VISIBLE_PAGE_COUNT = 5;

const Nav = styled.nav`
  margin-top: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
`;
const Pages = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const PageButton = styled.button`
  width: 21px;
  height: 21px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#df69ff" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  font-size: 15px;
  font-weight: 700;
  line-height: 21px;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid #a032be;
    outline-offset: 2px;
  }
`;
const ArrowButton = styled.button`
  width: 25px;
  height: 25px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #000;
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  cursor: pointer;
  &:disabled {
    color: #b8b2b9;
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid #a032be;
    outline-offset: 2px;
  }
`;

export default function Pagination({ totalPages, currentPage, onChange }) {
  if (totalPages < 2) return null;
  const groupStart =
    Math.floor(currentPage / VISIBLE_PAGE_COUNT) * VISIBLE_PAGE_COUNT;
  const groupEnd = Math.min(groupStart + VISIBLE_PAGE_COUNT, totalPages);
  const visiblePages = Array.from(
    { length: groupEnd - groupStart },
    (_, index) => groupStart + index,
  );

  return (
    <Nav aria-label="검색 결과 페이지">
      <ArrowButton
        type="button"
        disabled={currentPage === 0}
        onClick={() => onChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        {"<"}
      </ArrowButton>
      <Pages>
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            type="button"
            $active={page === currentPage}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onChange(page)}
          >
            {page + 1}
          </PageButton>
        ))}
      </Pages>
      <ArrowButton
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        {">"}
      </ArrowButton>
    </Nav>
  );
}

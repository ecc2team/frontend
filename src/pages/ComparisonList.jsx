import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ComparisonProductCard from "../components/ComparisonProductCard";
import addCircle from "../assets/compare-add.svg";
import {
  comparisonProducts,
  MAX_COMPARISON_PRODUCTS,
} from "../mocks/data/comparisonProducts";

const PAGE_SIZE = 8;
const MAX_SELECTED_PRODUCTS = 3;

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;

const Main = styled.main`
  width: min(1342px, calc(100% - 48px));
  margin: 0 auto;
  padding: 25px 0 72px;

  @media (max-width: 600px) {
    width: min(100% - 32px, 1342px);
  }
`;

const Title = styled.h1`
  margin: 0 0 17px 11px;
  font-size: 30px;
  line-height: 38px;
`;

const Summary = styled.section`
  min-height: 72px;
  padding: 14px 22px 14px 25px;
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 650px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const Count = styled.p`
  margin: 0;
  font-size: 25px;
  line-height: 42px;

  strong {
    color: #a032be;
  }
`;

const CompareButton = styled.button`
  width: min(303px, 100%);
  height: 42px;
  border: 0;
  border-radius: 10px;
  background: #a032be;
  color: #fff;
  font-size: 25px;
  cursor: pointer;

  &:disabled {
    background: #c9b8cf;
    cursor: default;
  }
`;

const Grid = styled.section`
  width: min(1218px, 100%);
  margin: 56px auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 282px));
  gap: 32px 30px;

  @media (max-width: 1230px) {
    grid-template-columns: repeat(3, minmax(0, 282px));
    justify-content: center;
  }

  @media (max-width: 930px) {
    grid-template-columns: repeat(2, minmax(0, 282px));
  }

  @media (max-width: 620px) {
    grid-template-columns: minmax(0, 282px);
  }
`;

const AddCard = styled(Link)`
  position: relative;
  width: 100%;
  height: 263px;
  border: 2px dashed #a032be;
  border-radius: 10px;
  background: #fff;
  color: #000;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;

  img {
    width: 70px;
    height: 70px;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 104px;
    left: 50%;
    width: 32px;
    height: 3px;
    border-radius: 3px;
    background: #a032be;
    transform: translateX(-50%);
  }

  &::after {
    transform: translateX(-50%) rotate(90deg);
  }

  span {
    font-size: 20px;
    line-height: 29px;
  }
`;

const Pagination = styled.nav`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 9px;
`;

const PageButton = styled.button`
  min-width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#a032be" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: pointer;
`;

function ComparisonList() {
  const [products, setProducts] = useState(() =>
    comparisonProducts.slice(0, MAX_COMPARISON_PRODUCTS),
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = useMemo(
    () =>
      products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, products],
  );
  const selectionLimitReached = selectedIds.length >= MAX_SELECTED_PRODUCTS;
  const showAddCard =
    products.length < MAX_COMPARISON_PRODUCTS && currentPage === totalPages;

  const toggleProduct = (productId) => {
    setSelectedIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }
      if (current.length >= MAX_SELECTED_PRODUCTS) return current;
      return [...current, productId];
    });
  };

  const removeProduct = (productId) => {
    setProducts((current) =>
      current.filter((product) => product.productId !== productId),
    );
    setSelectedIds((current) => current.filter((id) => id !== productId));
  };

  return (
    <Page>
      <Header />
      <Main>
        <Title>내 비교함</Title>
        <Summary>
          <Count>
            비교함에 담은 상품 <strong>{products.length}개</strong>
          </Count>
          <CompareButton type="button" disabled={selectedIds.length < 2}>
            선택한 상품 비교하기
          </CompareButton>
        </Summary>
        <Grid aria-label="비교함 상품 목록">
          {pageProducts.map((product) => (
            <ComparisonProductCard
              key={product.productId}
              product={product}
              selected={selectedIds.includes(product.productId)}
              disabled={
                selectionLimitReached &&
                !selectedIds.includes(product.productId)
              }
              onSelect={toggleProduct}
              onRemove={removeProduct}
            />
          ))}
          {showAddCard && (
            <AddCard to="/search">
              <img src={addCircle} alt="" />
              <span>상품 추가하기</span>
            </AddCard>
          )}
        </Grid>
        {totalPages > 1 && (
          <Pagination aria-label="비교함 페이지 이동">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PageButton
                  key={pageNumber}
                  type="button"
                  $active={pageNumber === currentPage}
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                >
                  {pageNumber}
                </PageButton>
              ),
            )}
          </Pagination>
        )}
      </Main>
    </Page>
  );
}

export default ComparisonList;

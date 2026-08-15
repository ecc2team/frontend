import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import { getComparisonList } from "../api/comparison-list";
import {
  getComparisonSelection,
  saveComparisonSelection,
} from "../utils/comparisonSelection";

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #191722;
`;
const Main = styled.main`
  width: min(1370px, calc(100% - 48px));
  margin: 0 auto;
  padding: 34px 0 80px;
`;
const Heading = styled.div`
  margin-bottom: 26px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  h1 {
    margin: 0 0 8px;
    font-size: 30px;
  }
  p {
    margin: 0;
    color: #6e687d;
    font-size: 16px;
  }
`;
const AddButton = styled(Link)`
  min-height: 48px;
  padding: 0 22px;
  border: 1px solid #d6b5e5;
  border-radius: 12px;
  background: #fff;
  color: #9237c3;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
`;
const TableWrap = styled.div`
  border: 1px solid #ded5e8;
  border-radius: 10px;
  background: #fff;
  overflow-x: auto;
`;
const Table = styled.div`
  min-width: 920px;
  display: grid;
  grid-template-columns: 190px repeat(3, minmax(240px, 1fr));
`;
const Cell = styled.div`
  min-height: ${({ $header }) => ($header ? "164px" : "62px")};
  padding: ${({ $header }) => ($header ? "18px 24px" : "14px 28px")};
  border-right: 1px solid #e4ddeb;
  border-bottom: 1px solid #e4ddeb;
  display: flex;
  align-items: center;
  min-width: 0;

  &:nth-of-type(4n) {
    border-right: 0;
  }
`;
const LabelCell = styled(Cell)`
  gap: 12px;
  background: #fcfaff;
  font-weight: 700;
`;
const ProductHead = styled(Cell)`
  position: relative;
  gap: 18px;
`;
const ProductImage = styled.div`
  width: 74px;
  height: 116px;
  flex: 0 0 74px;
  display: grid;
  place-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
const ProductMeta = styled.div`
  min-width: 0;
  h2 {
    margin: 8px 0 11px;
    overflow: hidden;
    font-size: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const Grade = styled.span`
  padding: 4px 10px;
  border: 1px solid ${({ $best }) => ($best ? "#39b95c" : "#ca74ee")};
  border-radius: 14px;
  color: ${({ $best }) => ($best ? "#18a848" : "#9134c2")};
  font-size: 13px;
  font-weight: 700;
`;
const Ingredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  span {
    padding: 4px 8px;
    border: 1px solid #dba6ef;
    border-radius: 7px;
    color: #9134c2;
    font-size: 12px;
  }
`;
const Remove = styled.button`
  position: absolute;
  top: 13px;
  right: 16px;
  border: 0;
  background: transparent;
  color: #766997;
  font-size: 23px;
  cursor: pointer;
`;
const EmptyHead = styled(Cell)`
  padding: 14px;
`;
const EmptyAdd = styled(Link)`
  width: 100%;
  height: 136px;
  border: 1px dashed #d9bee6;
  border-radius: 10px;
  color: #9134c2;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  strong:first-of-type {
    font-size: 34px;
  }
  span {
    color: #777085;
    font-size: 13px;
  }
`;
const Value = styled(Cell)`
  gap: 16px;
  strong {
    min-width: 38px;
    font-size: 19px;
  }
`;
const BarTrack = styled.div`
  width: min(150px, 60%);
  height: 6px;
`;
const Bar = styled.div`
  width: ${({ $width }) => `${$width}%`};
  min-width: ${({ $value }) => ($value > 0 ? "8px" : "0")};
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #d984f0, #c33ee9);
`;
const TextValue = styled(Cell)`
  font-size: 14px;
  line-height: 1.5;
`;
const Status = styled.div`
  padding: 100px 20px;
  text-align: center;
  font-size: 20px;
`;

const metricRows = [
  ["🔥", "열량 (kcal)", "calories"],
  ["◆", "당류 (g)", "sugar"],
  ["▣", "나트륨 (mg)", "sodium"],
  ["☕", "카페인 (mg)", "caffeine"],
];

const getMetric = (product, key) =>
  Number(product?.nutrition?.[key] ?? product?.[key] ?? 0);

export default function ProductComparison() {
  const [selectedIds, setSelectedIds] = useState(getComparisonSelection);
  const [state, setState] = useState({
    status: "loading",
    products: [],
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    getComparisonList({ signal: controller.signal })
      .then((data) => {
        const ids = new Set(selectedIds);
        setState({
          status: "success",
          products: data.products.filter((item) => ids.has(item.productId)),
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ status: "error", products: [], error: error.message });
        }
      });
    return () => controller.abort();
  }, [selectedIds]);

  const products = state.products;
  const maxValues = useMemo(
    () =>
      Object.fromEntries(
        metricRows.map(([, , key]) => [
          key,
          Math.max(...products.map((product) => getMetric(product, key)), 0),
        ]),
      ),
    [products],
  );

  const removeProduct = (productId) => {
    const next = saveComparisonSelection(
      selectedIds.filter((id) => id !== productId),
    );
    setSelectedIds(next);
  };

  if (selectedIds.length < 2) return <Navigate to="/compare" replace />;

  if (state.status !== "success") {
    return (
      <Page>
        <Header />
        <Status role={state.status === "error" ? "alert" : "status"}>
          {state.status === "error"
            ? state.error
            : "비교 정보를 불러오고 있습니다..."}
        </Status>
      </Page>
    );
  }

  const displayProducts = [
    ...products,
    ...Array(3 - products.length).fill(null),
  ];

  return (
    <Page>
      <Header />
      <Main>
        <Heading>
          <div>
            <h1>제품 비교 ({products.length}개)</h1>
            <p>선택한 제품을 한눈에 비교해보세요.</p>
          </div>
          {products.length < 3 && (
            <AddButton to="/compare">＋ 제품 추가하기 (최대 3개)</AddButton>
          )}
        </Heading>
        <TableWrap>
          <Table>
            <LabelCell $header>비교 항목</LabelCell>
            {displayProducts.map((product, index) =>
              product ? (
                <ProductHead $header key={product.productId}>
                  <Remove
                    type="button"
                    onClick={() => removeProduct(product.productId)}
                    aria-label={`${product.productName} 비교에서 제거`}
                  >
                    ×
                  </Remove>
                  <ProductImage>
                    {product.imageUrl && <img src={product.imageUrl} alt="" />}
                  </ProductImage>
                  <ProductMeta>
                    <Grade $best={product.grade === 1}>
                      {product.grade}등급
                    </Grade>
                    <h2>{product.productName}</h2>
                    <Ingredients>
                      {(product.keyIngredients ?? [])
                        .slice(0, 4)
                        .map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                    </Ingredients>
                  </ProductMeta>
                </ProductHead>
              ) : (
                <EmptyHead $header key={`empty-${index}`}>
                  {products.length < 3 && index === products.length ? (
                    <EmptyAdd to="/compare">
                      <strong>＋</strong>
                      <strong>제품 추가하기</strong>
                      <span>최대 3개까지 비교할 수 있어요.</span>
                    </EmptyAdd>
                  ) : null}
                </EmptyHead>
              ),
            )}
            {metricRows.flatMap(([icon, label, key]) => [
              <LabelCell key={`${key}-label`}>
                <span>{icon}</span>
                {label}
              </LabelCell>,
              ...displayProducts.map((product, index) => {
                const value = product ? getMetric(product, key) : null;
                const width =
                  value == null || maxValues[key] === 0
                    ? 0
                    : (value / maxValues[key]) * 100;
                return (
                  <Value key={`${key}-${product?.productId ?? index}`}>
                    {value == null ? (
                      "-"
                    ) : (
                      <>
                        <strong>
                          {value.toFixed(key === "calories" ? 0 : 1)}
                        </strong>
                        <BarTrack>
                          <Bar $value={value} $width={width} />
                        </BarTrack>
                      </>
                    )}
                  </Value>
                );
              }),
            ])}
            <LabelCell>⚠ 알레르기 유발 물질</LabelCell>
            {displayProducts.map((product, index) => (
              <TextValue key={`allergy-${product?.productId ?? index}`}>
                {product
                  ? (
                      product.allergicIngredients ??
                      product.allergyFlags ??
                      []
                    ).join(", ") || "없음"
                  : "-"}
              </TextValue>
            ))}
            <LabelCell>❧ 주요 성분</LabelCell>
            {displayProducts.map((product, index) => (
              <TextValue key={`ingredient-${product?.productId ?? index}`}>
                {product
                  ? (product.keyIngredients ?? []).join(", ") || "정보 없음"
                  : "-"}
              </TextValue>
            ))}
            <LabelCell>★ 등급</LabelCell>
            {displayProducts.map((product, index) => (
              <TextValue key={`grade-${product?.productId ?? index}`}>
                {product ? (
                  <Grade $best={product.grade === 1}>{product.grade}등급</Grade>
                ) : (
                  "-"
                )}
              </TextValue>
            ))}
          </Table>
        </TableWrap>
      </Main>
    </Page>
  );
}

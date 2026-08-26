import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import FallbackProductImage from "../components/ProductImage";
import {
  getComparisonList,
  removeFromComparisonList,
} from "../api/comparison-list";
import { getProductDetail } from "../api/products";
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
  background: #fcfaff;
  font-weight: 700;
`;
const ComparisonLabel = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
`;
const ComparisonIcon = styled.span`
  width: 20px;
  flex: 0 0 20px;
  font-size: 19px;
  line-height: 1;
  text-align: center;
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
    object-position: center;
  }
  span {
    color: #8f8797;
    font-size: 12px;
    text-align: center;
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
const ScoreBadge = styled.span`
  padding: 4px 10px;
  border: 1px solid #ca74ee;
  border-radius: 14px;
  color: #9134c2;
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

const comparisonRows = [
  { key: "calories", icon: "🔥", label: "열량 (kcal)" },
  { key: "sugar", icon: "🍬", label: "당류 (g)" },
  { key: "sodium", icon: "🧂", label: "나트륨 (mg)" },
  { key: "allergy", icon: "⚠️", label: "알레르기 유발 물질" },
  { key: "ingredients", icon: "🧪", label: "주요 성분" },
  { key: "score", icon: "⭐", label: "ZeroPick 점수" },
];
const metricRows = comparisonRows.slice(0, 3);

function ComparisonRowLabel({ row }) {
  return (
    <ComparisonLabel>
      <ComparisonIcon aria-hidden="true">{row.icon}</ComparisonIcon>
      <span>{row.label}</span>
    </ComparisonLabel>
  );
}

const getMetric = (product, key) => {
  if (!product?.detailLoaded) return null;

  const rawValue = product.nutrition?.[key];
  if (rawValue == null || rawValue === "") return null;

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
};

const getAnalysisIngredientNames = (analysis) =>
  Object.values(analysis ?? {})
    .filter(Array.isArray)
    .flat()
    .map((ingredient) =>
      typeof ingredient === "string" ? ingredient : ingredient?.name,
    )
    .filter(Boolean)
    .filter((name, index, names) => names.indexOf(name) === index);

const mergeComparisonDetail = (comparisonProduct, detailProduct) => {
  const analysisIngredientNames = getAnalysisIngredientNames(
    detailProduct.ingredientsAnalysis,
  );

  return {
    ...comparisonProduct,
    ...detailProduct,
    imageUrl: detailProduct.imageUrl ?? comparisonProduct.imageUrl ?? null,
    categoryCode:
      detailProduct.categoryCode ?? comparisonProduct.categoryCode ?? null,
    keyIngredients:
      detailProduct.keyIngredients?.length > 0
        ? detailProduct.keyIngredients
        : analysisIngredientNames,
    allergicIngredients:
      detailProduct.allergicIngredients ??
      detailProduct.allergyFlags ??
      comparisonProduct.allergicIngredients ??
      [],
    detailLoaded: true,
  };
};

function ComparisonImage({ product }) {
  return (
    <FallbackProductImage
      product={product}
      fallback={<span>제품 이미지 없음</span>}
    />
  );
}

export default function ProductComparison() {
  const [selectedIds, setSelectedIds] = useState(getComparisonSelection);
  const [state, setState] = useState({
    status: "loading",
    products: [],
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadComparisonProducts() {
      try {
        const data = await getComparisonList({ signal: controller.signal });
        if (!active) return;

        const ids = new Set(selectedIds);
        const comparisonProducts = data.products.filter((item) =>
          ids.has(item.productId),
        );
        const detailResults = await Promise.allSettled(
          comparisonProducts.map((product) =>
            getProductDetail(product.productId, {
              signal: controller.signal,
            }),
          ),
        );

        if (!active) return;

        const products = comparisonProducts.map((product, index) => {
          const detailResult = detailResults[index];

          return detailResult.status === "fulfilled"
            ? mergeComparisonDetail(product, detailResult.value)
            : { ...product, detailLoaded: false };
        });
        const failedCount = detailResults.filter(
          (result) => result.status === "rejected",
        ).length;

        setState({
          status: "success",
          products,
          error:
            failedCount > 0
              ? `일부 상품(${failedCount}개)의 상세 정보를 불러오지 못했습니다.`
              : "",
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setState({ status: "error", products: [], error: error.message });
        }
      }
    }

    loadComparisonProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedIds]);

  const products = state.products;
  const maxValues = useMemo(
    () =>
      Object.fromEntries(
        metricRows.map(({ key }) => [
          key,
          Math.max(
            ...products
              .map((product) => getMetric(product, key))
              .filter((value) => value != null),
            0,
          ),
        ]),
      ),
    [products],
  );

  const removeProduct = async (productId) => {
    try {
      await removeFromComparisonList(productId);
      const next = saveComparisonSelection(
        selectedIds.filter((id) => id !== productId),
      );
      setSelectedIds(next);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    }
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
        {state.error && <div role="alert">{state.error}</div>}
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
                    <ComparisonImage product={product} />
                  </ProductImage>
                  <ProductMeta>
                    <ScoreBadge>{product.score}점</ScoreBadge>
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
            {metricRows.flatMap((row) => [
              <LabelCell key={`${row.key}-label`}>
                <ComparisonRowLabel row={row} />
              </LabelCell>,
              ...displayProducts.map((product, index) => {
                const value = product ? getMetric(product, row.key) : null;
                const width =
                  value == null || maxValues[row.key] === 0
                    ? 0
                    : (value / maxValues[row.key]) * 100;
                return (
                  <Value key={`${row.key}-${product?.productId ?? index}`}>
                    {value == null ? (
                      "-"
                    ) : (
                      <>
                        <strong>
                          {value.toFixed(row.key === "calories" ? 0 : 1)}
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
            <LabelCell>
              <ComparisonRowLabel row={comparisonRows[3]} />
            </LabelCell>
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
            <LabelCell>
              <ComparisonRowLabel row={comparisonRows[4]} />
            </LabelCell>
            {displayProducts.map((product, index) => (
              <TextValue key={`ingredient-${product?.productId ?? index}`}>
                {product
                  ? (product.keyIngredients ?? []).join(", ") || "정보 없음"
                  : "-"}
              </TextValue>
            ))}
            <LabelCell>
              <ComparisonRowLabel row={comparisonRows[5]} />
            </LabelCell>
            {displayProducts.map((product, index) => (
              <TextValue key={`grade-${product?.productId ?? index}`}>
                {product ? (
                  <ScoreBadge>{product.score}점</ScoreBadge>
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

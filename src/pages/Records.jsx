import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { deleteIntakeRecord, getDailyRecords } from "../api/records";
import { getKstDateKey, moveDate } from "../utils/dateTime";
import sugarIcon from "../assets/nutrition-sugar.svg";
import sodiumIcon from "../assets/nutrition-sodium.svg";
import saturatedFatIcon from "../assets/nutrition-saturated-fat.svg";
import proteinIcon from "../assets/nutrition-protein.svg";
import carbohydrateIcon from "../assets/nutrition-carbohydrate.svg";

const NUTRIENT_ICONS = {
  sugar: sugarIcon,
  sodium: sodiumIcon,
  saturatedFat: saturatedFatIcon,
  protein: proteinIcon,
  fiber: carbohydrateIcon,
};

const Page = styled.div`
  min-height: 100svh;
  background: #f9f4fd;
  color: #000;
`;
const Main = styled.main`
  width: min(1334px, calc(100% - 48px));
  margin: 0 auto;
  padding: 21px 0 24px;
`;
const DateControls = styled.div`
  width: min(464px, 100%);
  height: 65px;
  margin: 0 0 27px auto;
  display: grid;
  grid-template-columns: 65px 1fr 65px;
`;
const DateArrow = styled.button`
  border: 1px solid #8f8686;
  border-radius: ${({ $side }) =>
    $side === "left" ? "10px 0 0 10px" : "0 10px 10px 0"};
  background: #fff;
  color: #5c5454;
  font-size: 30px;
  font-weight: 700;
  cursor: pointer;
`;
const DateInput = styled.input`
  min-width: 0;
  border: 1px solid #8f8686;
  border-right: 0;
  border-left: 0;
  background: #fff;
  color: #000;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  outline: none;
  color-scheme: light;
`;
const Card = styled.section`
  border: 1px solid #f3deff;
  border-radius: 10px;
  background: #fff;
`;
const Summary = styled(Card)`
  min-height: 166px;
  padding: 22px 32px;
  display: grid;
  grid-template-columns: 190px 1px 1fr;
  align-items: center;
  gap: 25px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Total = styled.div`
  p {
    margin: 0 0 10px;
    color: #5c5454;
    font-size: 16px;
  }
  strong {
    color: #a032be;
    font-size: 46px;
  }
  span {
    margin-left: 5px;
    color: #5c5454;
    font-size: 16px;
  }
`;
const VerticalLine = styled.div`
  width: 1px;
  height: 112px;
  background: #8f8686;
  @media (max-width: 800px) {
    display: none;
  }
`;
const NutrientArea = styled.div`
  h2 {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 400;
  }
`;
const NutrientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  gap: 28px;
  overflow-x: auto;
`;
const Nutrient = styled.div`
  min-width: 100px;
  text-align: center;
  .icon {
    width: 44px;
    height: 44px;
    margin: 0 auto 8px;
    border-radius: 50%;
    background: #f7f3ff;
    display: grid;
    place-items: center;
  }
  .icon img {
    width: 30px;
    height: 30px;
  }
  p,
  strong {
    display: block;
    margin: 0;
    font-size: 15px;
  }
  p {
    color: #5c5454;
  }
`;
const Track = styled.div`
  height: 11px;
  margin-top: 8px;
  border-radius: 50px;
  background: #e9e7e7;
  overflow: hidden;
  span {
    display: block;
    width: ${({ $percentage }) => `${$percentage}%`};
    height: 100%;
    border-radius: inherit;
    background: ${({ $tone }) => ($tone === "caution" ? "#ffbe4f" : "#3bbe6b")};
  }
`;
const Details = styled(Card)`
  min-height: 325px;
  margin-top: 14px;
  padding: 27px 63px 10px 40px;
  display: grid;
  grid-template-columns: minmax(0, 800px) 1fr;
  gap: 70px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Timeline = styled.div``;
const RecordRow = styled.article`
  min-height: 62px;
  border-bottom: 1px solid #bcb7bc;
  display: grid;
  grid-template-columns: 75px 55px 1fr 90px 30px;
  align-items: center;
  gap: 14px;
  .time {
    position: relative;
    color: #5c5454;
    font-size: 16px;
    &::before {
      content: "";
      position: absolute;
      left: -8px;
      top: 50%;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #a032be;
      transform: translate(-100%, -50%);
    }
  }
  img,
  .image-placeholder {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  .image-placeholder {
    border-radius: 6px;
    background: #f3deff;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    font-size: 16px;
  }
  p {
    margin-top: 3px;
    color: #5c5454;
    font-size: 15px;
  }
  strong {
    text-align: right;
  }
`;
const RecordMenu = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
`;
const MenuButton = styled.button`
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #5c5454;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: #f9f0fc;
    outline: none;
  }
`;
const DeleteButton = styled.button`
  position: absolute;
  top: 34px;
  right: 0;
  z-index: 10;
  width: 88px;
  height: 38px;
  border: 1px solid #a032be;
  border-radius: 8px;
  background: #fff;
  color: #a032be;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 7px 18px rgb(71 33 80 / 16%);
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: #f9f0fc;
    outline: none;
  }
`;
const Empty = styled.p`
  margin: 78px 0;
  color: #5c5454;
  text-align: center;
`;
const AddProduct = styled(Link)`
  height: 42px;
  margin-top: 28px;
  border: 1px solid #a032be;
  border-radius: 10px;
  color: #a032be;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
`;
const CaloriePanel = styled.aside`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Donut = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    #a032be ${({ $percentage }) => `${$percentage}%`},
    #f3deff 0
  );
  display: grid;
  place-items: center;
  &::before {
    content: "";
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background: #fff;
  }
  strong {
    position: absolute;
    color: #a032be;
    font-size: 34px;
  }
`;
const Recommendation = styled.p`
  margin: 14px 0 10px;
  color: #5c5454;
  text-align: center;
`;
const CalorieTrack = styled.div`
  width: 180px;
  height: 11px;
  border-radius: 50px;
  background: #d9d9d9;
  overflow: hidden;
  span {
    display: block;
    width: ${({ $percentage }) => `${$percentage}%`};
    height: 100%;
    border-radius: inherit;
    background: #a032be;
  }
`;
const Feedback = styled.p`
  width: 168px;
  margin: 18px 0 0;
  padding: 17px 10px;
  border-radius: 10px;
  background: #d6ffe1;
  color: #5c5454;
  text-align: center;
`;
const Status = styled.p`
  grid-column: 1 / -1;
  color: #5c5454;
  text-align: center;
`;

export default function Records() {
  const [date, setDate] = useState(() => getKstDateKey());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    getDailyRecords(date, { signal: controller.signal })
      .then((data) => {
        if (active) setState({ status: "success", data, error: "" });
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setState({ status: "error", data: null, error: error.message });
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [date]);

  const handleDelete = async (intakeRecordId) => {
    if (deletingRecordId === intakeRecordId) return;

    setDeletingRecordId(intakeRecordId);
    setDeleteError("");

    try {
      await deleteIntakeRecord(intakeRecordId);
      const data = await getDailyRecords(date);
      setState({ status: "success", data, error: "" });
      setOpenMenuId(null);
    } catch (error) {
      setDeleteError(error.message || "섭취 기록 삭제에 실패했습니다.");
    } finally {
      setDeletingRecordId(null);
    }
  };

  const data = state.data;
  const caloriePercentage = useMemo(() => {
    if (!data?.recommendedCalories) return 0;
    return Math.min(
      100,
      Math.round((data.totalCalories / data.recommendedCalories) * 100),
    );
  }, [data]);

  return (
    <Page>
      <Header />
      <Main>
        <DateControls>
          <DateArrow
            type="button"
            $side="left"
            onClick={() => setDate(moveDate(date, -1))}
            aria-label="이전 날짜"
          >
            {"<"}
          </DateArrow>
          <DateInput
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="기록 날짜 선택"
          />
          <DateArrow
            type="button"
            $side="right"
            onClick={() => setDate(moveDate(date, 1))}
            aria-label="다음 날짜"
          >
            {">"}
          </DateArrow>
        </DateControls>
        {state.status === "error" && (
          <Status role="alert">{state.error}</Status>
        )}
        {state.status === "loading" && (
          <Status role="status">기록을 불러오고 있어요...</Status>
        )}
        {deleteError && <Status role="alert">{deleteError}</Status>}
        {data && (
          <>
            <Summary>
              <Total>
                <p>오늘 총 섭취량</p>
                <strong>{data.totalCalories.toLocaleString()}</strong>
                <span>kcal</span>
              </Total>
              <VerticalLine />
              <NutrientArea>
                <h2>주요 영양소 섭취 현황</h2>
                <NutrientGrid>
                  {data.nutrients.map((nutrient) => (
                    <Nutrient key={nutrient.key}>
                      <div className="icon" aria-hidden="true">
                        <img src={NUTRIENT_ICONS[nutrient.key]} alt="" />
                      </div>
                      <p>{nutrient.label}</p>
                      <strong>{nutrient.percentage}%</strong>
                      <Track
                        $percentage={nutrient.percentage}
                        $tone={nutrient.tone}
                      >
                        <span />
                      </Track>
                    </Nutrient>
                  ))}
                </NutrientGrid>
              </NutrientArea>
            </Summary>
            <Details>
              <Timeline>
                {data.records.length === 0 && (
                  <Empty>선택한 날짜에 기록된 제품이 없습니다.</Empty>
                )}
                {data.records.map((record) => (
                  <RecordRow
                    key={
                      record.id ?? `${record.productId}-${record.consumedAt}`
                    }
                  >
                    <span className="time">{record.time}</span>
                    {record.imageUrl ? (
                      <img src={record.imageUrl} alt="" />
                    ) : (
                      <div className="image-placeholder" />
                    )}
                    <div>
                      <h3>{record.productName}</h3>
                      <p>{record.amount}</p>
                    </div>
                    <strong>{record.calories} kcal</strong>
                    {record.id != null ? (
                      <RecordMenu>
                        <MenuButton
                          type="button"
                          aria-label={`${record.productName} 기록 메뉴`}
                          aria-expanded={openMenuId === record.id}
                          onClick={() =>
                            setOpenMenuId((currentId) =>
                              currentId === record.id ? null : record.id,
                            )
                          }
                        >
                          ···
                        </MenuButton>
                        {openMenuId === record.id && (
                          <DeleteButton
                            type="button"
                            disabled={deletingRecordId === record.id}
                            onClick={() => handleDelete(record.id)}
                          >
                            삭제하기
                          </DeleteButton>
                        )}
                      </RecordMenu>
                    ) : (
                      <span />
                    )}
                  </RecordRow>
                ))}
                <AddProduct to="/search">+ 다른 제품 추가하기</AddProduct>
              </Timeline>
              <CaloriePanel>
                <Donut $percentage={caloriePercentage}>
                  <strong>{caloriePercentage}%</strong>
                </Donut>
                <Recommendation>
                  권장 섭취량 {data.recommendedCalories.toLocaleString()} kcal
                </Recommendation>
                <CalorieTrack $percentage={caloriePercentage}>
                  <span />
                </CalorieTrack>
                <Feedback>
                  {caloriePercentage < 100
                    ? "아직 여유가 있어요!"
                    : "권장량을 확인해 주세요!"}
                </Feedback>
              </CaloriePanel>
            </Details>
          </>
        )}
      </Main>
    </Page>
  );
}

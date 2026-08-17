import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { getIngredientDetail } from "../api/ingredients";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  padding: 24px;
  background: rgb(22 19 24 / 52%);
  display: grid;
  place-items: center;
`;
const Dialog = styled.section`
  position: relative;
  width: min(650px, 100%);
  max-height: calc(100svh - 48px);
  padding: 38px 38px 34px;
  border: 1px solid #a032be;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 50px rgb(30 16 35 / 30%);
  overflow-y: auto;
`;
const CloseIcon = styled.button`
  position: absolute;
  top: 20px;
  right: 22px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5c5454;
  font-size: 34px;
  line-height: 32px;
  cursor: pointer;
`;
const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: #a032be;
  font-size: 16px;
  font-weight: 700;
`;
const Title = styled.h2`
  margin: 0 0 14px;
  padding-right: 42px;
  font-size: 32px;
`;
const Badges = styled.div`
  margin-bottom: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const Badge = styled.span`
  padding: 5px 18px;
  border: 1px solid ${({ $warning }) => ($warning ? "#ff9c37" : "#b866dc")};
  border-radius: 20px;
  color: ${({ $warning }) => ($warning ? "#ef7f00" : "#9134c2")};
  font-size: 14px;
  font-weight: 700;
`;
const DetailBox = styled.div`
  padding: 22px 24px;
  border: 1px solid #e5c8f2;
  border-radius: 10px;
  background: #fdfaff;
`;
const Summary = styled.h3`
  margin: 0 0 19px;
  color: #a032be;
  font-size: 18px;
  line-height: 1.5;
`;
const Description = styled.p`
  margin: 0 0 20px;
  color: #332d33;
  font-size: 16px;
  line-height: 1.75;
`;
const Code = styled.span`
  display: inline-block;
  padding: 7px 12px;
  border-radius: 6px;
  background: #f1edf3;
  color: #6d6670;
  font-size: 13px;
`;
const CloseButton = styled.button`
  width: 100%;
  height: 58px;
  margin-top: 24px;
  border: 0;
  border-radius: 8px;
  background: #a032be;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;
const Status = styled.div`
  min-height: 240px;
  display: grid;
  place-items: center;
  color: ${({ $error }) => ($error ? "#c62828" : "#5c5454")};
  font-size: 17px;
  text-align: center;
`;

const TYPE_LABELS = {
  ALLERGEN: "알레르기 유발 물질",
  SWEETENER: "대체당",
  SUGAR_ALCOHOL: "당알코올",
  ADDITIVE: "첨가물",
};

export default function IngredientDetailModal({ code, onClose }) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    getIngredientDetail(code, { signal: controller.signal })
      .then((data) => setState({ status: "success", data, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ status: "error", data: null, error: error.message });
        }
      });

    return () => {
      controller.abort();
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [code, onClose]);

  const data = state.data;

  return (
    <Overlay
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="ingredient-title"
      >
        <CloseIcon type="button" onClick={onClose} aria-label="팝업 닫기">
          ×
        </CloseIcon>
        {state.status !== "success" ? (
          <Status
            $error={state.status === "error"}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.status === "error"
              ? state.error
              : "성분 정보를 불러오고 있습니다..."}
          </Status>
        ) : (
          <>
            <Eyebrow>성분 상세 정보</Eyebrow>
            <Title id="ingredient-title">{data.name}</Title>
            <Badges>
              <Badge>
                {TYPE_LABELS[data.ingredientType] || data.ingredientType}
              </Badge>
              <Badge $warning={data.riskLevel === "WARNING"}>
                {data.riskLevel}
              </Badge>
            </Badges>
            <DetailBox>
              <Summary>{data.summary}</Summary>
              <Description>{data.description}</Description>
              <Code>코드: {data.code}</Code>
            </DetailBox>
            <CloseButton type="button" onClick={onClose}>
              닫기
            </CloseButton>
          </>
        )}
      </Dialog>
    </Overlay>
  );
}

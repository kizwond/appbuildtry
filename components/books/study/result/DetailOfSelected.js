import { useState } from "react";

import styled from "styled-components";

import { Select } from "antd";

import SectionForResult from "./SectionForResult";

import TableForNumberOfChangedCardStatus from "./DetailOfSelected/TableForNumberOfChangedCardStatus";
import TableForNumberOfChangedFlag from "./DetailOfSelected/TableForNumberOfChangedFlag";
import TableForNumberOfChangedLevel from "./DetailOfSelected/TableForNumberOfChangedLevel";
import TableForNumberOfCardsOnStages from "./DetailOfSelected/TableForNumberOfCardsOnStages";
import ChartForClickedTimesByDifficulty from "./DetailOfSelected/ChartForClickedTimesByDifficulty";
import { useMemo } from "react";

const DetailOfSelected = ({
  openClickedTimeOnCard,
  openChangedLevelOnCard,
  from,
}) => {
  const [selectedValue, setSelectedValue] = useState("Session");
  const [moreCardNumber, setMoreCardNumber] = useState(false);
  const [moreChangedLevel, setMoreChangedLevel] = useState(false);
  const [moreChangedCardStatus, setMoreChangedCardStatus] = useState(false);

  const resultOfSession = useMemo(() => {
    const removeProp = (obj, propToDelete) => {
      for (var property in obj) {
        if (typeof obj[property] == "object") {
          delete obj.property;
          let newJsonData = removeProp(obj[property], propToDelete);
          obj[property] = newJsonData;
        } else {
          if (property === propToDelete) {
            delete obj[property];
          }
        }
      }
      return obj;
    };
    return selectedValue === "Session"
      ? removeProp(
          JSON.parse(
            sessionStorage.getItem(
              from === "home"
                ? "resultOfSessionForSessionHistory"
                : "resultOfSession"
            )
          ),
          "__typename"
        )
      : removeProp(
          JSON.parse(
            sessionStorage.getItem(
              from === "home" ? "resultByBookForSessionHistory" : "resultByBook"
            )
          ).find((book) => book.mybook_id === selectedValue),
          "__typename"
        );
  }, [selectedValue, from]);

  return (
    <div className="w-full flex flex-col gap-[8px] pt-[8px]">
      <StyledAntSelect
        className="w-[50%] text-[1.4rem]"
        value={selectedValue}
        onChange={(v) => setSelectedValue(v)}
      >
        <Select.Option value="Session">세션전체</Select.Option>
        {JSON.parse(sessionStorage.getItem("resultByBook")).map((book) => (
          <Select.Option value={book.mybook_id} key={book.mybook_id}>
            {book.bookTitle}
          </Select.Option>
        ))}
      </StyledAntSelect>

      <SectionForResult
        title={
          <div className="flex items-end space-x-3">
            <div>카드수</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={() => setMoreCardNumber((pre) => !pre)}
            >
              {moreCardNumber ? "접기" : "더보기"}
            </a>
          </div>
        }
        content={
          <TableForNumberOfCardsOnStages
            numberOfCards={resultOfSession.numCards}
            more={moreCardNumber}
          />
        }
      />

      <SectionForResult
        title={
          <div className="flex items-end space-x-3">
            <div>클릭 수</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={openClickedTimeOnCard}
            >
              자세히보기
            </a>
          </div>
        }
        content={
          <ChartForClickedTimesByDifficulty
            clickedTimesByDifficulty={resultOfSession.clicks}
          />
        }
      />

      <SectionForResult
        title={
          <div className="flex items-end space-x-3">
            <div>레벨 변동</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={openChangedLevelOnCard}
            >
              자세히보기
            </a>
          </div>
        }
        content={
          <div>
            <TableForNumberOfChangedLevel
              changedLevel={resultOfSession.levelChange}
              more={moreChangedLevel}
            />
            <div className="text-right">
              <a
                className="text-[1rem] text-blue-700"
                onClick={() => setMoreChangedLevel((pre) => !pre)}
              >
                {moreChangedLevel ? "접기" : "펼치기"}
              </a>
            </div>
          </div>
        }
      />
      <SectionForResult
        title="카드 상태 변경"
        content={
          <div>
            <TableForNumberOfChangedCardStatus
              numberOfCards={resultOfSession.numCards}
              changedCardStatus={resultOfSession.statusChange}
              more={moreChangedCardStatus}
            />
            <div className="text-right">
              <a
                className="text-[1rem] text-blue-700"
                onClick={() => setMoreChangedCardStatus((pre) => !pre)}
              >
                {moreChangedCardStatus ? "접기" : "펼치기"}
              </a>
            </div>
          </div>
        }
      />
      <SectionForResult
        title="사용자 플래그 변경"
        content={
          <TableForNumberOfChangedFlag
            changedFlag={resultOfSession.userFlagChange}
          />
        }
      />
    </div>
  );
};

export default DetailOfSelected;

const StyledAntSelect = styled(Select)`
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    border-right-width: 1px !important;
    outline: 0;
  }

  .ant-select-selection-item {
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

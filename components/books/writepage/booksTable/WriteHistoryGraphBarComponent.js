import moment from "moment";
import React from "react";
import { useMemo } from "react";
import styled from "styled-components";

const WriteHistoryGraphBarComponent = ({ _record }) => {
  const historyData = useMemo(() => {
    const now = new Date();

    const today = moment(now).format("YYYYMMDD");
    const todayCards = _record.writeHistory?.filter(
      (_arr) => _arr.date === today
    )[0];
    const todayCreatedCards = todayCards ? todayCards.numCreatedCards : 0;

    const yesterday = moment(now).subtract(1, "days").format("YYYYMMDD");
    const yesterdayCards = _record.writeHistory?.filter(
      (_arr) => _arr.date === yesterday
    )[0];
    const yesterdayCreatedCards = yesterdayCards
      ? yesterdayCards.numCreatedCards
      : 0;

    const theDayBeforeYesterday = moment(now)
      .subtract(1, "days")
      .format("YYYYMMDD");
    const theDayBeforeYesterdayCards = _record.writeHistory?.filter(
      (_arr) => _arr.date === theDayBeforeYesterday
    )[0];
    const theDayBeforeYesterdayCreatedCards = theDayBeforeYesterdayCards
      ? theDayBeforeYesterdayCards.numCreatedCards
      : 0;

    return {
      todayCreatedCards,
      yesterdayCreatedCards,
      theDayBeforeYesterdayCreatedCards,
    };
  }, [_record.writeHistory]);

  const {
    todayCreatedCards,
    yesterdayCreatedCards,
    theDayBeforeYesterdayCreatedCards,
  } = historyData;

  return (
    <div>
      <StyledGraphBarWrapper booktype={_record.type}>
        <div className="FlexContainer">
          <div className="SingleBar">
            <div className="GraphBar">
              <div
                className="AchivedCard"
                style={{
                  height:
                    theDayBeforeYesterdayCreatedCards >= 100
                      ? "100%"
                      : // `${theDayBeforeYesterdayCreatedCards}%`
                        "10%",
                }}
              >
                <span className="CardCounter">
                  {theDayBeforeYesterdayCreatedCards === 0
                    ? // "-"
                      10
                    : theDayBeforeYesterdayCreatedCards}
                </span>
              </div>
            </div>
          </div>
          <div className="SingleBar">
            <div className="GraphBar">
              <div
                className="AchivedCard"
                style={{
                  height:
                    yesterdayCreatedCards >= 100
                      ? "100%"
                      : //  `${yesterdayCreatedCards}%`
                        "50%",
                }}
              >
                <span className="CardCounter">
                  {yesterdayCreatedCards === 0
                    ? // "-"
                      50
                    : yesterdayCreatedCards}
                </span>
              </div>
            </div>
          </div>
          <div className="SingleBar">
            <div className="GraphBar">
              <div
                className="AchivedCard"
                style={{
                  height:
                    todayCreatedCards >= 100
                      ? "100%"
                      : //  `${todayCreatedCards}%`
                        "100%",
                }}
              >
                <span className="CardCounter">
                  {todayCreatedCards === 0
                    ? // "-"
                      100
                    : todayCreatedCards}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="BottomLine"></div>
      </StyledGraphBarWrapper>
    </div>
  );
};

export default WriteHistoryGraphBarComponent;

const StyledGraphBarWrapper = styled.div`
  width: 100%;
  min-width: 70px;
  /* position: absolute; */
  /* bottom: 0.7rem; */

  & .FlexContainer {
    display: flex;
    justify-content: space-around;
  }
  & .BottomLine {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #c5c6c7;
  }

  & .SingleBar {
    width: 100%;
    margin-left: 4%;
    margin-right: 4%;
  }
  & .GraphBar {
    position: relative;
    height: 2.167rem;
    background: #edeee900;
  }
  & .AchivedCard {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: ${(props) => {
      const bgColor =
        props.booktype === "my"
          ? "#4dadfe"
          : props.booktype === "buy"
          ? "#ff6f56"
          : console.log(new Error("책 타입 잘못 설정됨"));
      return bgColor;
    }};
    display: flex;
    justify-content: center;
  }
  & .CardCounter {
    position: relative;
    font-size: 0.833rem;
    bottom: 1.1rem;
    display: block;
  }
`;

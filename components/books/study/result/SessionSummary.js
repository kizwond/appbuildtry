import moment from "moment";
import prettyMilliseconds from "pretty-ms";
import { useCallback } from "react";
import { useMemo } from "react";
import BoxForSessionSummary from "./BoxForSessionSummary";

const SessionSummary = () => {
  const resultOfSession = useMemo(
    () => JSON.parse(sessionStorage.getItem("resultOfSession")),
    []
  );

  const { completed, hold, ing, yet } = resultOfSession.numCards;

  const gainedLevel = useMemo(() => {
    const totalGap =
      Math.round(resultOfSession.levelChange.total.gap * 100) / 100;
    const changeString = (totalGap) => {
      if (totalGap > 0) {
        return "+" + totalGap;
      }
      if (totalGap < 0) {
        return "" + totalGap;
      }
      return "-";
    };
    const result = changeString(totalGap);
    return result;
  }, [resultOfSession]);
  const time = useMemo(
    () =>
      prettyMilliseconds(resultOfSession.studyHour, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      }),
    [resultOfSession]
  );

  const startedTime = useMemo(
    () => moment(sessionStorage.getItem("started")).format("M.D hh:mm"),
    []
  );

  const endedTime = useMemo(
    () =>
      moment(sessionStorage.getItem("endTimeOfSession")).format("M.D hh:mm"),
    []
  );

  const displayTime = useCallback((time) => {
    switch (time.length) {
      case 4:
        return "00:0" + time;
      case 5:
        return "00:" + time;
      case 6:
        return "00" + time;
      case 7:
        return "0" + time;
      case 8:
        return time;

      default:
        break;
    }
  }, []);

  return (
    <div className="grid w-full grid-cols-3 grid-rows-2 gap-4">
      <BoxForSessionSummary title={"학습 시작"} content={startedTime} />
      <BoxForSessionSummary title={"학습 종료"} content={endedTime} />
      <BoxForSessionSummary
        title={"실제 학습 시간"}
        content={displayTime(time)}
      />
      <BoxForSessionSummary
        title={"학습 시작 카드"}
        content={
          completed.started + hold.started + ing.started + yet.started + "장"
        }
      />
      <BoxForSessionSummary
        title={"학습 완료 카드"}
        content={
          completed.finished +
          hold.finished +
          ing.finished +
          yet.finished +
          "장"
        }
      />
      <BoxForSessionSummary title={"레벨 획득"} content={gainedLevel} />
    </div>
  );
};

export default SessionSummary;

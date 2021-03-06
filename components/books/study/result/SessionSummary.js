import moment from "moment";
import prettyMilliseconds from "pretty-ms";
import { useCallback } from "react";
import { useMemo } from "react";
import BoxForSummaryOfMainPage from "../../../common/commonComponent/BoxForSummaryOfMainPage";

const SessionSummary = ({ from }) => {
  const resultOfSession = useMemo(
    () =>
      JSON.parse(
        sessionStorage.getItem(
          from === "home"
            ? "resultOfSessionForSessionHistory"
            : "resultOfSession"
        )
      ),
    [from]
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

  const startedTime = useMemo(() => {
    const time = moment(
      new Date(
        sessionStorage.getItem(
          from === "home" ? "startTimeForSessionHistory" : "started"
        )
      )
    ).format("M.D hh:mm");

    return time === "Invalid date" ? null : time;
  }, [from]);

  const endedTime = useMemo(() => {
    const time = moment(
      new Date(
        sessionStorage.getItem(
          from === "home" ? "endTimeForSessionHistory" : "endTimeOfSession"
        )
      )
    ).format("M.D hh:mm");
    return time === "Invalid date" ? null : time;
  }, [from]);

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
      <BoxForSummaryOfMainPage title={"?????? ??????"} content={startedTime} />
      <BoxForSummaryOfMainPage title={"?????? ??????"} content={endedTime} />
      <BoxForSummaryOfMainPage
        title={"?????? ?????? ??????"}
        content={displayTime(time)}
      />
      <BoxForSummaryOfMainPage
        title={"?????? ?????? ??????"}
        content={
          completed.started + hold.started + ing.started + yet.started + "???"
        }
      />
      <BoxForSummaryOfMainPage
        title={"?????? ?????? ??????"}
        content={
          completed.finished +
          hold.finished +
          ing.finished +
          yet.finished +
          "???"
        }
      />
      <BoxForSummaryOfMainPage title={"?????? ??????"} content={gainedLevel} />
    </div>
  );
};

export default SessionSummary;

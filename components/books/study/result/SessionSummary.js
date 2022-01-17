import moment from "moment";
import prettyMilliseconds from "pretty-ms";
import BoxForSessionSummary from "./BoxForSessionSummary";

const SessionSummary = () => {
  const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));

  const { completed, hold, ing, yet } = resultOfSession.numCards;

  const totalGap =
    Math.round(resultOfSession.levelChange.total.gap * 100) / 100;

  const time = prettyMilliseconds(
    JSON.parse(sessionStorage.getItem("resultOfSession")).studyHour,
    { colonNotation: true, secondsDecimalDigits: 0 }
  );
  const displayTime = (time) => {
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
  };
  return (
    <div className="grid w-full grid-cols-3 grid-rows-2 gap-4">
      <BoxForSessionSummary
        title={"학습 시작"}
        content={moment(sessionStorage.getItem("started")).format("M.D hh:mm")}
      />
      <BoxForSessionSummary
        title={"학습 종료"}
        content={moment(sessionStorage.getItem("endTimeOfSession")).format(
          "M.D hh:mm"
        )}
      />
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
      <BoxForSessionSummary
        title={"레벨 획득"}
        content={
          ((totalGap) => {
            if (totalGap > 0) {
              return "+" + totalGap;
            }
            if (totalGap < 0) {
              return "" + totalGap;
            }
            return "-";
          })(totalGap)
          // totalGap > 0 ? "+" + totalGap : totalGap < 0 ? "-" + totalGap : "-"
        }
      />
    </div>
  );
};

export default SessionSummary;

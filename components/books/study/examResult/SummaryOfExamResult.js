import moment from "moment";
import { useMemo } from "react";
import BoxForSummaryOfMainPage from "../../../../components/common/commonComponent/BoxForSummaryOfMainPage";

const SummaryOfExamResult = ({ cards }) => {
  const startedTime = useMemo(
    () =>
      moment(new Date(sessionStorage.getItem("started"))).format("M.D hh:mm"),
    []
  );
  const endedTime = useMemo(
    () =>
      moment(new Date(sessionStorage.getItem("endTimeOfSession"))).format(
        "M.D hh:mm"
      ),
    []
  );

  const totalNumberOfCards = cards.length;
  const numberOfRightAnsweredCards = cards.filter(
    (card) => card.studyStatus.recentExamResult === "O"
  ).length;

  const rateOfRightAnswer = Math.floor(
    (numberOfRightAnsweredCards / totalNumberOfCards) * 100
  );

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <BoxForSummaryOfMainPage title="시험 시작" content={startedTime} />
      <BoxForSummaryOfMainPage title="시험 종료" content={endedTime} />
      <BoxForSummaryOfMainPage
        title="정답율"
        content={`${numberOfRightAnsweredCards}/${totalNumberOfCards} (${rateOfRightAnswer}%)`}
      />
    </div>
  );
};

export default SummaryOfExamResult;

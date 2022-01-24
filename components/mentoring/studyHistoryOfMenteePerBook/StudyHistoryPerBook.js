import { useQuery } from "@apollo/client";
import moment from "moment";
import styled from "styled-components";
import { QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID } from "../../../graphql/query/allQuery";

const StudyHistoryPerBook = ({ mybook_id }) => {
  const { data, variables } = useQuery(QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID, {
    onCompleted: (received_data) => {
      if (received_data.session_getSessionByMybookid.status === "200") {
        console.log("멘토링용 책 섹션 데이터 받음", received_data);
      } else if (received_data.session_getSessionByMybookid.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
    variables: {
      mybook_id,
      mybook_ids: [mybook_id],
    },
  });

  return (
    <div className="">
      {data && (
        <>
          <div className="mb-3 px-2 bg-white">
            최근 일주일 학습 실적
            <TableForMentorSessionHistory data={data} />
          </div>{" "}
          <div className="mb-3 px-2 bg-white">
            최근 일주일 학습 실적
            <ChartForStudiedCardsPerDay data={data} />
          </div>
          <div className="mb-3 px-2 bg-white">
            최근 일주일 학습 실적
            <ChartForGainedLevelPerDay data={data} />
          </div>
          <div className="mb-3 px-2 bg-white">
            학습 시간 많은 카드
            <TableForRankedCards data={data} contentType="hours" />
          </div>
          <div className="mb-3 px-2 bg-white">
            학습 횟수 많은 카드
            <TableForRankedCards data={data} contentType="times" />
          </div>
        </>
      )}
    </div>
  );
};

export default StudyHistoryPerBook;

const TableForRankedCards = ({ data, contentType }) => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] font-normal bg-slate-100 w-[10%]">순위</th>
        <th className="text-[1rem] font-normal bg-slate-100">앞면</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
          {contentType === "hours" ? "학습시간" : "학습횟수"}
        </th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[13%]"></th>
      </tr>
    </thead>
    <tbody>
      {data.cardset_getByMybookIDs.cardsets[0].cards.map((card, i) => {
        return (
          <tr
            key={card._id}
            className="border-b border-collapse border-b-gray-200"
          >
            <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
              {i}
            </td>
            <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
              동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세
            </td>
            <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
              {contentType === "hours"
                ? card.studyStatus.totalStudyHour
                : card.studyStatus.totalStudyTimes}
            </td>
            <td className="text-[1rem] py-[4px] font-normal text-center">→</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const ChartForStudiedCardsPerDay = ({ data }) => {
  const maxStudiedTimes = _.max(
    data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory.map(
      ({ numCardsByStatus: { ing, hold, yet, completed } }) =>
        completed + ing + hold + yet
    )
  );

  return (
    <div>
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-yellow-500"></div>
          <div className="text-[12px]">미완료카드</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-blue-500"></div>
          <div className="text-[12px]">완료카드</div>
        </div>
      </div>
      <div className="w-full overflow-x-scroll overflow-y-hidden">
        <ul className="table h-[140px] py-5">
          {data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory
            .map(
              ({ numCardsByStatus: { ing, hold, yet, completed }, date }) => {
                const totalStudiedTimes = completed + ing + hold + yet;
                const barHeightPercentage =
                  Math.round((totalStudiedTimes / maxStudiedTimes) * 100) + "%";
                const incompletedTimes = ing + hold + yet;
                const percentageOfIncompleted =
                  Math.round((incompletedTimes / totalStudiedTimes) * 100) +
                  "%";
                const completedTimes = completed;
                const percentageOfCompleted =
                  Math.round((completedTimes / totalStudiedTimes) * 100) + "%";
                return {
                  date: moment(date).format("M월D일"),
                  totalStudiedTimes,
                  barHeightPercentage,
                  incompletedTimes,
                  percentageOfIncompleted,
                  completedTimes,
                  percentageOfCompleted,
                };
              }
            )
            .map(
              ({
                date,
                totalStudiedTimes,
                barHeightPercentage,
                incompletedTimes,
                percentageOfIncompleted,
                completedTimes,
                percentageOfCompleted,
              }) => (
                <li
                  key={date}
                  className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                >
                  <StyledBar
                    total={totalStudiedTimes}
                    barHeightPercentage={barHeightPercentage}
                    date={date}
                    percentageOfIncompleted={percentageOfIncompleted}
                    percentageOfCompleted={percentageOfCompleted}
                  >
                    <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                      {incompletedTimes}
                    </div>
                    <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                      {completedTimes}
                    </div>
                  </StyledBar>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
};
const ChartForGainedLevelPerDay = ({ data }) => {
  const maxLevel = _.max(
    data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory.map(
      ({ level: { completed, nonCompleted } }) =>
        Math.floor(completed * 1000 + nonCompleted * 1000) / 1000
    )
  );

  return (
    <div>
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-yellow-500"></div>
          <div className="text-[12px]">미완료카드</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-blue-500"></div>
          <div className="text-[12px]">완료카드</div>
        </div>
      </div>
      <div className="w-full overflow-x-scroll overflow-y-hidden">
        <ul className="table h-[140px] py-5">
          {data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory
            .map(({ level: { completed, nonCompleted }, date }, index, arr) => {
              const totalLevel =
                Math.floor(completed * 1000 + nonCompleted * 1000) / 1000;
              console.log({ totalLevel });
              const barHeightPercentage =
                Math.round((totalLevel / maxLevel) * 100) + "%";
              const incompletedLevel = nonCompleted;
              const percentageOfIncompleted =
                Math.round((incompletedLevel / totalLevel) * 100) + "%";
              const completedLevel = completed;
              const percentageOfCompleted =
                Math.round((completedLevel / totalLevel) * 100) + "%";
              return {
                date: moment(date).format("M월D일"),
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              };
            })
            .map(
              ({
                date,
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              }) => (
                <li
                  key={date}
                  className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                >
                  <StyledBar
                    total={totalLevel}
                    barHeightPercentage={barHeightPercentage}
                    date={date}
                    percentageOfIncompleted={percentageOfIncompleted}
                    percentageOfCompleted={percentageOfCompleted}
                  >
                    <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                      {incompletedLevel}
                    </div>
                    <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                      {completedLevel}
                    </div>
                  </StyledBar>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
};

const StyledBar = styled.div`
  height: ${(props) => props.barHeightPercentage};
  &:before {
    content: "${(props) => props.date}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    top: 100%;
    left: 0;
    right: 0;
  }
  &:after {
    content: "${(props) => props.total}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    bottom: ${(props) => props.barHeightPercentage};
    left: 0;
    right: 0;
  }

  .incompleted {
    height: ${(props) => props.percentageOfIncompleted};
  }
  .completed {
    height: ${(props) => props.percentageOfCompleted};
  }
`;

const TableForMentorSessionHistory = ({ data }) => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] font-normal bg-slate-100 w-[15%]">시작일</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[30%]">
          학습모드
        </th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[31%]">시간</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[24%]"></th>
      </tr>
    </thead>
    <tbody>
      {data.session_getSessionByMybookid?.sessions?.map((session) => {
        const startedDate = moment(session.session_info.timeStarted).format(
          "M/D"
        );

        const studyMode =
          session.sessionConfig.studyMode === "flip"
            ? "뒤집기"
            : session.sessionConfig.studyMode === "read"
            ? "읽기"
            : session.sessionConfig.studyMode === "exam"
            ? "시험"
            : new Error(
                `${session.sessionConfig.studyMode}는 알 수 없는 학습 모드입니다`
              );

        const timeOnSessionStage = `${moment(
          session.session_info.timeStarted
        ).format("HH:mm")} ~ ${moment(session.session_info.timeFinished).format(
          "HH:mm"
        )}`;

        const isWithBook = session.sessionScope.length > 1 ? "(혼합)" : null;
        return (
          <tr
            key={session._id}
            className="border-b border-collapse border-b-gray-200"
          >
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200  text-center">
              {startedDate}
            </td>
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
              {studyMode}
              {isWithBook}
            </td>
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
              {timeOnSessionStage}
            </td>
            <td className="text-[1rem] font-normal text-center">
              <a>자세히보기</a>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

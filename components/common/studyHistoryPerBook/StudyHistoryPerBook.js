import { useQuery } from "@apollo/client";
import { forwardRef, memo, useMemo, useState } from "react";
import styled from "styled-components";
import {
  QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID,
  QUERY_SESSION_STATUS_BY_BOOK_ID,
} from "../../../graphql/query/allQuery";

import { Drawer } from "antd";

import SectionWrapper from "../../common/commonComponent/SectionWrapper";
import BoxForSummaryOfMainPage from "../../common/commonComponent/BoxForSummaryOfMainPage";
import StudyHistoryOfLastWeek from "./StudyHistoryOfLastWeek";
import ChartForStudiedCardsPerDay from "./ChartForStudiedCardsPerDay";
import ChartForGainedLevelPerDay from "./ChartForGainedLevelPerDay";
import TableForRankedCards from "./TableForRankedCards";
import TableForAllCards from "./TableForAllCards";
import TableForStatusOfCard from "./TableForStatusOfCard";

const StudyHistoryPerBook = ({ mybook_id, menteeUser_id, forWhom }) => {
  const [drawerVisibleForAllStudyHistory, setDrawerVisibleForAllStudyHistory] =
    useState(false);
  const [drawerVisibleForStudyHourCards, setDrawerVisibleForStudyHourCards] =
    useState(false);
  const [drawerVisibleForStudyTimesCards, setDrawerVisibleForStudyTimesCards] =
    useState(false);

  const queryNameOfBook =
    forWhom === "mentor"
      ? "mybook_getMybookForMentor"
      : "mybook_getMybookByMybookIDs";
  const queryNameOfSession =
    forWhom === "mentor"
      ? "session_getSessionByMybookidForMentor"
      : "session_getSessionByMybookid";
  const queryNameOfCardset =
    forWhom === "mentor"
      ? "cardset_getCardsetByMybookidForMentor"
      : "cardset_getByMybookIDs";

  const { data, variables } = useQuery(
    forWhom === "mentor"
      ? QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID
      : QUERY_SESSION_STATUS_BY_BOOK_ID,
    {
      onCompleted: async (received_data) => {
        if (received_data[`${queryNameOfCardset}`].status === "200") {
          console.log("멘토링용 책 섹션 데이터 받음", received_data);
        } else if (
          received_data[
            `${
              forWhom === "mentor"
                ? "mybook_getMybookForMentor"
                : "session_getSessionByMybookid"
            }`
          ].status === "400"
        ) {
          console.log("접근 권한이 없음", received_data);
          location.href = "/m/mentoring";
        } else if (received_data[`${queryNameOfCardset}`].status === "401") {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
      variables:
        forWhom === "mentor"
          ? {
              forGetSessionByMybookidForMentor: {
                menteeUser_id,
                mybook_id,
              },
              forGetCardsetByMybookidForMentor: {
                menteeUser_id,
                mybook_id,
              },
              forGetMybookForMentor: {
                menteeUser_id,
                mybook_id,
              },
            }
          : {
              mybook_id,
              mybook_ids: [mybook_id],
            },
    }
  );

  const {
    ing: Ing,
    hold: Hold,
    yet: Yet,
    completed: Completed,
  } = data
    ? _(data[`${queryNameOfBook}`].mybooks[0].stats.studyHistory)
        .takeRight()
        .value()[0].numCardsByStatus
    : { ing: 0, hold: 0, yet: 0, completed: 0 };

  const currentNumberOfIncompletedCards = Ing + Hold + Yet;

  const { completed, nonCompleted } = data
    ? _(data[`${queryNameOfBook}`].mybooks[0].stats.studyHistory)
        .takeRight()
        .value()[0].level
    : { ing: 0, hold: 0, yet: 0, completed: 0 };

  const currentLevelOfIncompletedCards =
    Math.floor((nonCompleted / currentNumberOfIncompletedCards) * 100) / 100;

  return (
    <div className="">
      {data &&
        data[`${queryNameOfBook}`] &&
        data[`${queryNameOfBook}`].mybooks &&
        data[`${queryNameOfBook}`].mybooks.length > 0 && (
          <div className="w-full flex flex-col gap-[8px]">
            <SectionWrapper
              title="요약"
              content={
                <div className="flex justify-between w-full gap-2">
                  <div className="min-w-[90px] flex flex-col gap-[2px]">
                    <div className="text-base text-center font-[600] border border-gray-200  bg-slate-100">
                      완료 카드수
                    </div>
                    <div className="text-base text-center font-[600] text-[1.16667rem] h-[40px] py-[10px] border border-gray-200">
                      {completed}장
                    </div>
                  </div>
                  <div className="min-w-[90px] flex flex-col gap-[2px]">
                    <div className="text-base text-center font-[600] border border-gray-200  bg-slate-100">
                      미완료 카드수
                    </div>
                    <div className="text-base text-center font-[600] text-[1.16667rem] h-[40px] py-[10px] border border-gray-200">
                      {currentNumberOfIncompletedCards}장
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-[2px]">
                    <div className="text-base text-center font-[600] border border-gray-200  bg-slate-100">
                      미완료 카드 평균 레벨
                    </div>
                    <div className="text-base text-center font-[600] text-[1.16667rem] h-[40px] py-[10px] border border-gray-200">
                      {currentLevelOfIncompletedCards}
                    </div>
                  </div>
                </div>
              }
            />
            <SectionWrapper
              title={
                <div className="flex items-end space-x-3">
                  <div className="!text-[1.16667rem]">최근 학습 실적</div>
                  <a
                    className="!text-[1rem] text-blue-700"
                    onClick={() => {
                      setDrawerVisibleForAllStudyHistory(true);
                    }}
                  >
                    자세히 보기
                  </a>
                </div>
              }
              content={
                <StudyHistoryOfLastWeek
                  data={data}
                  forWhom={forWhom}
                  menteeUser_id={menteeUser_id}
                />
              }
            />
            <DrawerWrapper
              title="최근 학습 실적"
              placement="right"
              width={"100%"}
              visible={drawerVisibleForAllStudyHistory}
              onClose={() => {
                setDrawerVisibleForAllStudyHistory(false);
              }}
              headerStyle={{ padding: "12px 12px 8px 12px" }}
              bodyStyle={{ backgroundColor: "#e9e9e9" }}
            >
              <div className="p-2 mb-3 bg-white">
                {drawerVisibleForAllStudyHistory && (
                  <StudyHistoryOfLastWeek
                    data={data}
                    isAllList
                    forWhom={forWhom}
                    menteeUser_id={menteeUser_id}
                  />
                )}
              </div>
            </DrawerWrapper>

            <SectionWrapper
              title="총 학습 카드 개수"
              content={
                <ChartForStudiedCardsPerDay
                  book={data[`${queryNameOfBook}`].mybooks[0]}
                />
              }
            />
            <SectionWrapper
              title="총 획득 레벨"
              content={
                <ChartForGainedLevelPerDay
                  book={data[`${queryNameOfBook}`].mybooks[0]}
                />
              }
            />

            <SectionWrapper
              title={
                <div className="flex items-end space-x-3">
                  <div className="!text-[1.16667rem]">학습 시간 많은 카드</div>
                  <a
                    className="!text-[1rem] text-blue-700"
                    onClick={() => {
                      setDrawerVisibleForStudyHourCards(true);
                    }}
                  >
                    자세히 보기
                  </a>
                </div>
              }
              content={
                <TableForRankedCards
                  data={data}
                  contentType="hours"
                  forWhom={forWhom}
                />
              }
            />
            <DrawerWrapper
              title="학습 시간 많은 카드"
              placement="right"
              width={"100%"}
              visible={drawerVisibleForStudyHourCards}
              onClose={() => {
                setDrawerVisibleForStudyHourCards(false);
              }}
              headerStyle={{ padding: "12px 12px 8px 12px" }}
              bodyStyle={{ backgroundColor: "#e9e9e9" }}
            >
              <div className="p-2 mb-3 bg-white">
                {drawerVisibleForStudyHourCards && (
                  <TableForAllCards
                    cards={data[`${queryNameOfCardset}`].cardsets[0].cards}
                    contentType="hours"
                  />
                )}
              </div>
            </DrawerWrapper>

            <SectionWrapper
              title={
                <div className="flex items-end space-x-3">
                  <div className="!text-[1.16667rem]">학습 횟수 많은 카드</div>
                  <a
                    className="!text-[1rem] text-blue-700"
                    onClick={() => {
                      setDrawerVisibleForStudyTimesCards(true);
                    }}
                  >
                    자세히 보기
                  </a>
                </div>
              }
              content={
                <TableForRankedCards
                  data={data}
                  contentType="times"
                  forWhom={forWhom}
                />
              }
            />
            <DrawerWrapper
              title="학습 횟수 많은 카드"
              placement="right"
              width={"100%"}
              visible={drawerVisibleForStudyTimesCards}
              onClose={() => {
                setDrawerVisibleForStudyTimesCards(false);
              }}
              headerStyle={{ padding: "12px 12px 8px 12px" }}
              bodyStyle={{ backgroundColor: "#e9e9e9" }}
            >
              <div className="p-2 mb-3 bg-white">
                {drawerVisibleForStudyTimesCards && (
                  <TableForAllCards
                    cards={data[`${queryNameOfCardset}`].cardsets[0].cards}
                    contentType="times"
                  />
                )}
              </div>
            </DrawerWrapper>

            <SectionWrapper
              title="카드 상태"
              content={
                <TableForStatusOfCard
                  hold={
                    data[`${queryNameOfBook}`]?.mybooks[0]?.stats?.studyHistory[
                      data[`${queryNameOfBook}`]?.mybooks[0]?.stats
                        ?.studyHistory.length - 1
                    ]?.numCardsByStatus?.hold
                  }
                  yet={
                    data[`${queryNameOfBook}`]?.mybooks[0]?.stats?.studyHistory[
                      data[`${queryNameOfBook}`]?.mybooks[0]?.stats
                        ?.studyHistory.length - 1
                    ]?.numCardsByStatus?.yet
                  }
                  completed={
                    data[`${queryNameOfBook}`]?.mybooks[0]?.stats?.studyHistory[
                      data[`${queryNameOfBook}`]?.mybooks[0]?.stats
                        ?.studyHistory.length - 1
                    ]?.numCardsByStatus?.completed
                  }
                  ing={
                    data[`${queryNameOfBook}`]?.mybooks[0]?.stats?.studyHistory[
                      data[`${queryNameOfBook}`]?.mybooks[0]?.stats
                        ?.studyHistory.length - 1
                    ]?.numCardsByStatus?.ing
                  }
                />
              }
            />
          </div>
        )}
    </div>
  );
};

export default StudyHistoryPerBook;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
  height: calc(100vh - 40px);
`;

import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID } from "../../../graphql/query/allQuery";

import { Drawer } from "antd";

import SectionWrapper from "../../common/commonComponent/SectionWrapper";
import StudyHistoryOfLastWeek from "./StudyHistoryOfLastWeek";
import ChartForStudiedCardsPerDay from "./ChartForStudiedCardsPerDay";
import ChartForGainedLevelPerDay from "./ChartForGainedLevelPerDay";
import TableForRankedCards from "./TableForRankedCards";
import TableForAllCards from "./TableForAllCards";
import TableForStatusOfCard from "./TableForStatusOfCard";

const StudyHistoryPerBook = ({ mybook_id }) => {
  const [drawerVisibleForAllStudyHistory, setDrawerVisibleForAllStudyHistory] =
    useState(false);
  const [drawerVisibleForStudyHourCards, setDrawerVisibleForStudyHourCards] =
    useState(false);
  const [drawerVisibleForStudyTimesCards, setDrawerVisibleForStudyTimesCards] =
    useState(false);

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

  const numberOfCards = useMemo(
    () => ({
      hold:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.hold ?? 0,
      ing:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.ing ?? 0,
      completed:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.completed ?? 0,
      yet:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.yet ?? 0,
    }),
    [data]
  );

  return (
    <div className="">
      {data && (
        <div className="w-full flex flex-col gap-[8px]">
          <SectionWrapper
            title={
              <div className="flex items-end space-x-3">
                <div>최근 학습 실적</div>
                <a
                  className="text-[1rem] text-blue-700"
                  onClick={() => {
                    setDrawerVisibleForAllStudyHistory(true);
                  }}
                >
                  자세히 보기
                </a>
              </div>
            }
            content={<StudyHistoryOfLastWeek data={data} />}
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
                <StudyHistoryOfLastWeek data={data} isAllList />
              )}
            </div>
          </DrawerWrapper>

          <SectionWrapper
            title="총 학습 카드 개수"
            content={<ChartForStudiedCardsPerDay data={data} />}
          />
          <SectionWrapper
            title="총 획득 레벨"
            content={<ChartForGainedLevelPerDay data={data} />}
          />

          <SectionWrapper
            title={
              <div className="flex items-end space-x-3">
                <div>학습 시간 많은 카드</div>
                <a
                  className="text-[1rem] text-blue-700"
                  onClick={() => {
                    setDrawerVisibleForStudyHourCards(true);
                  }}
                >
                  자세히 보기
                </a>
              </div>
            }
            content={<TableForRankedCards data={data} contentType="hours" />}
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
                  cards={data.cardset_getByMybookIDs.cardsets[0].cards}
                  contentType="hours"
                />
              )}
            </div>
          </DrawerWrapper>

          <SectionWrapper
            title={
              <div className="flex items-end space-x-3">
                <div>학습 횟수 많은 카드</div>
                <a
                  className="text-[1rem] text-blue-700"
                  onClick={() => {
                    setDrawerVisibleForStudyTimesCards(true);
                  }}
                >
                  자세히 보기
                </a>
              </div>
            }
            content={<TableForRankedCards data={data} contentType="times" />}
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
                  cards={data.cardset_getByMybookIDs.cardsets[0].cards}
                  contentType="times"
                />
              )}
            </div>
          </DrawerWrapper>

          <SectionWrapper
            title="카드 상태"
            content={
              <TableForStatusOfCard
                hold={numberOfCards.hold}
                yet={numberOfCards.yet}
                completed={numberOfCards.completed}
                ing={numberOfCards.ing}
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

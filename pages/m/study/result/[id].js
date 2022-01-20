import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { useLazyQuery } from "@apollo/client";

import {
  QUERY_MY_CARD_CONTENTS,
  QUERY_BUY_CARD_CONTENTS,
} from "../../../../graphql/query/allQuery";

import M_Layout from "../../../../components/layout/M_Layout";
import SectionForResult from "../../../../components/books/study/result/SectionForResult";
import TableForStudiedCards from "../../../../components/books/study/result/TableForStudiedCards";

import SessionSummary from "../../../../components/books/study/result/SessionSummary";
import SlidingDrawerForAllCards from "../../../../components/books/study/result/SlidingDrawerForAllCards";
import DetailOfSelected from "../../../../components/books/study/result/DetailOfSelected";
import BoxForSessionSummary from "../../../../components/books/study/result/BoxForSessionSummary";
import moment from "moment";

const StudyResult = () => {
  const router = useRouter();

  const [clickedCounterForAllDrawers, setClickedCounterForAllDrawers] =
    useState(0);

  const [visibleClickedTimesPage, setVisibleClickedTimesPage] = useState(false);
  const [visibleElapsedTimeOnCard, setVisibleElapsedTimeOnCard] =
    useState(false);
  const [visibleClickedTimeOnCard, setVisibleClickedTimeOnCard] =
    useState(false);
  const [visibleChagnedLevelOnCard, setVisibleChagnedLevelOnCard] =
    useState(false);

  const [getMyCardsContent, { data, loading, error }] = useLazyQuery(
    QUERY_MY_CARD_CONTENTS,
    {
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );
  const [getBuyCardsContent, { data: buyContentsData }] = useLazyQuery(
    QUERY_BUY_CARD_CONTENTS,
    {
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );

  useEffect(() => {
    if (clickedCounterForAllDrawers === 1) {
      const buyContentsIds = topFiveCardsBySubject.clickedCards
        .filter((card) => card.content.location === "buy")
        .map((card) => card.content.mycontent_id);
      const myContentsIds = topFiveCardsBySubject.clickedCards
        .filter((card) => card.content.location === "my")
        .map((card) => card.content.mycontent_id);
      if (myContentsIds.length > 0) {
        getMyCardsContentForAllCards({
          variables: {
            mycontent_ids: myContentsIds,
          },
        });
      }
      if (buyContentsIds.length > 0) {
        getBuyCardsContentForAllCards({
          variables: {
            buycontent_ids: buyContentsIds,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedCounterForAllDrawers]);

  const ISSERVER = typeof window === "undefined";

  const topFiveCardsBySubject = useMemo(() => {
    if (!ISSERVER) {
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

      const insertedCardList = removeProp(
        JSON.parse(sessionStorage.getItem("cardListStudying")),
        "__typename"
      );
      const createdCards = removeProp(
        JSON.parse(sessionStorage.getItem("createdCards")),
        "__typename"
      );

      const clickedCards = JSON.parse(
        sessionStorage.getItem("cardlist_to_send")
      );

      const rankingCardListByNumberOfClickCard = insertedCardList.sort(
        (a, b) =>
          b.studyStatus.clickTimesInSession - a.studyStatus.clickTimesInSession
      );
      const topFiveClicked = rankingCardListByNumberOfClickCard.filter(
        (_, i) => i < 5
      );

      const rankingCardListByElapsedTimeOnCard = insertedCardList.sort(
        (a, b) =>
          b.studyStatus.studyHourInSession - a.studyStatus.studyHourInSession
      );
      const topFiveStudyHour = rankingCardListByElapsedTimeOnCard.filter(
        (_, i) => i < 5
      );
      const fiveCreatedCards = createdCards.filter((_, i) => i < 5);

      const filteredCardByChangedLevel = insertedCardList.filter(
        (card) =>
          card.studyStatus.isUpdated &&
          card.studyStatus.levelOriginal !== card.studyStatus.levelCurrent
      );

      return {
        rankingCardListByNumberOfClickCard,
        topFiveClicked,
        rankingCardListByElapsedTimeOnCard,
        topFiveStudyHour,
        fiveCreatedCards,
        clickedCards,
      };
    }
  }, [ISSERVER]);

  useEffect(() => {
    if (!ISSERVER) {
      const cardsToRequest = [
        ...topFiveCardsBySubject.topFiveClicked,
        ...topFiveCardsBySubject.topFiveStudyHour,
        ...topFiveCardsBySubject.fiveCreatedCards,
      ];
      if (
        cardsToRequest.filter((card) => card.content.location === "my").length >
        0
      ) {
        getMyCardsContent({
          variables: {
            mycontent_ids: cardsToRequest
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
      if (
        cardsToRequest.filter((card) => card.content.location === "buy")
          .length > 0
      ) {
        getBuyCardsContent({
          variables: {
            buycontent_ids: cardsToRequest
              .filter((card) => card.content.location === "buy")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) <div>로딩중..</div>;
  if (error) <div>에러 발생: {error}</div>;

  const closeClickedTimesPage = useCallback(() => {
    setVisibleClickedTimesPage(false);
  }, []);
  const closeElapsedTimeOnCard = useCallback(() => {
    setVisibleElapsedTimeOnCard(false);
  }, []);

  const openClickedTimeOnCard = useCallback(() => {
    setVisibleClickedTimeOnCard(true);
    setClickedCounterForAllDrawers((pre) => pre + 1);
  }, []);
  const closeClickedTimeOnCard = useCallback(() => {
    setVisibleClickedTimeOnCard(false);
  }, []);
  const openChangedLevelOnCard = useCallback(() => {
    setVisibleChagnedLevelOnCard(true);
    setClickedCounterForAllDrawers((pre) => pre + 1);
  }, []);
  const closeChangedLevelOnCard = useCallback(() => {
    setVisibleChagnedLevelOnCard(false);
  }, []);
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          {data &&
            data.mycontent_getMycontentByMycontentIDs &&
            data.mycontent_getMycontentByMycontentIDs.mycontents && (
              <div className="w-full flex flex-col gap-[8px]">
                <SectionForResult title="요약" content={<SessionSummary />} />

                <SectionForResult
                  title={
                    <div className="flex items-end space-x-3">
                      <div>학습 횟수 많은 카드</div>
                      <a
                        className="text-[1rem] text-blue-700"
                        onClick={() => setVisibleClickedTimesPage(true)}
                      >
                        자세히 보기
                      </a>
                    </div>
                  }
                  content={
                    <TableForStudiedCards
                      cards={topFiveCardsBySubject.topFiveClicked}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"clickedTimes"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />
                <SectionForResult
                  title={
                    <div className="flex items-end space-x-3">
                      <div>학습 시간 많은 카드</div>
                      <a
                        className="text-[1rem] text-blue-700"
                        oonClick={() => {
                          setVisibleElapsedTimeOnCard(true);
                          if (clickedCounterForAllDrawers < 2) {
                            setClickedCounterForAllDrawers((pre) => pre + 1);
                          }
                        }}
                      >
                        자세히 보기
                      </a>
                    </div>
                  }
                  content={
                    <TableForStudiedCards
                      cards={topFiveCardsBySubject.topFiveStudyHour}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"studyHours"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />
                <SectionForResult
                  title="새로 만든 카드"
                  content={
                    <TableForStudiedCards
                      cards={topFiveCardsBySubject.fiveCreatedCards}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"newCards"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />

                <DetailOfSelected
                  openClickedTimeOnCard={openClickedTimeOnCard}
                  openChangedLevelOnCard={openChangedLevelOnCard}
                />

                <SlidingDrawerForAllCards
                  cards={
                    topFiveCardsBySubject.rankingCardListByNumberOfClickCard
                  }
                  closeDrawer={closeClickedTimesPage}
                  visible={visibleClickedTimesPage}
                  contentType={"clickedTimes"}
                />

                <SlidingDrawerForAllCards
                  cards={
                    topFiveCardsBySubject.rankingCardListByElapsedTimeOnCard
                  }
                  closeDrawer={closeElapsedTimeOnCard}
                  visible={visibleElapsedTimeOnCard}
                  contentType={"studyHours"}
                />
              </div>
            )}
          {topFiveCardsBySubject.rankingCardListByNumberOfClickCard.length ===
            0 && (
            <div className="w-full flex flex-col gap-[8px]">
              <SectionForResult
                title="요약"
                content={
                  <div className="grid w-full grid-cols-3 grid-rows-2 gap-4">
                    <BoxForSessionSummary
                      title={"학습 시작"}
                      content={moment(sessionStorage.getItem("started")).format(
                        "M.D hh:mm"
                      )}
                    />
                    진행 중이거나 정상적으로 종료되지 않은 세션입니다.
                  </div>
                }
              />
            </div>
          )}
        </div>
      </M_Layout>
    </>
  );
};

export default StudyResult;

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

  const [getMyCardsContentForAllCards, { data: myContentsDataForAllCards }] =
    useLazyQuery(QUERY_MY_CARD_CONTENTS, {
      onCompleted: (data) => {
        console.log(data);
      },
    });

  useEffect(() => {
    if (clickedCounterForAllDrawers === 1) {
      const buyContentsIds = topFiveCardsBySubject.clickedCards
        .filter((card) => card.content.location === "buy")
        .map((card) => card.content.buycontent_id);
      const myContentsIds = topFiveCardsBySubject.clickedCards
        .filter((card) => card.content.location === "my")
        .map((card) => card.content.mycontent_id);

      getMyCardsContentForAllCards({
        variables: {
          mycontent_ids: myContentsIds,
          buycontent_ids: buyContentsIds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedCounterForAllDrawers]);

  const ISSERVER = typeof window === "undefined";

  useEffect(() => {
    if (!ISSERVER) {
      const cardsToRequest = [
        ...topFiveCardsBySubject.topFiveClicked,
        ...topFiveCardsBySubject.topFiveStudyHour,
        ...topFiveCardsBySubject.fiveCreatedCards,
      ];

      getMyCardsContent({
        variables: {
          mycontent_ids: cardsToRequest
            .filter((card) => card.content.location === "my")
            .map((card) => card.content.mycontent_id),
          buycontent_ids: cardsToRequest
            .filter((card) => card.content.location === "buy")
            .map((card) => card.content.buycontent_id),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topFiveCardsBySubject = useMemo(() => {
    if (!ISSERVER) {
      const insertedCardList = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));
      const clickedCards = JSON.parse(
        sessionStorage.getItem("cardlist_to_send")
      );

      const rankingCardListByNumberOfClickCard = insertedCardList
        .filter((card) => card.studyStatus.isUpdated)
        .sort(
          (a, b) =>
            b.studyStatus.clickTimesInSession -
            a.studyStatus.clickTimesInSession
        );
      const topFiveClicked = rankingCardListByNumberOfClickCard.filter(
        (_, i) => i < 5
      );

      const rankingCardListByElapsedTimeOnCard = insertedCardList
        .filter((card) => card.studyStatus.isUpdated)
        .sort(
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
        filteredCardByChangedLevel,
      };
    }
  }, [ISSERVER]);

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
          {data && (
            <div className="w-full flex flex-col gap-[8px]">
              <SectionForResult title="요약" content={<SessionSummary />} />

              <SectionForResult
                title={
                  <div className="flex items-end space-x-3">
                    <div>학습 횟수 많은 카드</div>
                    <a
                      className="text-[1rem] text-blue-700"
                      onClick={() => {
                        setVisibleClickedTimesPage(true);
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
                    cards={topFiveCardsBySubject.topFiveClicked}
                    myContents={
                      data.mycontent_getMycontentByMycontentIDs.mycontents
                    }
                    contentType={"clickedTimes"}
                    buyContents={
                      data.buycontent_getBuycontentByBuycontentIDs.buycontents
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
                      onClick={() => {
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
                      data.buycontent_getBuycontentByBuycontentIDs.buycontents
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
                      data.buycontent_getBuycontentByBuycontentIDs.buycontents
                    }
                  />
                }
              />

              <DetailOfSelected
                openClickedTimeOnCard={openClickedTimeOnCard}
                openChangedLevelOnCard={openChangedLevelOnCard}
              />

              <SlidingDrawerForAllCards
                cards={topFiveCardsBySubject.rankingCardListByNumberOfClickCard}
                closeDrawer={closeClickedTimesPage}
                visible={visibleClickedTimesPage}
                contentType={"clickedTimes"}
                myContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .mycontent_getMycontentByMycontentIDs.mycontents
                }
                buyContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .buycontent_getBuycontentByBuycontentIDs.buycontents
                }
              />

              <SlidingDrawerForAllCards
                cards={topFiveCardsBySubject.rankingCardListByElapsedTimeOnCard}
                closeDrawer={closeElapsedTimeOnCard}
                visible={visibleElapsedTimeOnCard}
                contentType={"studyHours"}
                myContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .mycontent_getMycontentByMycontentIDs.mycontents
                }
                buyContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .buycontent_getBuycontentByBuycontentIDs.buycontents
                }
              />

              <SlidingDrawerForAllCards
                cards={topFiveCardsBySubject.clickedCards}
                closeDrawer={closeClickedTimeOnCard}
                visible={visibleClickedTimeOnCard}
                contentType={"clickedCard"}
                myContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .mycontent_getMycontentByMycontentIDs.mycontents
                }
                buyContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .buycontent_getBuycontentByBuycontentIDs.buycontents
                }
              />

              <SlidingDrawerForAllCards
                cards={topFiveCardsBySubject.filteredCardByChangedLevel}
                closeDrawer={closeChangedLevelOnCard}
                visible={visibleChagnedLevelOnCard}
                contentType={"changedLevel"}
                myContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .mycontent_getMycontentByMycontentIDs.mycontents
                }
                buyContents={
                  !myContentsDataForAllCards
                    ? []
                    : myContentsDataForAllCards
                        .buycontent_getBuycontentByBuycontentIDs.buycontents
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

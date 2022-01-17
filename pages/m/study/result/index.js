import React, { useState, useEffect, useMemo } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  const [visibleClickedTimesPage, setVisibleClickedTimesPage] = useState(false);
  const [visibleElapsedTimeOnCard, setVisibleElapsedTimeOnCard] =
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

  useEffect(() => setIsMounted(true), []);
  const ISSERVER = typeof window === "undefined";
  const topFiveCardsBySubject = useMemo(() => {
    if (!ISSERVER) {
      const insertedCardList = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));

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

      return {
        rankingCardListByNumberOfClickCard,
        topFiveClicked,
        rankingCardListByElapsedTimeOnCard,
        topFiveStudyHour,
        fiveCreatedCards,
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

  const closeClickedTimesPage = () => {
    setVisibleClickedTimesPage(false);
  };
  const closeElapsedTimeOnCard = () => {
    setVisibleElapsedTimeOnCard(false);
  };

  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          {isMounted &&
            data &&
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
                        더보기
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
                        onClick={() => setVisibleElapsedTimeOnCard(true)}
                      >
                        더보기
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
                <DetailOfSelected />
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
        </div>
      </M_Layout>
    </>
  );
};

export default StudyResult;

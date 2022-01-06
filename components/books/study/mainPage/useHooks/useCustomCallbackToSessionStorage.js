import { useMemo } from "react";
import { useCallback } from "react";
import { getCardsByNumber } from "../../sessionConfig/logic/computeFunctions";

export const useCustomCallbackToSessionStore = () => {
  const sessionResults = useMemo(
    () => ({
      mybook_id: null,
      studyHour : 0,
      numCards: {
        yet: { selected: 0, inserted: 0, started: 0, finished: 0 },
        ing: { selected: 0, inserted: 0, started: 0, finished: 0 },
        hold: { selected: 0, inserted: 0, started: 0, finished: 0 },
        completed: { selected: 0, inserted: 0, started: 0, finished: 0 },
      },
      clicks: {
        total: 0,
        diffi1: 0,
        diffi2: 0,
        diffi3: 0,
        diffi4: 0,
        diffi5: 0,
        hold: 0,
        completed: 0,
        etc: 0,
      },
      statusChange: {
        yet: { yet: 0, ing: 0, hold: 0, completed: 0 },
        ing: { yet: 0, ing: 0, hold: 0, completed: 0 },
        hold: { yet: 0, ing: 0, hold: 0, completed: 0 },
        completed: { yet: 0, ing: 0, hold: 0, completed: 0 },
      },
      levelChange: {
        total: { count: 0, gap: 0 },
        up: { count: 0, gap: 0 },
        down: { count: 0, gap: 0 },
      },
      nonCompletedLevelChange: {
        count: 0,
        gap: 0,
      },
      userFlagChange: {
        flag0: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag1: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag2: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag3: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag4: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag5: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
      },
    }),
    []
  );

  const writeSessionDataInSessionStorage = useCallback(
    ({ _data, sessionConfig, sortedCards, isRefreshPage, selectedBooks }) => {
      sessionStorage.setItem(
        "session_Id",
        _data.session_createSession.sessions[0]._id
      );
      sessionStorage.setItem("study_mode", sessionConfig.studyMode);
      sessionStorage.setItem("resultOfSession", JSON.stringify(sessionResults));
      sessionStorage.setItem("createdCards", JSON.stringify([]));
      sessionStorage.setItem(
        "resultByBook",
        JSON.stringify(
          !isRefreshPage
            ? selectedBooks.map((book) => ({
                ...sessionResults,
                mybook_id: book.book_id,
              }))
            : JSON.parse(sessionStorage.getItem("books_selected")).map(
                (book) => ({
                  ...sessionResults,
                  mybook_id: book.book_id,
                })
              )
        )
      );
      sessionStorage.removeItem("cardListStudying");

      if (sessionConfig.detailedOption.numStartCards.onOff === "on") {
        const { studyingCards, remainedCards } = getCardsByNumber({
          sortedCards,
          numStartCards: sessionConfig.detailedOption.numStartCards,
        });
        sessionStorage.setItem(
          "cardListStudying",
          JSON.stringify(studyingCards)
        );
        sessionStorage.setItem(
          "cardListRemained",
          JSON.stringify(remainedCards)
        );
      } else {
        sessionStorage.setItem("cardListStudying", JSON.stringify(sortedCards));
        sessionStorage.setItem(
          "cardListRemained",
          JSON.stringify({
            yet: [],
            ing: [],
            hold: [],
            completed: [],
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return writeSessionDataInSessionStorage;
};

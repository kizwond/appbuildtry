import produce from "immer";
import { useMemo } from "react";
import { useCallback } from "react";
import {
  getCardsByNumber,
  sortFilteredCards,
} from "../../sessionConfig/logic/computeFunctions";

export const useCustomCallbackToSessionStore = () => {
  const sessionResultsForFlipMode = useMemo(
    () => ({
      mybook_id: null,
      studyHour: 0,
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
        diffi6: 0,
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
      levelChangeByStatus: {
        nonCompleted: 0,
        completed: 0,
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
  const sessionResultsForReadMode = useMemo(
    () => ({
      mybook_id: null,
      studyHour: 0,
      numCards: {
        yet: { selected: 0, inserted: 0, started: 0, finished: 0 },
        ing: { selected: 0, inserted: 0, started: 0, finished: 0 },
        hold: { selected: 0, inserted: 0, started: 0, finished: 0 },
        completed: { selected: 0, inserted: 0, started: 0, finished: 0 },
      },
      
    }),
    []
  );
  const sessionResultsForExamMode = useMemo(
    () => ({
      mybook_id: null,
      studyHour: 0,
      numCards: {
        yet: { selected: 0, inserted: 0, started: 0, finished: 0 },
        ing: { selected: 0, inserted: 0, started: 0, finished: 0 },
        hold: { selected: 0, inserted: 0, started: 0, finished: 0 },
        completed: { selected: 0, inserted: 0, started: 0, finished: 0 },
      },
      trueFalse : {
        numTrue : 0,
        numFalse : 0
      }
    }),
    []
  );

  const writeSessionDataInSessionStorage = useCallback(
    async ({ _data, sessionConfig, numberOfFilteredCards, selectedBooks }) => {
      const { exam, flip, read, studyMode } = sessionConfig;
      const detailedOption =
        sessionConfig.studyMode === "exam"
          ? exam
          : sessionConfig.studyMode === "flip"
          ? flip
          : sessionConfig.studyMode === "read"
          ? read
          : new Error("모드가 잘못 설정됨");

      const sortedCards = sortFilteredCards({
        numberOfFilteredCards,
        sortOption: detailedOption.sortOption,
        studyMode: sessionConfig.studyMode,
      });

      sessionStorage.setItem(
        "session_Id",
        _data.session_createSession.sessions[0]._id
      );
      sessionStorage.setItem("study_mode", sessionConfig.studyMode);
      sessionStorage.setItem("createdCards", JSON.stringify([]));
      sessionStorage.setItem("dataForRegression", JSON.stringify([]));

      sessionStorage.removeItem("cardListStudying");

      if (detailedOption.numStartCards.onOff === "on") {
        const {
          studyingCards,
          remainedCards,
          numberOfstudyingCardsByStatus,
          numberOfSelectedCardsByStatus,
        } = await getCardsByNumber({
          sortedCards,
          numStartCards: detailedOption.numStartCards,
        });
        sessionStorage.setItem(
          "cardListStudying",
          JSON.stringify(studyingCards)
        );
        sessionStorage.setItem(
          "cardListRemained",
          JSON.stringify(remainedCards)
        );

        sessionStorage.setItem(
          "resultOfSession",
          JSON.stringify(
            studyMode === "flip"
              ? produce(sessionResultsForFlipMode, (draft) => {
                  draft.numCards.completed.selected =
                    numberOfSelectedCardsByStatus.completed;
                  draft.numCards.ing.selected =
                    numberOfSelectedCardsByStatus.ing;
                  draft.numCards.hold.selected =
                    numberOfSelectedCardsByStatus.hold;
                  draft.numCards.yet.selected =
                    numberOfSelectedCardsByStatus.yet;

                  draft.numCards.completed.inserted =
                    numberOfstudyingCardsByStatus.completed;
                  draft.numCards.ing.inserted =
                    numberOfstudyingCardsByStatus.ing;
                  draft.numCards.hold.inserted =
                    numberOfstudyingCardsByStatus.hold;
                  draft.numCards.yet.inserted =
                    numberOfstudyingCardsByStatus.yet;
                })
              : studyMode === "exam"
              ? produce(sessionResultsForExamMode, (draft) => {
                  draft.numCards.completed.selected =
                    numberOfSelectedCardsByStatus.completed;
                  draft.numCards.ing.selected =
                    numberOfSelectedCardsByStatus.ing;
                  draft.numCards.hold.selected =
                    numberOfSelectedCardsByStatus.hold;
                  draft.numCards.yet.selected =
                    numberOfSelectedCardsByStatus.yet;

                  draft.numCards.completed.inserted =
                    numberOfstudyingCardsByStatus.completed;
                  draft.numCards.ing.inserted =
                    numberOfstudyingCardsByStatus.ing;
                  draft.numCards.hold.inserted =
                    numberOfstudyingCardsByStatus.hold;
                  draft.numCards.yet.inserted =
                    numberOfstudyingCardsByStatus.yet;
                })
              : studyMode === "read"
              ? produce(sessionResultsForReadMode, (draft) => {
                  draft.numCards.completed.selected =
                    numberOfSelectedCardsByStatus.completed;
                  draft.numCards.ing.selected =
                    numberOfSelectedCardsByStatus.ing;
                  draft.numCards.hold.selected =
                    numberOfSelectedCardsByStatus.hold;
                  draft.numCards.yet.selected =
                    numberOfSelectedCardsByStatus.yet;

                  draft.numCards.completed.inserted =
                    numberOfstudyingCardsByStatus.completed;
                  draft.numCards.ing.inserted =
                    numberOfstudyingCardsByStatus.ing;
                  draft.numCards.hold.inserted =
                    numberOfstudyingCardsByStatus.hold;
                  draft.numCards.yet.inserted =
                    numberOfstudyingCardsByStatus.yet;
                })
              : new Error(`${studyMode}의 학습모드는 없습니다`)
          )
        );
        sessionStorage.setItem(
          "resultByBook",
          JSON.stringify(
            selectedBooks.map((book) =>
              studyMode === "flip"
                ? produce(sessionResultsForFlipMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected =
                      remainedCards.completed.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "completed"
                      ).length;
                    draft.numCards.yet.selected =
                      remainedCards.yet.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "yet"
                      ).length;
                    draft.numCards.ing.selected =
                      remainedCards.ing.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "ing"
                      ).length;
                    draft.numCards.hold.selected =
                      remainedCards.hold.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "hold"
                      ).length;
                    draft.numCards.completed.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : studyMode === "exam"
                ? produce(sessionResultsForExamMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected =
                      remainedCards.completed.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "completed"
                      ).length;
                    draft.numCards.yet.selected =
                      remainedCards.yet.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "yet"
                      ).length;
                    draft.numCards.ing.selected =
                      remainedCards.ing.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "ing"
                      ).length;
                    draft.numCards.hold.selected =
                      remainedCards.hold.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "hold"
                      ).length;
                    draft.numCards.completed.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : studyMode === "read"
                ? produce(sessionResultsForReadMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected =
                      remainedCards.completed.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "completed"
                      ).length;
                    draft.numCards.yet.selected =
                      remainedCards.yet.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "yet"
                      ).length;
                    draft.numCards.ing.selected =
                      remainedCards.ing.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "ing"
                      ).length;
                    draft.numCards.hold.selected =
                      remainedCards.hold.filter(
                        (card) => card.card_info.mybook_id === book.book_id
                      ).length +
                      studyingCards.filter(
                        (card) =>
                          card.card_info.mybook_id === book.book_id &&
                          card.studyStatus.statusCurrent === "hold"
                      ).length;
                    draft.numCards.completed.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = studyingCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : new Error(`${studyMode}의 학습모드는 없습니다`)
            )
          )
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
        sessionStorage.setItem(
          "resultOfSession",
          JSON.stringify(
            studyMode === "flip"
              ? produce(sessionResultsForFlipMode, (draft) => {
                  draft.numCards.completed.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;

                  draft.numCards.completed.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;
                })
              : studyMode === "read"
              ? produce(sessionResultsForReadMode, (draft) => {
                  draft.numCards.completed.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;

                  draft.numCards.completed.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;
                })
              : studyMode === "exam"
              ? produce(sessionResultsForExamMode, (draft) => {
                  draft.numCards.completed.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.selected = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;

                  draft.numCards.completed.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "completed"
                  ).length;
                  draft.numCards.ing.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "ing"
                  ).length;
                  draft.numCards.hold.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "hold"
                  ).length;
                  draft.numCards.yet.inserted = sortedCards.filter(
                    (card) => card.studyStatus.statusCurrent === "yet"
                  ).length;
                })
              : new Error(`${studyMode}의 학습모드는 없습니다`)
          )
        );

        sessionStorage.setItem(
          "resultByBook",
          JSON.stringify(
            selectedBooks.map((book) =>
              studyMode === "flip"
                ? produce(sessionResultsForFlipMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;

                    draft.numCards.completed.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : studyMode === "exam"
                ? produce(sessionResultsForExamMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;

                    draft.numCards.completed.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : studyMode === "read"
                ? produce(sessionResultsForReadMode, (draft) => {
                    draft.mybook_id = book.book_id;
                    draft.bookTitle = book.book_title;
                    draft.numCards.completed.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.selected = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;

                    draft.numCards.completed.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "completed"
                    ).length;
                    draft.numCards.yet.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "yet"
                    ).length;
                    draft.numCards.ing.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "ing"
                    ).length;
                    draft.numCards.hold.inserted = sortedCards.filter(
                      (card) =>
                        card.card_info.mybook_id === book.book_id &&
                        card.studyStatus.statusCurrent === "hold"
                    ).length;
                  })
                : new Error(`${studyMode}의 학습모드는 없습니다`)
            )
            // : JSON.parse(sessionStorage.getItem("books_selected")).map(
            //     (book) =>
            //       produce(sessionResultsForFlipMode, (draft) => {
            //         draft.mybook_id = book.book_id;
            //         draft.numCards.completed.selected = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "completed"
            //         ).length;
            //         draft.numCards.yet.selected = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "yet"
            //         ).length;
            //         draft.numCards.ing.selected = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "ing"
            //         ).length;
            //         draft.numCards.hold.selected = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "hold"
            //         ).length;

            //         draft.numCards.completed.inserted = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "completed"
            //         ).length;
            //         draft.numCards.yet.inserted = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "yet"
            //         ).length;
            //         draft.numCards.ing.inserted = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "ing"
            //         ).length;
            //         draft.numCards.hold.inserted = sortedCards.filter(
            //           (card) =>
            //             card.card_info.mybook_id === book.book_id &&
            //             card.studyStatus.statusCurrent === "hold"
            //         ).length;
            //       })
            //   )
          )
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return writeSessionDataInSessionStorage;
};

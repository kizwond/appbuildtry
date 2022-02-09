import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { MUTATION_CREATE_SESSION } from "../graphql/mutation/sessionConfig";

const useCreateReadSession = (selectedBooks = false, sessionScope = false) => {
  const router = useRouter();
  const [session_createSession, {}] = useMutation(MUTATION_CREATE_SESSION, {
    onCompleted: (_data) => {
      if (_data.session_createSession.status === "200") {
        console.log("책 바로 보기 모드, 세션 생성 요청 후 받은 데이터", _data);
        sessionStorage.setItem(
          "session_Id",
          _data.session_createSession.sessions[0]._id
        );

        const filterOption = {
          detailedOption: {
            useCardtype: ["read", "flip"],
            useStatus: ["yet", "ing", "hold", "completed"],
            needStudyTimeCondition: "all",
            needStudyTimeRange: [0, 1],
            numStartCards: {
              onOff: "off",
              yet: 50,
              ing: 50,
              hold: 0,
              completed: 0,
            },
          },
          advancedFilter: {
            onOff: "off",
            cardMaker: {
              onOff: "off",
              value: ["my", "buy"],
            },
            studyTool: {
              onOff: "off",
              value: ["none", "hidden", "underline", "highlight"],
            },
            examResult: {
              onOff: "off",
              value: ["none", "right", "wrong"],
            },
            level: {
              onOff: "off",
              value: [0, 100],
            },
            makerFlag: {
              onOff: "off",
              value: [0, 1, 2, 3, 4, 5],
            },
            userFlag: {
              onOff: "off",
              value: [0, 1, 2, 3, 4, 5],
            },
            recentDifficulty: {
              onOff: "off",
              value: ["on", "on", "1", "100"],
            },
            recentStudyTime: {
              onOff: "off",
              value: [-3, 0],
            },
            studyTimes: {
              onOff: "off",
              value: [0, 100],
            },
          },
        };

        const readModeTTSOption = {
          faceOneTTS: {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            selection: true,
          },
          faceTwoTTS: {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
          },
          rate: 1,
          pitch: 1,
        };
        sessionStorage.setItem(
          "readModeTTSOption",
          JSON.stringify(readModeTTSOption)
        );

        sessionStorage.setItem("filterOption", JSON.stringify(filterOption));

        const resultOfSession = {
          mybook_id: null,
          studyHour: 0,
          statusChange: {
            yet: { yet: 0, ing: 0, hold: 0, completed: 0 },
            ing: { yet: 0, ing: 0, hold: 0, completed: 0 },
            hold: { yet: 0, ing: 0, hold: 0, completed: 0 },
            completed: { yet: 0, ing: 0, hold: 0, completed: 0 },
          },
          userFlagChange: {
            flag0: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
            flag1: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
            flag2: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
            flag3: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
            flag4: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
            flag5: {
              flag0: 0,
              flag1: 0,
              flag2: 0,
              flag3: 0,
              flag4: 0,
              flag5: 0,
            },
          },
        };
        sessionStorage.setItem(
          "resultOfSession",
          JSON.stringify(resultOfSession)
        );
        sessionStorage.setItem(
          "resultByBook",
          JSON.stringify(
            selectedBooks
              ? selectedBooks.map((book) => ({
                  ...resultOfSession,
                  mybook_id: book.book_id,
                }))
              : sessionScope.map(({ mybook_id }) => ({
                  ...resultOfSession,
                  mybook_id,
                }))
          )
        );

        router.push({
          pathname: "/m/study/mode/directread",
          query: {
            name: JSON.stringify(
              selectedBooks
                ? selectedBooks
                : sessionScope.map((book) => ({
                    book_id: book.mybook_id,
                    book_title: book.title,
                  }))
            ),
          },
        });
      } else if (_data.session_createSession.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const submitCreateSessionConfigToServer = useCallback(async () => {
    const _sessionScope = sessionScope
      ? sessionScope.map((book) => ({
          mybook_id: book.mybook_id,
          title: book.title,
        }))
      : selectedBooks.map((book) => ({
          mybook_id: book.book_id,
          title: book.book_title,
        }));
    try {
      await session_createSession({
        variables: {
          forCreateSession: {
            sessionScope: _sessionScope,
            sessionConfig: {
              studyMode: "read",
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBooks, sessionScope]);

  return submitCreateSessionConfigToServer;
};

export default useCreateReadSession;

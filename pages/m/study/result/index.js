import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";

import { GET_CARD_CONTENT } from "../../../../graphql/query/card_contents";

import M_Layout from "../../../../components/layout/M_Layout";
import { Table } from "antd";
import moment from "moment";
import styled from "styled-components";

const StudyResult = () => {
  const router = useRouter();

  const [cardList, setCardList] = useState(null);

  const [getCardsContent, { data, loading, error }] = useLazyQuery(
    GET_CARD_CONTENT,
    {
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );
  const ISSERVER = typeof window === "undefined";
  useEffect(() => {
    if (!ISSERVER) {
      const cardlist_to_send_tmp = JSON.parse(
        sessionStorage.getItem("cardlist_to_send")
      );
      setCardList(cardlist_to_send_tmp);
      if (
        cardlist_to_send_tmp.filter((card) => card.content.location === "my")
          .length > 0
      ) {
        getCardsContent({
          variables: {
            mycontent_ids: cardlist_to_send_tmp
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
      if (
        cardlist_to_send_tmp.filter((card) => card.content.location === "buy")
          .length > 0
      ) {
        getCardsContent({
          variables: {
            mycontent_ids: cardlist_to_send_tmp
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) <div>로딩중..</div>;
  if (error) <div>에러 발생: {error}</div>;

  const getContentsSortByIds = (contents) => {
    let contentObj = {};
    contents.forEach(
      (content) =>
        (contentObj[content._id] = new String(content.face1).replace(
          /(<([^>]+)>)/gi,
          ""
        ))
    );
    return contentObj;
  };

  const getTableData = (card) => {
    const contentsByContentIds = getContentsSortByIds(
      data.mycontent_getMycontentByMycontentIDs.mycontents
    );
    const [first, second, third, fourth, fifth] =
      contentsByContentIds[card.content.mycontent_id];
    return {
      key: card._id,
      seqInCardlist: card.seqInCardlist,
      content: first + second + third + fourth + fifth,
      selection: card.studyStatus.recentSelection,
      requestedStudyTime: moment(card.studyStatus.needStudyTime).format(
        "DD, HH:mm:ss"
      ),
      preStatus: card.studyStatus.statusOriginal,
      currentStatus: card.studyStatus.statusCurrent,
      preLevel: card.studyStatus.levelOriginal,
      currentLevel: card.studyStatus.levelCurrent,
      studiedCardCounter: card.studyStatus.currentLevStudyTimes,
      elasedTimeOnStudyingCard:
        Math.round(
          (Date.parse(card.studyStatus.currentLevElapsedTime) / 3600000) * 100
        ) / 100,
    };
  };
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <StyledDiv>
          {cardList &&
            data &&
            data.mycontent_getMycontentByMycontentIDs &&
            data.mycontent_getMycontentByMycontentIDs.mycontents.length > 0 && (
              <Table
                style={{ marginTop: "50px" }}
                dataSource={cardList.map(getTableData)}
                columns={[
                  {
                    title: "No.",
                    key: "seqInCardlist",
                    dataIndex: "seqInCardlist",
                  },
                  { key: "content", dataIndex: "content", title: "앞면" },
                  {
                    title: "난이도선택",
                    key: "selection",
                    dataIndex: "selection",
                  },
                  {
                    title: "원상태",
                    key: "preStatus",
                    dataIndex: "preStatus",
                  },
                  {
                    title: "후상태",
                    key: "currentStatus",
                    dataIndex: "currentStatus",
                  },
                  {
                    title: "복습시점",
                    key: "requestedStudyTime",
                    dataIndex: "requestedStudyTime",
                  },
                  {
                    title: "원레벨",
                    key: "preLevel",
                    dataIndex: "preLevel",
                  },
                  {
                    title: "후레벨",
                    key: "currentLevel",
                    dataIndex: "currentLevel",
                  },
                  {
                    title: "횟수",
                    key: "studiedCardCounter",
                    dataIndex: "studiedCardCounter",
                  },
                  {
                    title: "경과시간",
                    key: "elasedTimeOnStudyingCard",
                    dataIndex: "elasedTimeOnStudyingCard",
                  },
                ]}
              />
            )}
        </StyledDiv>
      </M_Layout>
    </>
  );
};

export default StudyResult;

const StyledDiv = styled.div`
  * {
    font-size: 10px;
  }
`;

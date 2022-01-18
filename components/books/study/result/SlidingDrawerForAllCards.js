import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  QUERY_BUY_CARD_CONTENTS,
  QUERY_MY_CARD_CONTENTS,
} from "../../../../graphql/query/allQuery";
import TableForStudiedCards from "./TableForStudiedCards";
import styled from "styled-components";
import { Drawer } from "antd";
import { memo } from "react";

const SlidingDrawerForAllCards = ({
  visible,
  closeDrawer,
  cards,
  contentType,
}) => {
  const [mountCounter, setMountCounter] = useState(0);

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

  // Drawer를 처음 열었을 때만 서버에 데이터 요청
  useEffect(() => {
    if (visible && mountCounter < 3) {
      setMountCounter((pre) => pre + 1);
    }
  }, [visible, mountCounter]);

  useEffect(() => {
    if (mountCounter === 1 && visible) {
      if (cards.filter((card) => card.content.location === "my").length > 0) {
        getMyCardsContent({
          variables: {
            mycontent_ids: cards
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
      if (cards.filter((card) => card.content.location === "buy").length > 0) {
        getBuyCardsContent({
          variables: {
            buycontent_ids: cards
              .filter((card) => card.content.location === "buy")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountCounter]);

  return (
    <DrawerWrapper
      title={
        contentType === "clickedTimes"
          ? "학습 횟수 많은 카드"
          : "학습 시간 많은 카드"
      }
      placement="bottom"
      width={"100%"}
      height={"calc(100vh - 39px)"}
      mask={false}
      visible={visible}
      onClose={closeDrawer}
      zIndex={10}
    >
      {data && data.mycontent_getMycontentByMycontentIDs && (
        <TableForStudiedCards
          cards={cards}
          myContents={data.mycontent_getMycontentByMycontentIDs.mycontents}
          contentType={contentType}
          buyContents={
            !buyContentsData
              ? []
              : buyContentsData.buycontent_getBuycontentByBuycontentIDs
                  .buycontents
          }
        />
      )}
    </DrawerWrapper>
  );
};

export default memo(SlidingDrawerForAllCards);

const DrawerWrapper = styled(Drawer)`
  top: 39px;
  /* height: calc(100vh - 40px); */
  .ant-drawer-header {
    padding: 8px 12px 4px 8px;
  }

  .ant-drawer-close {
    font-size: 1.166667rem;
  }
  & .ant-drawer-title {
    font-size: 1.166667rem;
  }
  & .ant-drawer-body {
    padding: 10px 12px;
    background: #ffffff;
  }
  .ant-drawer-content-wrapper {
    transition: transform 1.3s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 1.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

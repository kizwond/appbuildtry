import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER } from "../../../../graphql/query/allQuery";
import { CloudSyncOutlined } from "@ant-design/icons";

const GetFilteredIndexButton = ({
  advancedFilter, //
  book_ids,
  onChangeAFCardList,
  AFCardList,
  advancedFilteredCheckedIndexes,
  onChangeIndexesOfAFCardList,
  onChangeAFButtonClick,
}) => {
  const [counter, setCounter] = useState(0);
  const [isOnProcessing, setIsOnProcessing] = useState(true);

  const [loadFilteredData, { loading, error, data }] = useLazyQuery(
    QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER,
    {
      onCompleted: (received_data) => {
        console.log("데이터받았음");
        if (counter == 0) {
          onChangeAFButtonClick();
          onChangeAFCardList([received_data]);
          setIsOnProcessing(true);
        } else {
          onChangeAFCardList([...AFCardList, received_data]);
        }
        if (counter == book_ids.length - 1) {
          setIsOnProcessing(false);
          setCounter(0);
        }
        if (counter < book_ids.length - 1) {
          console.log("카운터설정");
          setCounter((prev) => prev + 1);
        }
        console.log(received_data);
      },
    }
  );

  const variables = {
    forGetNumCardsbyIndex: {
      mybook_id: book_ids[counter],
      advancedFilter,
    },
  };

  useEffect(() => {
    if (isOnProcessing) {
      console.log("0단게");

      if (counter > 0) {
        console.log("1단게");
        if (counter < book_ids.length) {
          console.log("2단계");
          loadFilteredData({ variables });
          console.log(`서버에 ${counter + 1}번째 요청보냄`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFilteredData, counter, isOnProcessing]);

  useEffect(() => {
    if (isOnProcessing) {
      if (data?.session_getNumCardsbyIndex?.indexsets[0]) {
        const bookIndexIdsList =
          data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
            (item) => item._id
          );
        onChangeIndexesOfAFCardList({
          ...advancedFilteredCheckedIndexes,
          [data.session_getNumCardsbyIndex.indexsets[0].indexset_info
            .mybook_id]: bookIndexIdsList,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOnProcessing]);
  return (
    <CloudSyncOutlined
      onClick={() => {
        console.log(`서버에 1번째 요청보냄`);
        loadFilteredData({ variables });
      }}
    />
  );
};

export default GetFilteredIndexButton;

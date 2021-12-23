import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER } from "../../../../../../graphql/query/allQuery";
import { CloudSyncOutlined } from "@ant-design/icons";

const GetFilteredIndexButton = ({
  advancedFilter, //
  book_ids,
  onChangeAFCardList,
  AFCardList,
  onChangeAFButtonClick,
}) => {
  const [counter, setCounter] = useState(0);

  const [loadFilteredData, { loading, error, data }] = useLazyQuery(
    QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER,
    {
      onCompleted: (received_data) => {
        console.log("데이터받았음", received_data);
        if (counter == 0) {
          onChangeAFButtonClick();
          onChangeAFCardList([received_data]);
          setCounter(1);
        } else if (counter < book_ids.length - 1) {
          onChangeAFCardList([...AFCardList, received_data]);
          console.log("카운터설정");
          setCounter((prev) => prev + 1);
        } else if (counter == book_ids.length - 1) {
          setCounter(0);
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
    if (counter > 0 && counter < book_ids.length) {
      loadFilteredData({ variables });
      console.log(`서버에 ${counter + 1}번째 요청보냄`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFilteredData, counter]);

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

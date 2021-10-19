import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID } from "../../../../graphql/query/studySessionSetting";
import { Button } from "antd";
import { CloudSyncOutlined } from "@ant-design/icons";

const GetFilteredIndexButton = ({ advancedFilter, book_ids, onChangeAFCardList, AFCardList, onToggleIsAFilter, advancedFilteredCheckedIndexes, onChangeIndexesOfAFCardList, onChangeAFButtonClick }) => {
  const [counter, setCounter] = useState(0);
  const [isOnProcessing, setIsOnProcessing] = useState(true);

  const [loadFilteredData, { loading, error, data }] = useLazyQuery(GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID, {
    onCompleted: (received_data) => {
      if (counter == 0) {
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
  });

  const variables = {
    forGetNumCardsbyIndex: {
      mybook_id: book_ids[counter],
      advancedFilter: {
        onOff: advancedFilter.onOff,
        cardMaker: {
          onOff: advancedFilter.cardMaker.onOff,
          value: advancedFilter.cardMaker.value,
        },
        examResult: {
          onOff: advancedFilter.examResult.onOff,
          value: advancedFilter.examResult.value,
        },
        level: {
          onOff: advancedFilter.level.onOff,
          value: advancedFilter.level.value,
        },
        makerFlag: {
          onOff: advancedFilter.makerFlag.onOff,
          value: advancedFilter.makerFlag.value,
        },
        userFlag: {
          onOff: advancedFilter.userFlag.onOff,
          value: advancedFilter.userFlag.value,
        },
        recentDifficulty: {
          onOff: advancedFilter.recentDifficulty.onOff,
          value: advancedFilter.recentDifficulty.value,
        },
        recentStudyTime: {
          onOff: advancedFilter.recentStudyTime.onOff,
          value: advancedFilter.recentStudyTime.value,
        },
        studyTimes: {
          onOff: advancedFilter.studyTimes.onOff,
          value: advancedFilter.studyTimes.value,
        },
      },
    },
  };

  useEffect(() => {
    if (isOnProcessing) {
      if (counter > 0) {
        if (counter < book_ids.length) {
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
        const bookIndexIdsList = data.session_getNumCardsbyIndex.indexsets[0].indexes.map((item) => item._id);
        onChangeIndexesOfAFCardList({
          ...advancedFilteredCheckedIndexes,
          [data.session_getNumCardsbyIndex.indexsets[0].indexset_info.mybook_id]: bookIndexIdsList,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isOnProcessing]);

  return (
    <CloudSyncOutlined
      onClick={() => {
        onToggleIsAFilter(true);
        loadFilteredData({ variables });
        onChangeAFButtonClick();
      }}
    />
  );
};

export default GetFilteredIndexButton;

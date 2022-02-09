import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Button, Modal, Popover } from "antd";
import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { QUERY_CONTENT_AND_CARDTYPE_FOR_CARD_DETAIL } from "../../../../../../graphql/query/allQuery";
import decodeHtMLEntities from "../../../../../common/logic/decodeHtMLEntities";

const Popover_CardDetail = () => {
  const cards = JSON.parse(sessionStorage.getItem("cardListStudying"));
  const currentSeq = Number(sessionStorage.getItem("card_seq"));
  const mybook_ids = JSON.parse(sessionStorage.getItem("books_selected")).map(
    (book) => book.book_id
  );
  const {
    card_info: { cardtype, cardtype_id, cardtypeset_id },
    content: { mycontent_id, buycontent_id },
    studyStatus: {
      statusCurrent,
      levelCurrent,
      recentStudyTime,
      recentStudyRatio,
      totalStudyTimes,
      totalStudyHour,
    },
  } = cards[currentSeq];

  const { data } = useQuery(QUERY_CONTENT_AND_CARDTYPE_FOR_CARD_DETAIL, {
    onCompleted: (data) => console.log(data),
    variables: {
      mybook_ids,
      mycontent_ids: cards
        .filter((card) => card.content.location === "my")
        .map((card) => card.content.mycontent_id),
      buycontent_ids: cards
        .filter((card) => card.content.location === "buy")
        .map((card) => card.content.buycontent_id),
    },
  });

  const nameOfCardType =
    data &&
    data.cardtypeset_getbymybookids.cardtypesets.length > 0 &&
    data.cardtypeset_getbymybookids.cardtypesets.find(
      (set) => set._id === cardtypeset_id
    ).cardtypes.length > 0 &&
    data.cardtypeset_getbymybookids.cardtypesets
      .find((set) => set._id === cardtypeset_id)
      .cardtypes.find((cardtype) => cardtype._id === cardtype_id).cardtype_info
      .name;

  const contents =
    data &&
    [
      ...data.mycontent_getMycontentByMycontentIDs.mycontents,
      ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
    ].find(
      (content) => content._id === mycontent_id || content._id == buycontent_id
    );

  const face1_1_Str = contents && decodeHtMLEntities(contents.face1[0]);
  const face2_1_Str = contents && decodeHtMLEntities(contents.face2[0]);
  const selectionStr =
    contents &&
    contents.selection &&
    contents.selection.length > 0 &&
    contents.selection.reduce((a, b) => a + b + " ");

  const annotationStr =
    contents &&
    contents.annotation &&
    contents.annotation.length > 0 &&
    contents.annotation.reduce((a, b) => a + b + " ");

  const typeOfCard = ((_cardtype) => {
    switch (_cardtype) {
      case "read":
        return "학습용 - 단면카드";
      case "flip":
        return "학습용 - 양면카드";
      case "general":
        return "비학습용 - 일반카드";
      case "subject":
        return "비학습용 - 제목카드";
      case "share":
        return "비학습용 - 공통지문카드";
      default:
        break;
    }
  })(cardtype);

  return (
    <>
      {nameOfCardType && (
        <Popover
          content={
            <FlipCardDetail
              typeOfCard={typeOfCard}
              nameOfCardType={nameOfCardType}
            />
          }
          placement="leftBottom"
          trigger="click"
        >
          <Button
            size="small"
            style={{
              flexShrink: 0,
              fontSize: "0.8rem",
              width: "32px",
              height: "20px",
              marginLeft: "5px",
              borderRadius: "3px",
              padding: "2px",
              border: "none",
            }}
          >
            상세
          </Button>
        </Popover>
      )}
    </>
  );
};

export default Popover_CardDetail;

const FlipCardDetail = ({ typeOfCard, nameOfCardType }) => {
  return (
    <div className="flex flex-col gap-3 text-sm w-[23rem]">
      <div className="flex">
        <div className="min-w-[7rem]">카드타입</div>
        <div>{typeOfCard}</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">카드타입명</div>
        <div>{nameOfCardType}</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">행 구성</div>
        <div>
          <div className="flex">
            <div className="min-w-[4rem]">1면 보기</div>
            <div className="w-48 truncate">
              dkdkaksk아아ㅇㅇddddddddddd dadfs sㅇㅇㅇㅇ아dafs
            </div>
          </div>
          <div className="flex">
            <div className="min-w-[4rem]">1면 보기</div>
            <div className="w-48 truncate">ddd dadfs sㅇㅇㅇㅇ아dafs</div>
          </div>
          <div className="flex">
            <div className="min-w-[4rem]">1면 보기</div>
            <div className="w-48 truncate">dkdkakskㅇㅇㅇㅇ아dafs</div>
          </div>
          <div className="flex">
            <div className="min-w-[4rem]">1면 보기</div>
            <div className="w-48 truncate">dkdkaksk아아ㅇs</div>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">현재 상태</div>
        <div>학습전</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">레벨</div>
        <div>32 level</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">최근 뒤집기 시점</div>
        <div>2021년 2월 17일</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">최근 선택 난이도</div>
        <div>47.4</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">총 뒤집기 횟수</div>
        <div>3회</div>
      </div>

      <div className="flex">
        <div className="min-w-[7rem]">총 뒤집기 횟수</div>
        <div>24분 15초</div>
      </div>
    </div>
  );
};

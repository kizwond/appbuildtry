import { useQuery } from "@apollo/client";
import { Button, Modal, Popover } from "antd";
import _ from "lodash";
import moment from "moment";
import React, { useCallback } from "react";
import { QUERY_CONTENT_AND_CARDTYPE_FOR_CARD_DETAIL } from "../../../../../../graphql/query/allQuery";
import decodeHtMLEntities from "../../../../../common/logic/decodeHtMLEntities";
import prettyMilliseconds from "pretty-ms";
import { useRouter } from "next/router";

const Popover_CardDetail = () => {
  return (
    <Popover
      content={<FlipCardDetail />}
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
  );
};

export default Popover_CardDetail;

const FlipCardDetail = () => {
  const router = useRouter();
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
    onCompleted: (received_data) => {
      if (received_data.cardtypeset_getbymybookids.status === "200") {
        console.log("카드 상세 팝오버 정보 받기 완료함", received_data);
      } else if (received_data.cardtypeset_getbymybookids.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
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

  // 앞면 뒷면은 아래 정보로 배열로 돌려서 있으면 표시 없으면 표시안하는 방식으로 구현
  const face1_Str =
    contents &&
    contents.face1.map((row) =>
      decodeHtMLEntities(row).trim().substring(0, 10)
    );
  const face2_Str =
    contents &&
    contents.face2.map((row) =>
      decodeHtMLEntities(row).trim().substring(0, 10)
    );
  // const circleNumbers = ["①", "②", "③", "④", "⑤"];
  const selectionStr =
    contents &&
    contents.selection &&
    contents.selection.length > 0 &&
    decodeHtMLEntities("①" + contents.selection[0].trim()).substring(0, 10);

  const annotationStr =
    contents &&
    contents.annotation &&
    contents.annotation.length > 0 &&
    decodeHtMLEntities(
      contents.annotation.reduce((a, b) => a.trim() + " " + b.trim())
    ).substring(0, 10);

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

  const statusOfStudy = ((statusCurrent) => {
    switch (statusCurrent) {
      case "yet":
        return "미학습";
      case "ing":
        return "학습중";
      case "hold":
        return "보류";
      case "completed":
        return "졸업";
      default:
        break;
    }
  })(statusCurrent);

  const displayTime = useCallback((time) => {
    switch (time.length) {
      case 4:
        return "00:0" + time;
      case 5:
        return "00:" + time;
      case 6:
        return "00" + time;
      case 7:
        return "0" + time;
      case 8:
        return time;

      default:
        break;
    }
  }, []);

  return (
    <>
      {nameOfCardType && (
        <div className="flex flex-col gap-3 text-base w-[22rem]">
          <div className="flex">
            <div className="min-w-[9rem]">카드타입</div>
            <div>{typeOfCard}</div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">카드타입명</div>
            <div>{nameOfCardType}</div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">행 구성</div>
            <div>
              {face1_Str.map((rowStr, i) => (
                <div key={`${i}`} className="flex">
                  <div className="min-w-[4rem]">{`1면 ${i + 1}행`}</div>
                  <div className="w-48 truncate">{rowStr}</div>
                </div>
              ))}
              {selectionStr && (
                <div className="flex">
                  <div className="min-w-[4rem]">1면 보기</div>
                  <div className="w-48 truncate">{selectionStr}</div>
                </div>
              )}
              {face2_Str.map((rowStr, i) => (
                <div key={`${i}`} className="flex">
                  <div className="min-w-[4rem]">{`2면 ${i + 1}행`}</div>
                  <div className="w-48 truncate">{rowStr}</div>
                </div>
              ))}
              {annotationStr && (
                <div className="flex">
                  <div className="min-w-[4rem]">주석</div>
                  <div className="w-48 truncate">{annotationStr}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">현재 상태</div>
            <div>{statusOfStudy}</div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">레벨</div>
            <div>
              {levelCurrent && Math.round(levelCurrent * 10) / 10} level
            </div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">최근 뒤집기 시점</div>
            <div>
              {recentStudyTime &&
                moment(recentStudyTime).format("YYYY년 M월 D일")}
            </div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">최근 선택 난이도</div>
            <div>{recentStudyRatio}</div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">총 뒤집기 횟수</div>
            <div>{totalStudyTimes}회</div>
          </div>

          <div className="flex">
            <div className="min-w-[9rem]">총 뒤집기 시간</div>
            <div>
              {totalStudyHour === 0
                ? 0
                : totalStudyHour &&
                  displayTime(
                    prettyMilliseconds(totalStudyHour, {
                      colonNotation: true,
                      secondsDecimalDigits: 0,
                    })
                  )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

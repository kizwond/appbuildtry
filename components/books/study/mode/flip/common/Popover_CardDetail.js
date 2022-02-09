import { Button, Popover } from "antd";
import React from "react";

const Popover_CardDetail = () => {
  const card_details_session = JSON.parse(
    sessionStorage.getItem("cardListStudying")
  );
  const currentSeq = Number(sessionStorage.getItem("card_seq"));

  var cardLevel = card_details_session[currentSeq].studyStatus.levelCurrent;
  var recentStudyTime =
    card_details_session[currentSeq].studyStatus.recentStudyTime;
  var recentSelection =
    card_details_session[currentSeq].studyStatus.recentSelection;

  return (
    <Popover
      content={
        <div style={{ fontSize: "0.8rem" }}>
          <div>현레벨 : {cardLevel}</div>
          <div>최근학습시간 : {recentStudyTime}</div>
          <div>마지막난이도 : {recentSelection}</div>
          <div>기타등등... 카드 정보들</div>
        </div>
      }
      placement="bottomRight"
      title={
        <>
          <span style={{ fontSize: "0.8rem" }}>카드정보</span>
        </>
      }
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

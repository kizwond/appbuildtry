import { gql, useApolloClient } from "@apollo/client";
import { Button, Modal, Popover } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";

const Popover_CardDetail = () => {
  // const [visible, setVisible] = useState(false);

  // const client = useApolloClient();

  // const card_details_session = JSON.parse(
  //   sessionStorage.getItem("cardListStudying")
  // );
  // const currentSeq = Number(sessionStorage.getItem("card_seq"));

  // const {
  //   card_info: { cardtype, cardtype_id },
  //   content: { mycontent_id, buycontent_id },
  //   studyStatus: {
  //     statusCurrent,
  //     levelCurrent,
  //     recentStudyTime,
  //     recentStudyRatio,
  //     totalStudyTimes,
  //     totalStudyHour,
  //   },
  // } = card_details_session[currentSeq];

  // const typeOfCard = ((_cardtype) => {
  //   switch (_cardtype) {
  //     case "read":
  //       return "학습용 - 단면카드";
  //     case "flip":
  //       return "학습용 - 양면카드";
  //     case "general":
  //       return "비학습용 - 일반카드";
  //     case "subject":
  //       return "비학습용 - 제목카드";
  //     case "share":
  //       return "비학습용 - 공통지문카드";
  //     default:
  //       break;
  //   }
  // })(cardtype);

  // let nameOfCardType;

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   nameOfCardType = client.readFragment({
  //     id: `Cardtype:${cardtype_id}`,
  //     fragment: gql`
  //       fragment CardTypeNameFragment on Cardtype {
  //         cardtype_info {
  //           name
  //         }
  //       }
  //     `,
  //   });
  // }, [nameOfCardType]);
  // console.log({ nameOfCardType });

  return (
    <>
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
        // onClick={() => setVisible(true)}
      >
        상세
      </Button>
      {/* <Modal visible={visible} onCancel={() => setVisible(false)}>
        <FlipCardDetail
          typeOfCard={typeOfCard}
          nameOfCardType={nameOfCardType}
        />
      </Modal> */}
    </>
  );
};

export default Popover_CardDetail;

// const FlipCardDetail = ({ typeOfCard, nameOfCardType }) => {
//   return (
//     <div className="flex flex-col gap-3 text-sm w-[23rem]">
//       <div className="flex">
//         <div className="min-w-[7rem]">카드타입</div>
//         <div>{typeOfCard}</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">카드타입명</div>
//         <div>{nameOfCardType}</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">행 구성</div>
//         <div>
//           <div className="flex">
//             <div className="min-w-[4rem]">1면 보기</div>
//             <div className="w-48 truncate">
//               dkdkaksk아아ㅇㅇddddddddddd dadfs sㅇㅇㅇㅇ아dafs
//             </div>
//           </div>
//           <div className="flex">
//             <div className="min-w-[4rem]">1면 보기</div>
//             <div className="w-48 truncate">ddd dadfs sㅇㅇㅇㅇ아dafs</div>
//           </div>
//           <div className="flex">
//             <div className="min-w-[4rem]">1면 보기</div>
//             <div className="w-48 truncate">dkdkakskㅇㅇㅇㅇ아dafs</div>
//           </div>
//           <div className="flex">
//             <div className="min-w-[4rem]">1면 보기</div>
//             <div className="w-48 truncate">dkdkaksk아아ㅇs</div>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">현재 상태</div>
//         <div>학습전</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">레벨</div>
//         <div>32 level</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">최근 뒤집기 시점</div>
//         <div>2021년 2월 17일</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">최근 선택 난이도</div>
//         <div>47.4</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">총 뒤집기 횟수</div>
//         <div>3회</div>
//       </div>

//       <div className="flex">
//         <div className="min-w-[7rem]">총 뒤집기 횟수</div>
//         <div>24분 15초</div>
//       </div>
//     </div>
//   );
// };

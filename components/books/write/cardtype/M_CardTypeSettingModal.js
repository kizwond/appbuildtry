import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, Modal, Input, Radio, InputNumber, Space, Divider } from "antd";
import axios from "axios";
import { QuestionCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { CardTypeCreate } from "../../../../graphql/query/cardtype";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useMutation, useQuery } from "@apollo/client";

const NewCardTemplete = ({ book_id, getUpdatedCardTypeList }) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("read");
  const [name, setName] = useState("");
  const [face1Num, setFace1Num] = useState();
  const [face2Num, setFace2Num] = useState();

  const [cardTypeSetId, setCardTypeSetId] = useState();

  const [cardTypes, setCardTypes] = useState();
  const { loading, error, data } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_id },
  });
  useEffect(() => {
    console.log("카드타입셋을 불러옴");
    if (data) {
      console.log("--->", data);
      setCardTypeSetId(data.cardtypeset_getbymybookids.cardtypesets[0]._id);
      setCardTypes(data.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
    } else {
      console.log("why here?");
    }
  }, [data]);

  const [cardtypeset_addcardtype] = useMutation(CardTypeCreate, { onCompleted: showdatacreate });

  function showdatacreate(data) {
    console.log("data", data);
    // getUpdatedCardTypeList(data.cardtypeset_addcardtype.cardtypesets[0].cardtypes);
  }

  async function cardtypecreate(value) {
    const type = value.type;
    console.log({
      mybook_id: book_id,
      cardtype: type,
      name: value.name,
      numofrow_face1: value.face1,
      numofrow_face2: value.face2,
      numofrow_annotation: 1,
    });

    try {
      await cardtypeset_addcardtype({
        variables: {
          forAddCardtype: {
            cardtypeset_id: cardTypeSetId,
            cardtype_info: {
              name: value.name,
              cardtype: type,
              num_of_row: {
                face1: value.face1,
                face2: value.face2,
                annotation: 1,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const addCardType = (value) => {
    console.log("---------------------????", value);
    cardtypecreate(value);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    if (type === "read") {
      var face1 = face1Num;
      var face2 = 0;
    } else if (type === "flip") {
      face1 = face1Num;
      face2 = face2Num;
    } else if (type === "subject") {
      face1 = face1Num;
      face2 = 0;
    } else if (type === "general") {
      face1 = face1Num;
      face2 = 0;
    } else if (type === "share") {
      face1 = face1Num;
      face2 = 0;
    }

    addCardType({ name: name, type: type, face1: face1, face2: face2 });

    setVisible(false);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setType(e.target.value);
  };

  const noneStudyOnchange = (e) => {
    console.log("noneStudyOnchange checked", e.target.value);
    setType(e.target.value);
  };

  const shareStudyOnchange = (e) => {
    console.log("shareStudyOnchange checked", e.target.value);
    setType(e.target.value);
  };

  const generalStudyOnchange = (e) => {
    console.log("shareStudyOnchange checked", e.target.value);
    setType(e.target.value);
  };

  const onChangeFace1 = (e) => {
    console.log("face1", e);
    setFace1Num(e);
  };

  const onChangeFace2 = (e) => {
    console.log("face2", e);
    setFace2Num(e);
  };
  const onChangeName = (e) => {
    console.log("onChangeName", e.target.value);
    setName(e.target.value);
  };

  return (
    <>
      <PlusCircleOutlined onClick={showModal} style={{ marginLeft: "7px", fontSize: "1.4rem", color: "grey" }} />
      <Modal title="새카드 템플릿" visible={visible} onOk={handleOk} onCancel={handleCancel} okText="만들기" cancelText="취소" maskClosable={false} width={350}>
        <div
          className="new_card_templete_container"
          style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-evenly" }}
        >
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "0.8rem" }}>카드이름 입력</div>
            <Input size="small" onChange={onChangeName} value={name} style={{ width: "150px", fontSize: "11px" }} placeholder="별칭을 입력하세요" />
          </div>
          <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>카드종류 선택</div>
            <Radio.Group onChange={onChange} style={{ fontSize: "0.8rem", height: "100%" }} defadivtValue={type}>
              <Radio style={radioStyle} value="read">
                <span style={{ fontSize: "0.8rem", marginRight: "10px" }}>학습 - 읽기카드</span>
                <Tooltip title="prompt text" color="#2db7f5">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
              <Radio style={radioStyle} value="flip">
                <span style={{ fontSize: "0.8rem", marginRight: "10px" }}>학습 - 뒤집기카드</span>
                <Tooltip title="prompt text" color="#2db7f5">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
              <Radio style={radioStyle} onChange={generalStudyOnchange} value="general">
                <span style={{ fontSize: "0.8rem", marginRight: "10px" }}>비학습 - 일반카드</span>
              </Radio>
              <Radio style={radioStyle} onChange={noneStudyOnchange} value="subject">
                <span style={{ fontSize: "0.8rem", marginRight: "10px" }}>비학습 - 제목카드</span>
              </Radio>

              <Radio style={radioStyle} onChange={shareStudyOnchange} value="share">
                <span style={{ fontSize: "0.8rem", marginRight: "10px" }}>비학습 - 공통지문카드</span>
                <Tooltip title="지시문, 공통지문으로 사용가능" color="#2db7f5">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Radio>
            </Radio.Group>
          </div>
          <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
          <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>행 개수 선택</div>
            <div>
              <div>
                <span>앞면 - 행 개수</span>
                <InputNumber value={face1Num} onChange={onChangeFace1} size="small" style={{ width: "100px", fontSize: "0.8rem", marginLeft: "10px" }} placeholder="최대 5행" />
              </div>
              {type === "flip" && type !== "subject" && type !== "general" && (
                <div>
                  <span>뒷면 - 행 개수</span>
                  <InputNumber value={face2Num} onChange={onChangeFace2} size="small" style={{ width: "100px", fontSize: "0.8rem", marginLeft: "10px" }} placeholder="최대 5행" />
                </div>
              )}
            </div>
          </div>
          {type === "read" && <div style={{ fontStyle: "italic", fontSize: "0.8rem", marginLeft: "20px", marginTop: "10px" }}>※ 읽기카드는 단면으로 된 카드입니다.</div>}

          {type === "flip" && (
            <div style={{ fontStyle: "italic", fontSize: "0.8rem", marginLeft: "20px", marginTop: "10px" }}>
              ※ 뒤집기카드는 양면으로 구성된 카드입니다. 앞면과 뒷면을 활용하여 다양한 학습기능을 사용하실 수 있습니다.
            </div>
          )}

          {type === "subject" && (
            <div style={{ fontStyle: "italic", fontSize: "0.8rem", marginLeft: "20px", marginTop: "10px" }}>
              ※ 비학습카드는 학습과 무관한 단면카드입니다. 제목카드나 ... 용도로 사용하실 수 있습니다.
            </div>
          )}

          {type === "share" && (
            <div style={{ fontStyle: "italic", fontSize: "0.8rem", marginLeft: "20px", marginTop: "10px" }}>
              ※ 공통지문카드는 단면카드입니다. 이 카드를 활용하여 1개의 지문에 여러 문제를 추가하실 수 있습니다.
            </div>
          )}
          {type === "general" && (
            <div style={{ fontStyle: "italic", fontSize: "0.8rem", marginLeft: "20px", marginTop: "10px" }}>※ 안내사항이나 블라블라 비학습카드, 단순 정보제공? 카드</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NewCardTemplete;

const radioStyle = {
  display: "block",
  fontSize: "0.8rempx",
  alignItems: "center",
};

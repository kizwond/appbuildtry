import React, { useState, useEffect, useCallback } from "react";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Button, Select } from "antd";
import { AddCard } from "../../../../graphql/query/card_contents";

const { Option } = Select;

const WriteContainer = ({ indexChanged, indexSetId, book_id, Editor, EditorFromCard, FroalaEditorView }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
    var first_index_tmp = localStorage.getItem("first_index");
    if (indexChanged) {
      if (indexChanged === first_index_tmp) {
        var first_index = first_index_tmp;
      } else {
        first_index = indexChanged;
      }
    } else {
      var first_index = localStorage.getItem("first_index");
    }

    if (book_id !== null) {
      localStorage.removeItem("book_id");
      localStorage.setItem("book_id", book_id);
    } else {
      localStorage.setItem("book_id", book_id);
    }
  }

  const [cardTypeSetId, setCardTypeSetId] = useState();
  const [cardTypeSets, setCardTypeSets] = useState();
  const [cardTypes, setCardTypes] = useState();
  const [cardSetId, setCardSetId] = useState();
  const [cards, setCards] = useState([]);
  const [editorOn, setEditorOn] = useState();
  const [editorOnFromCard, setEditorOnFromCard] = useState();
  const [cardId, setCardId] = useState("");
  const [selectedCardType, setSelectedCardType] = useState();

  const {
    loading,
    error,
    data: data1,
  } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_id, index_ids: first_index },
  });
  var indexList = data1.indexset_getByMybookids.indexsets[0].indexes;
  useEffect(() => {
    if (data1) {
      console.log("최초 로드 data : ", data1);
      // setCardTypeSetId(data1.cardtypeset_getbymybookids.cardtypesets[0]._id);
      // setCardTypeSets(data1.cardtypeset_getbymybookids.cardtypesets);
      // setCardTypes(data1.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
      // setCardSetId(data1.cardset_getByIndexIDs.cardsets[0]._id);
      // setCards(data1.cardset_getByIndexIDs.cardsets[0].cards);
    } else {
      console.log("why here?");
    }
  }, [data1, indexChanged, first_index]);

  const cardTypeInfo = (cardtype_info, from, parentId) => {
    console.log(parentId);
    console.log("여기다여기 : ", cardtype_info);
    const cardtypeEditor = cardtype_info.cardtype; //에디터에서 플립모드에 셀렉션 부과하려고 필요한 정보

    const num_face1 = cardtype_info.num_of_row.face1;
    const num_face2 = cardtype_info.num_of_row.face2;
    const num_selection = cardtype_info.num_of_row.selection;
    const num_annotation = cardtype_info.num_of_row.annotation;

    const nick_face1 = cardtype_info.nick_of_row.face1;
    const nick_face2 = cardtype_info.nick_of_row.face2;
    const nick_selection = cardtype_info.nick_of_row.selection;
    const nick_annotation = cardtype_info.nick_of_row.annotation;

    const nicks = [];

    const face1 = [];
    const face1Nick = [];
    for (var i = 0; i < num_face1; i++) {
      face1.push(i);
      face1Nick.push(nick_face1[i]);
      nicks.push(nick_face1[i]);
    }

    const face2 = [];
    const face2Nick = [];
    for (var i = 0; i < num_face2; i++) {
      face2.push(i);
      face2Nick.push(nick_face2[i]);
      nicks.push(nick_face2[i]);
    }

    const annot = [];
    const annotNick = [];
    for (var i = 0; i < num_annotation; i++) {
      annot.push(i);
      annotNick.push(nick_annotation[i]);
      nicks.push(nick_annotation[i]);
    }

    if (selectedCardType === undefined) {
      var selectedCardTypeOption = cardtype_info.name;
    } else {
      selectedCardTypeOption = selectedCardType.name;
    }
    const editor = (
      <>
        <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          <div>카드 템플릿 선택 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              카드타입선택
            </Option>
            {cardTypeListNormal}
          </Select>
        </div>
        <div style={{ marginBottom: "100px" }}>
          <Editor
            face1={face1}
            face2={face2}
            annot={annot}
            parentId={parentId}
            nicks={nicks}
            cardtypeEditor={cardtypeEditor}
            onFinish={onFinish}
            setEditorOn={setEditorOn}
            cardtype_info={cardtype_info}
          />
        </div>
      </>
    );

    const editorFromCard = (
      <>
        <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          <div>카드 템플릿 선택 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              카드타입선택
            </Option>
            {cardTypeListInCard}
          </Select>
        </div>
        <EditorFromCard
          face1={face1}
          face2={face2}
          annot={annot}
          parentId={parentId}
          nicks={nicks}
          cardtypeEditor={cardtypeEditor}
          onFinish={onFinish}
          setEditorOnFromCard={setEditorOnFromCard}
          cardtype_info={cardtype_info}
        />
      </>
    );

    if (from === "normal") {
      console.log("노멀모드로 에디터가 뿌려질것임. 여기다가 setCardId() 이걸 했는데 안먹음.");
      console.log(cardId);
      setEditorOn(editor);
    } else if (from === "inCard") {
      setEditorOnFromCard(editorFromCard);
    }
  };

  const onFinish = (values, from) => {
    console.log(values);
    console.log(values.parentId);
    const mybook_id = localStorage.getItem("book_id");
    const cardtype = sessionStorage.getItem("cardtype");
    console.log("??????????????????????", cardId);
    if (from === "inCard") {
      var current_position_card_id = cardId;
      console.log("should have cardid", cardId);
    } else {
      current_position_card_id = null;
      console.log("should be null", cardId);
    }

    const cardtype_id = sessionStorage.getItem("selectedCardTypeId");

    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, values.face1, values.face2, values.annotation);
  };

  const [cardset_addcard] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    setCards(data.cardset_addcard.cardsets[0].cards);
    sessionStorage.removeItem("parentId");
  }

  async function addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, face1_contents, face2_contents, annotation_contents) {
    const parentId = sessionStorage.getItem("parentId");
    console.log("부모카드아이디", parentId);
    if (parentId === null) {
      var hasParent = "no";
    } else {
      hasParent = "yes";
    }
    try {
      await cardset_addcard({
        variables: {
          forAddCard: {
            currentPositionCardID: current_position_card_id,
            card_info: {
              mybook_id: mybook_id,
              indexset_id: indexSetId,
              index_id: first_index,
              cardset_id: cardSetId,
              cardtypeset_id: cardTypeSetId,
              cardtype_id,
              cardtype,
              hasParent: hasParent,
              parentCard_id: parentId,
            },
            contents: {
              // user_flag: null,
              // maker_flag: null,
              face1: face1_contents,
              selection: null,
              face2: face2_contents,
              annotation: annotation_contents,
              // memo: null,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (cardTypes) {
    var cardTypeListNormal = cardTypes.map((cardType) => {
      return (
        <>
          <Option value={[cardType.cardtype_info.name, "normal"]} style={{ fontSize: "0.8rem" }}>
            {cardType.cardtype_info.name}
          </Option>
        </>
      );
    });
    var cardTypeListInCard = cardTypes.map((cardType) => {
      return (
        <>
          <Option value={[cardType.cardtype_info.name, "inCard"]} style={{ fontSize: "0.8rem" }}>
            {cardType.cardtype_info.name}
          </Option>
        </>
      );
    });
  }

  function handleChange(value) {
    console.log(`selected ${value[0]}`);
    console.log(`selected ${value[1]}`);
    if (value[0] !== "default") {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === value[0]);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, value[1]);
    }
  }

  function onClickCardAdd() {
    setEditorOn("");
    if (selectedCardType === undefined) {
      setSelectedCardType(cardTypes[0].cardtype_info);
      cardTypeInfo(cardTypes[0].cardtype_info, "inCard");
      sessionStorage.setItem("cardtype", cardTypes[0].cardtype_info.cardtype);
    } else {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === selectedCardType.name);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, "inCard");
    }
  }

  function onClickCardAddChild(type, parentId) {
    console.log(parentId);
    sessionStorage.setItem("parentId", parentId);
    setEditorOn("");
    if (selectedCardType === undefined) {
      setSelectedCardType(cardTypes[0].cardtype_info);
      cardTypeInfo(cardTypes[0].cardtype_info, "inCard", parentId);
      sessionStorage.setItem("cardtype", cardTypes[0].cardtype_info.cardtype);
    } else {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === selectedCardType.name);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, "inCard", parentId);
    }
  }

  if (cards) {
    var contents = cards.map((content) => {
      if (content._id === cardId) {
        var borderLeft = "2px solid blue";
      } else {
        borderLeft = "none";
      }
      console.log("해당카드 정보", content);
      // console.log("카드에 스타일 입히기 시작", cardTypeSets);

      const current_card_style = cardTypeSets[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
      // console.log(current_card_style);

      const face_style = current_card_style[0].face_style;
      const row_style = current_card_style[0].row_style;
      const row_font = current_card_style[0].row_font;

      // console.log(row_font);

      return (
        <>
          {content.card_info.cardtype === "read" && (
            <>
              <div className={`${content._id} other`} style={{ marginBottom: "5px" }}>
                <div onClick={() => onClickCard(content._id, "normal")}>
                  {/* 페이스 스타일 영역 */}
                  <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: "80%",
                        backgroundColor: face_style[0].background.color,
                        marginTop: face_style[0].outer_margin.top,
                        marginBottom: face_style[0].outer_margin.bottom,
                        marginLeft: face_style[0].outer_margin.left,
                        marginRight: face_style[0].outer_margin.right,
                        paddingTop: face_style[0].inner_padding.top,
                        paddingBottom: face_style[0].inner_padding.bottom,
                        paddingLeft: face_style[0].inner_padding.left,
                        paddingRight: face_style[0].inner_padding.right,
                        borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                        borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                        borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                        borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                      }}
                    >
                      {content.contents.mycontents_id.face1.map((item, index) => (
                        <>
                          <div
                            style={{
                              backgroundColor: row_style.face1[index].background.color,
                              marginTop: row_style.face1[index].outer_margin.top,
                              marginBottom: row_style.face1[index].outer_margin.bottom,
                              marginLeft: row_style.face1[index].outer_margin.left,
                              marginRight: row_style.face1[index].outer_margin.right,
                              paddingTop: row_style.face1[index].inner_padding.top,
                              paddingBottom: row_style.face1[index].inner_padding.bottom,
                              paddingLeft: row_style.face1[index].inner_padding.left,
                              paddingRight: row_style.face1[index].inner_padding.right,
                              borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                              borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                              borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                              borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                              textAlign: row_font.face1[index].align,
                              fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                              color: row_font.face1[index].color,
                              fontFamily: `${
                                row_font.face1[index].font === "고딕"
                                  ? `NanumGothic`
                                  : row_font.face1[index].font === "명조"
                                  ? `NanumMyeongjo`
                                  : row_font.face1[index].font === "바탕"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face1[index].font === "돋움"
                                  ? `Gowun Dodum, sans-serif`
                                  : ""
                              } `,
                              fontStyle: `${row_font.face1[index].italic === "on" ? "italic" : "normal"}`,
                              fontSize: row_font.face1[index].size,
                              textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                            }}
                          >
                            <FroalaEditorView model={item} />
                          </div>
                        </>
                      ))}
                    </div>
                    <div
                      style={{
                        width: "20%",
                        backgroundColor: face_style[1].background.color,
                        marginTop: face_style[1].outer_margin.top,
                        marginBottom: face_style[1].outer_margin.bottom,
                        marginLeft: face_style[1].outer_margin.left,
                        marginRight: face_style[1].outer_margin.right,
                        paddingTop: face_style[1].inner_padding.top,
                        paddingBottom: face_style[1].inner_padding.bottom,
                        paddingLeft: face_style[1].inner_padding.left,
                        paddingRight: face_style[1].inner_padding.right,
                        borderTop: `${face_style[1].border.top.thickness}px ${face_style[1].border.top.bordertype} ${face_style[1].border.top.color}`,
                        borderBottom: `${face_style[1].border.bottom.thickness}px ${face_style[1].border.bottom.bordertype} ${face_style[1].border.bottom.color}`,
                        borderLeft: `${face_style[1].border.left.thickness}px ${face_style[1].border.left.bordertype} ${face_style[1].border.left.color}`,
                        borderRight: `${face_style[1].border.right.thickness}px ${face_style[1].border.right.bordertype} ${face_style[1].border.right.color}`,
                      }}
                    >
                      {content.contents.mycontents_id.annotation &&
                        content.contents.mycontents_id.annotation.map((item, index) => (
                          <>
                            <div
                              style={{
                                backgroundColor: row_style.annotation[index].background.color,
                                marginTop: row_style.annotation[index].outer_margin.top,
                                marginBottom: row_style.annotation[index].outer_margin.bottom,
                                marginLeft: row_style.annotation[index].outer_margin.left,
                                marginRight: row_style.annotation[index].outer_margin.right,
                                paddingTop: row_style.annotation[index].inner_padding.top,
                                paddingBottom: row_style.annotation[index].inner_padding.bottom,
                                paddingLeft: row_style.annotation[index].inner_padding.left,
                                paddingRight: row_style.annotation[index].inner_padding.right,
                                borderTop: `${row_style.annotation[index].border.top.thickness}px ${row_style.annotation[index].border.top.bordertype} ${row_style.annotation[index].border.top.color}`,
                                borderBottom: `${row_style.annotation[index].border.bottom.thickness}px ${row_style.annotation[index].border.bottom.bordertype} ${row_style.annotation[index].border.bottom.color}`,
                                borderLeft: `${row_style.annotation[index].border.left.thickness}px ${row_style.annotation[index].border.left.bordertype} ${row_style.annotation[index].border.left.color}`,
                                borderRight: `${row_style.annotation[index].border.right.thickness}px ${row_style.annotation[index].border.right.bordertype} ${row_style.annotation[index].border.right.color}`,
                                textAlign: row_font.annotation[index].align,
                                fontWeight: `${row_font.annotation[index].bold === "on" ? 700 : 400}`,
                                color: row_font.annotation[index].color,
                                fontFamily: `${
                                  row_font.annotation[index].font === "고딕"
                                    ? `NanumGothic`
                                    : row_font.annotation[index].font === "명조"
                                    ? `NanumMyeongjo`
                                    : row_font.annotation[index].font === "바탕"
                                    ? `Gowun Batang, sans-serif`
                                    : row_font.annotation[index].font === "돋움"
                                    ? `Gowun Dodum, sans-serif`
                                    : ""
                                } `,
                                fontStyle: `${row_font.annotation[index].italic === "on" ? "italic" : "normal"}`,
                                fontSize: row_font.annotation[index].size,
                                textDecoration: `${row_font.annotation[index].underline === "on" ? "underline" : "none"}`,
                              }}
                            >
                              <FroalaEditorView model={item} />
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
                {content._id === cardId && (
                  <>
                    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                      <div>
                        <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                          다음카드추가
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {content._id === cardId && (
                <>
                  <div>{editorOnFromCard}</div>
                </>
              )}
            </>
          )}
          {content.card_info.cardtype === "subject" && (
            <>
              <div className={`${content._id} other`} style={{ marginBottom: "5px" }}>
                <div onClick={() => onClickCard(content._id, "normal")}>
                  {/* 페이스 스타일 영역 */}
                  <div
                    style={{
                      backgroundColor: face_style[0].background.color,
                      marginTop: face_style[0].outer_margin.top,
                      marginBottom: face_style[0].outer_margin.bottom,
                      marginLeft: face_style[0].outer_margin.left,
                      marginRight: face_style[0].outer_margin.right,
                      paddingTop: face_style[0].inner_padding.top,
                      paddingBottom: face_style[0].inner_padding.bottom,
                      paddingLeft: face_style[0].inner_padding.left,
                      paddingRight: face_style[0].inner_padding.right,
                      borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                      borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                      borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                      borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                    }}
                  >
                    {content.contents.mycontents_id.face1.map((item, index) => (
                      <>
                        <div
                          style={{
                            backgroundColor: row_style.face1[index].background.color,
                            marginTop: row_style.face1[index].outer_margin.top,
                            marginBottom: row_style.face1[index].outer_margin.bottom,
                            marginLeft: row_style.face1[index].outer_margin.left,
                            marginRight: row_style.face1[index].outer_margin.right,
                            paddingTop: row_style.face1[index].inner_padding.top,
                            paddingBottom: row_style.face1[index].inner_padding.bottom,
                            paddingLeft: row_style.face1[index].inner_padding.left,
                            paddingRight: row_style.face1[index].inner_padding.right,
                            borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                            borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                            borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                            borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                            textAlign: row_font.face1[index].align,
                            fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                            color: row_font.face1[index].color,
                            fontFamily: `${
                              row_font.face1[index].font === "고딕"
                                ? `NanumGothic`
                                : row_font.face1[index].font === "명조"
                                ? `NanumMyeongjo`
                                : row_font.face1[index].font === "바탕"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face1[index].font === "돋움"
                                ? `Gowun Dodum, sans-serif`
                                : ""
                            } `,
                            fontStyle: `${row_font.face1[index].italic === "on" ? "italic" : "normal"}`,
                            fontSize: row_font.face1[index].size,
                            textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                          }}
                        >
                          <FroalaEditorView model={item} />
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                {content._id === cardId && (
                  <>
                    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                      <div>
                        <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                          다음카드추가
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {content._id === cardId && (
                <>
                  <div>{editorOnFromCard}</div>
                </>
              )}
            </>
          )}
          {content.card_info.cardtype === "general" && (
            <>
              <div className={`${content._id} child_group other`}>
                <div style={{ marginBottom: "5px" }}>
                  <div onClick={() => onClickCard(content._id, "general")} style={{ borderLeft: "2px solid green" }}>
                    {/* 페이스 스타일 영역 */}
                    <div
                      style={{
                        backgroundColor: face_style[0].background.color,
                        marginTop: face_style[0].outer_margin.top,
                        marginBottom: face_style[0].outer_margin.bottom,
                        marginLeft: face_style[0].outer_margin.left,
                        marginRight: face_style[0].outer_margin.right,
                        paddingTop: face_style[0].inner_padding.top,
                        paddingBottom: face_style[0].inner_padding.bottom,
                        paddingLeft: face_style[0].inner_padding.left,
                        paddingRight: face_style[0].inner_padding.right,
                        borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                        borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                        borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                        borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                      }}
                    >
                      {content.contents.mycontents_id.face1.map((item, index) => (
                        <>
                          <div
                            style={{
                              backgroundColor: row_style.face1[index].background.color,
                              marginTop: row_style.face1[index].outer_margin.top,
                              marginBottom: row_style.face1[index].outer_margin.bottom,
                              marginLeft: row_style.face1[index].outer_margin.left,
                              marginRight: row_style.face1[index].outer_margin.right,
                              paddingTop: row_style.face1[index].inner_padding.top,
                              paddingBottom: row_style.face1[index].inner_padding.bottom,
                              paddingLeft: row_style.face1[index].inner_padding.left,
                              paddingRight: row_style.face1[index].inner_padding.right,
                              borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                              borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                              borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                              borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                              textAlign: row_font.face1[index].align,
                              fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                              color: row_font.face1[index].color,
                              fontFamily: `${
                                row_font.face1[index].font === "고딕"
                                  ? `NanumGothic`
                                  : row_font.face1[index].font === "명조"
                                  ? `NanumMyeongjo`
                                  : row_font.face1[index].font === "바탕"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face1[index].font === "돋움"
                                  ? `Gowun Dodum, sans-serif`
                                  : ""
                              } `,
                              fontStyle: `${row_font.face1[index].italic === "on" ? "italic" : "normal"}`,
                              fontSize: row_font.face1[index].size,
                              textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                            }}
                          >
                            <FroalaEditorView model={item} />
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                  {content._id === cardId && (
                    <>
                      <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                        <div>
                          <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                            다음카드추가
                          </Button>
                        </div>
                        <div>
                          <Button size="small" onClick={() => onClickCardAddChild("general", content._id)} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                            자식카드추가
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ height: "5px" }}></div>
              </div>
              {content._id === cardId && (
                <>
                  <div>{editorOnFromCard}</div>
                </>
              )}
            </>
          )}
          {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "top-bottom" && (
            <>
              <div className={`${content.card_info.parent_card_id} ${content._id} child_group other`}>
                <div style={{ marginBottom: "0px" }}>
                  <div
                    onClick={() => onClickCard(content._id, "flip", content.card_info.parent_card_id)}
                    style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}`, marginLeft: `${content.card_info.hasParent === "yes" && "10px"}` }}
                  >
                    {/* 페이스1 스타일 영역 */}
                    <div
                      style={{
                        backgroundColor: face_style[0].background.color,
                        marginTop: face_style[0].outer_margin.top,
                        marginBottom: face_style[0].outer_margin.bottom,
                        marginLeft: face_style[0].outer_margin.left,
                        marginRight: face_style[0].outer_margin.right,
                        paddingTop: face_style[0].inner_padding.top,
                        paddingBottom: face_style[0].inner_padding.bottom,
                        paddingLeft: face_style[0].inner_padding.left,
                        paddingRight: face_style[0].inner_padding.right,
                        borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                        borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                        borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                        borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                      }}
                    >
                      {content.contents.mycontents_id.face1.map((item, index) => (
                        <>
                          <div
                            style={{
                              backgroundColor: row_style.face1[index].background.color,
                              marginTop: row_style.face1[index].outer_margin.top,
                              marginBottom: row_style.face1[index].outer_margin.bottom,
                              marginLeft: row_style.face1[index].outer_margin.left,
                              marginRight: row_style.face1[index].outer_margin.right,
                              paddingTop: row_style.face1[index].inner_padding.top,
                              paddingBottom: row_style.face1[index].inner_padding.bottom,
                              paddingLeft: row_style.face1[index].inner_padding.left,
                              paddingRight: row_style.face1[index].inner_padding.right,
                              borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                              borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                              borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                              borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                              textAlign: row_font.face1[index].align,
                              fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                              color: row_font.face1[index].color,
                              fontFamily: `${
                                row_font.face1[index].font === "고딕"
                                  ? `NanumGothic`
                                  : row_font.face1[index].font === "명조"
                                  ? `NanumMyeongjo`
                                  : row_font.face1[index].font === "바탕"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face1[index].font === "돋움"
                                  ? `Gowun Dodum, sans-serif`
                                  : ""
                              } `,
                              fontSize: row_font.face1[index].size,
                              textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                            }}
                          >
                            <FroalaEditorView model={item} />
                          </div>
                        </>
                      ))}
                    </div>
                    {/* 페이스2 스타일 영역 */}
                    <div
                      style={{
                        backgroundColor: face_style[1].background.color,
                        marginTop: face_style[1].outer_margin.top,
                        marginBottom: face_style[1].outer_margin.bottom,
                        marginLeft: face_style[1].outer_margin.left,
                        marginRight: face_style[1].outer_margin.right,
                        paddingTop: face_style[1].inner_padding.top,
                        paddingBottom: face_style[1].inner_padding.bottom,
                        paddingLeft: face_style[1].inner_padding.left,
                        paddingRight: face_style[1].inner_padding.right,
                        borderTop: `${face_style[1].border.top.thickness}px ${face_style[1].border.top.bordertype} ${face_style[1].border.top.color}`,
                        borderBottom: `${face_style[1].border.bottom.thickness}px ${face_style[1].border.bottom.bordertype} ${face_style[1].border.bottom.color}`,
                        borderLeft: `${face_style[1].border.left.thickness}px ${face_style[1].border.left.bordertype} ${face_style[1].border.left.color}`,
                        borderRight: `${face_style[1].border.right.thickness}px ${face_style[1].border.right.bordertype} ${face_style[1].border.right.color}`,
                      }}
                    >
                      {content.contents.mycontents_id.face2.map((item, index) => (
                        <>
                          <div
                            style={{
                              backgroundColor: row_style.face2[index].background.color,
                              marginTop: row_style.face2[index].outer_margin.top,
                              marginBottom: row_style.face2[index].outer_margin.bottom,
                              marginLeft: row_style.face2[index].outer_margin.left,
                              marginRight: row_style.face2[index].outer_margin.right,
                              paddingTop: row_style.face2[index].inner_padding.top,
                              paddingBottom: row_style.face2[index].inner_padding.bottom,
                              paddingLeft: row_style.face2[index].inner_padding.left,
                              paddingRight: row_style.face2[index].inner_padding.right,
                              borderTop: `${row_style.face2[index].border.top.thickness}px ${row_style.face2[index].border.top.bordertype} ${row_style.face2[index].border.top.color}`,
                              borderBottom: `${row_style.face2[index].border.bottom.thickness}px ${row_style.face2[index].border.bottom.bordertype} ${row_style.face2[index].border.bottom.color}`,
                              borderLeft: `${row_style.face2[index].border.left.thickness}px ${row_style.face2[index].border.left.bordertype} ${row_style.face2[index].border.left.color}`,
                              borderRight: `${row_style.face2[index].border.right.thickness}px ${row_style.face2[index].border.right.bordertype} ${row_style.face2[index].border.right.color}`,
                              textAlign: row_font.face2[index].align,
                              fontWeight: `${row_font.face2[index].bold === "on" ? 700 : 400}`,
                              color: row_font.face2[index].color,
                              fontFamily: `${
                                row_font.face2[index].font === "고딕"
                                  ? `NanumGothic`
                                  : row_font.face2[index].font === "명조"
                                  ? `NanumMyeongjo`
                                  : row_font.face2[index].font === "바탕"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face2[index].font === "돋움"
                                  ? `Gowun Dodum, sans-serif`
                                  : ""
                              } `,
                              fontStyle: `${row_font.face2[index].italic === "on" ? "italic" : "normal"}`,
                              fontSize: row_font.face2[index].size,
                              textDecoration: `${row_font.face2[index].underline === "on" ? "underline" : "none"}`,
                            }}
                          >
                            <FroalaEditorView model={item} />
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                  {content._id === cardId && content.card_info.hasParent === "no" && (
                    <>
                      <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                        <div>
                          <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                            다음카드추가
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  {content._id === cardId && content.card_info.hasParent === "yes" && (
                    <>
                      <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                        <div>
                          <Button
                            size="small"
                            onClick={() => onClickCardAddChild("general", content.card_info.parent_card_id)}
                            style={{ fontSize: "0.75rem", border: "1px solid grey" }}
                          >
                            자식카드추가
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ height: "5px" }}></div>
              </div>
              {content._id === cardId && (
                <>
                  <div>{editorOnFromCard}</div>
                </>
              )}
            </>
          )}
          {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "left-right" && (
            <>
              <div className={`${content.card_info.parent_card_id} ${content._id} child_group other`}>
                <div style={{ marginBottom: "0px" }}>
                  <div
                    onClick={() => onClickCard(content._id, "flip", content.card_info.parent_card_id)}
                    style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}`, marginLeft: `${content.card_info.hasParent === "yes" && "10px"}` }}
                  >
                    {/* 페이스1 스타일 영역 */}
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%" }}>
                      <div
                        style={{
                          width: `${current_card_style[0].cardtype_info.flip_option.left_face_ratio}%`,
                          backgroundColor: face_style[0].background.color,
                          marginTop: face_style[0].outer_margin.top,
                          marginBottom: face_style[0].outer_margin.bottom,
                          marginLeft: face_style[0].outer_margin.left,
                          marginRight: face_style[0].outer_margin.right,
                          paddingTop: face_style[0].inner_padding.top,
                          paddingBottom: face_style[0].inner_padding.bottom,
                          paddingLeft: face_style[0].inner_padding.left,
                          paddingRight: face_style[0].inner_padding.right,
                          borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                          borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                          borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                          borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                        }}
                      >
                        {content.contents.mycontents_id.face1.map((item, index) => (
                          <>
                            <div
                              style={{
                                backgroundColor: row_style.face1[index].background.color,
                                marginTop: row_style.face1[index].outer_margin.top,
                                marginBottom: row_style.face1[index].outer_margin.bottom,
                                marginLeft: row_style.face1[index].outer_margin.left,
                                marginRight: row_style.face1[index].outer_margin.right,
                                paddingTop: row_style.face1[index].inner_padding.top,
                                paddingBottom: row_style.face1[index].inner_padding.bottom,
                                paddingLeft: row_style.face1[index].inner_padding.left,
                                paddingRight: row_style.face1[index].inner_padding.right,
                                borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                                borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                                borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                                borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                                textAlign: row_font.face1[index].align,
                                fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                                color: row_font.face1[index].color,
                                fontFamily: `${
                                  row_font.face1[index].font === "고딕"
                                    ? `NanumGothic`
                                    : row_font.face1[index].font === "명조"
                                    ? `NanumMyeongjo`
                                    : row_font.face1[index].font === "바탕"
                                    ? `Gowun Batang, sans-serif`
                                    : row_font.face1[index].font === "돋움"
                                    ? `Gowun Dodum, sans-serif`
                                    : ""
                                } `,
                                fontSize: row_font.face1[index].size,
                                textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                              }}
                            >
                              <FroalaEditorView model={item} />
                            </div>
                          </>
                        ))}
                      </div>
                      {/* 페이스2 스타일 영역 */}
                      <div
                        style={{
                          width: `${100 - current_card_style[0].cardtype_info.flip_option.left_face_ratio}%`,
                          backgroundColor: face_style[1].background.color,
                          marginTop: face_style[1].outer_margin.top,
                          marginBottom: face_style[1].outer_margin.bottom,
                          marginLeft: face_style[1].outer_margin.left,
                          marginRight: face_style[1].outer_margin.right,
                          paddingTop: face_style[1].inner_padding.top,
                          paddingBottom: face_style[1].inner_padding.bottom,
                          paddingLeft: face_style[1].inner_padding.left,
                          paddingRight: face_style[1].inner_padding.right,
                          borderTop: `${face_style[1].border.top.thickness}px ${face_style[1].border.top.bordertype} ${face_style[1].border.top.color}`,
                          borderBottom: `${face_style[1].border.bottom.thickness}px ${face_style[1].border.bottom.bordertype} ${face_style[1].border.bottom.color}`,
                          borderLeft: `${face_style[1].border.left.thickness}px ${face_style[1].border.left.bordertype} ${face_style[1].border.left.color}`,
                          borderRight: `${face_style[1].border.right.thickness}px ${face_style[1].border.right.bordertype} ${face_style[1].border.right.color}`,
                        }}
                      >
                        {content.contents.mycontents_id.face2.map((item, index) => (
                          <>
                            <div
                              style={{
                                backgroundColor: row_style.face2[index].background.color,
                                marginTop: row_style.face2[index].outer_margin.top,
                                marginBottom: row_style.face2[index].outer_margin.bottom,
                                marginLeft: row_style.face2[index].outer_margin.left,
                                marginRight: row_style.face2[index].outer_margin.right,
                                paddingTop: row_style.face2[index].inner_padding.top,
                                paddingBottom: row_style.face2[index].inner_padding.bottom,
                                paddingLeft: row_style.face2[index].inner_padding.left,
                                paddingRight: row_style.face2[index].inner_padding.right,
                                borderTop: `${row_style.face2[index].border.top.thickness}px ${row_style.face2[index].border.top.bordertype} ${row_style.face2[index].border.top.color}`,
                                borderBottom: `${row_style.face2[index].border.bottom.thickness}px ${row_style.face2[index].border.bottom.bordertype} ${row_style.face2[index].border.bottom.color}`,
                                borderLeft: `${row_style.face2[index].border.left.thickness}px ${row_style.face2[index].border.left.bordertype} ${row_style.face2[index].border.left.color}`,
                                borderRight: `${row_style.face2[index].border.right.thickness}px ${row_style.face2[index].border.right.bordertype} ${row_style.face2[index].border.right.color}`,
                                textAlign: row_font.face2[index].align,
                                fontWeight: `${row_font.face2[index].bold === "on" ? 700 : 400}`,
                                color: row_font.face2[index].color,
                                fontFamily: `${
                                  row_font.face2[index].font === "고딕"
                                    ? `NanumGothic`
                                    : row_font.face2[index].font === "명조"
                                    ? `NanumMyeongjo`
                                    : row_font.face2[index].font === "바탕"
                                    ? `Gowun Batang, sans-serif`
                                    : row_font.face2[index].font === "돋움"
                                    ? `Gowun Dodum, sans-serif`
                                    : ""
                                } `,
                                fontStyle: `${row_font.face2[index].italic === "on" ? "italic" : "normal"}`,
                                fontSize: row_font.face2[index].size,
                                textDecoration: `${row_font.face2[index].underline === "on" ? "underline" : "none"}`,
                              }}
                            >
                              <FroalaEditorView model={item} />
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                  {content._id === cardId && content.card_info.hasParent === "no" && (
                    <>
                      <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                        <div>
                          <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                            다음카드추가
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  {content._id === cardId && content.card_info.hasParent === "yes" && (
                    <>
                      <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                        <div>
                          <Button
                            size="small"
                            onClick={() => onClickCardAddChild("general", content.card_info.parent_card_id)}
                            style={{ fontSize: "0.75rem", border: "1px solid grey" }}
                          >
                            자식카드추가
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ height: "5px" }}></div>
              </div>
              {content._id === cardId && (
                <>
                  <div>{editorOnFromCard}</div>
                </>
              )}
            </>
          )}
        </>
      );
    });
  }
  const onClickCard = (card_id, from, group) => {
    console.log("cardClicked!!!!!");
    console.log("onClickCard", card_id);
    console.log("from", from);
    console.log("parent", group);
    if ((from !== "general" && from !== "normal" && from !== "flip" && group === undefined) || null) {
      console.log("null or undefined");
      const selected1 = document.getElementsByClassName("child_group");
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var a = 0; a < selected1.length; a++) {
        const section2 = selected1.item(a);
        section2.style.borderLeft = "none";
      }
    } else if (from === "general") {
      console.log("general");
      const selected1 = document.getElementsByClassName(card_id);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var b = 0; b < selected1.length; b++) {
        const section2 = selected1.item(b);
        section2.style.borderLeft = "2px solid blue";
      }
    } else if (from === "normal") {
      console.log("normal");
      const selected1 = document.getElementsByClassName(card_id);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var b = 0; b < selected1.length; b++) {
        const section2 = selected1.item(b);
        section2.style.borderLeft = "2px solid blue";
      }
    } else if ((from === "flip" && group === undefined) || null) {
      console.log("flip");
      const selected4 = document.getElementsByClassName(card_id);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var b = 0; b < selected4.length; b++) {
        const section4 = selected4.item(b);
        section4.style.borderLeft = "2px solid blue";
      }
    } else {
      console.log("parent Id");
      const selected3 = document.getElementsByClassName(group);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var c = 0; c < selected3.length; c++) {
        const section3 = selected3.item(c);
        console.log(section3);
        section3.style.borderLeft = "2px solid blue";
      }
    }

    setCardId(card_id);
    setEditorOnFromCard("");
    setEditorOn("");
  };

  return (
    <>
      <div style={{ width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
        <div>selected index id : {first_index}</div>
        <div>{contents}</div>
        <div>{editorOn}</div>
      </div>
      {data1 && (
        <>
          <FixedBottomMenu
            selectedCardType={selectedCardType}
            setSelectedCardType={setSelectedCardType}
            book_id={book_id}
            cardTypes={cardTypes}
            cardTypeInfo={cardTypeInfo}
            cardSetId={cardSetId}
            indexChanged={indexChanged}
            indexSetId={indexSetId}
            indexList={indexList}
            setEditorOnFromCard={setEditorOnFromCard}
            setCardId={setCardId}
          />
        </>
      )}
    </>
  );
};

export default WriteContainer;

const a4Page = {
  width: `790px`,
  minHeight: `1000px`,
  padding: `75px 75px 75px 75px`,
  border: "1px #D3D3D3 solid",
  borderRadius: "5px",
  background: `#ffffff`,
  boxShadow: " 0 0 5px rgba(0, 0, 0, 0.1)",
};

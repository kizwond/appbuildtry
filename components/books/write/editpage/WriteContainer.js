import React, { useState, useEffect, useCallback } from "react";
import { GetCardTypeSet, CardTypeCreate } from "../../../../graphql/query/cardtype";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FloatingMenu from "./sidemenu/FloatingMenu";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Input, message, Button, Select } from "antd";
import { AddCard, GetCardSet } from "../../../../graphql/query/card_contents";

import { useMediaQuery } from "react-responsive";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

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
  const [cardTypeInfos, setcardTypeInfos] = useState();
  const [indexId, setIndexId] = useState();
  const [cardSetId, setCardSetId] = useState();
  const [cards, setCards] = useState([]);
  const [editorOn, setEditorOn] = useState();
  const [editorOnFromCard, setEditorOnFromCard] = useState();
  const [cardId, setCardId] = useState("");
  const [selectedCardType, setSelectedCardType] = useState();

  const [face1_input1, set_face1_input1] = useState();
  const [face1_input2, set_face1_input2] = useState();
  const [face1_input3, set_face1_input3] = useState();
  const [face1_input4, set_face1_input4] = useState();
  const [face1_input5, set_face1_input5] = useState();

  const [face2_input1, set_face2_input1] = useState();
  const [face2_input2, set_face2_input2] = useState();
  const [face2_input3, set_face2_input3] = useState();
  const [face2_input4, set_face2_input4] = useState();
  const [face2_input5, set_face2_input5] = useState();

  const {
    loading,
    error,
    data: data1,
  } = useQuery(GetCardTypeSet, {
    variables: { mybook_id: book_id, index_id: first_index },
  });

  useEffect(() => {
    if (data1) {
      console.log("?????? ?????? data : ", data1);
      setCardTypeSetId(data1.cardtypeset_getbymybookid.cardtypesets[0]._id);
      setCardTypeSets(data1.cardtypeset_getbymybookid.cardtypesets);
      setCardTypes(data1.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
      setIndexId(data1.indexset_getbymybookid.indexsets[0].indexes[0]._id);
      setCardSetId(data1.cardset_getbyindexid.cardsets[0]._id);
      setCards(data1.cardset_getbyindexid.cardsets[0].cards);
    } else {
      console.log("why here?");
    }
  }, [data1, indexChanged, first_index]);

  // if (selectedCardType) {
  //   var selectedCardTypeOption = selectedCardType.name;
  // } else {
  //   selectedCardTypeOption = "default";
  // }

  const cardTypeInfo = (cardtype_info, from) => {
    setcardTypeInfos(cardtype_info);
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
          <div>?????? ????????? ?????? : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              ??????????????????
            </Option>
            {cardTypeListNormal}
          </Select>
        </div>
        <Editor nicks={nicks} onFinish={onFinish} setEditorOn={setEditorOn} cardtype_info={cardtype_info} />
      </>
    );

    const editorFromCard = (
      <>
        <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          <div>?????? ????????? ?????? : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              ??????????????????
            </Option>
            {cardTypeListInCard}
          </Select>
        </div>
        <EditorFromCard nicks={nicks} onFinish={onFinish} setEditorOnFromCard={setEditorOnFromCard} cardtype_info={cardtype_info} />
      </>
    );

    if (from === "normal") {
      console.log("??????????????? ???????????? ???????????????. ???????????? setCardId() ?????? ????????? ?????????.");
      console.log(cardId);
      setEditorOn(editor);
    } else if (from === "inCard") {
      setEditorOnFromCard(editorFromCard);
    }
  };

  const onFinish = (values, from) => {
    console.log(values);
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

    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, values.face1, values.face2);
  };

  const [cardset_addcard] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    setCards(data.cardset_addcard.cardsets[0].cards);
  }

  async function addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, face1_contents, face2_contents) {
    try {
      await cardset_addcard({
        variables: {
          forAddCard: {
            cardset_id: cardSetId,
            current_position_card_id: current_position_card_id,
            card_info: {
              mybook_id: mybook_id,
              cardtypeset_id: cardTypeSetId,
              cardtype_id,
              cardtype,
              hasParent: "no",
              parent_card_id: null,
            },
            contents: {
              user_flag: null,
              maker_flag: null,
              face1: face1_contents,
              selection: null,
              face2: face2_contents,
              annotation: null,
              memo: null,
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

  if (cards) {
    var contents = cards.map((content) => {
      if (content._id === cardId) {
        var borderLeft = "2px solid blue";
      } else {
        borderLeft = "none";
      }
      console.log("???????????? ??????", content);
      console.log("????????? ????????? ????????? ??????", cardTypeSets);

      const current_card_style = cardTypeSets[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
      console.log(current_card_style);

      const face_style = current_card_style[0].face_style;
      const row_style = current_card_style[0].row_style;
      const row_font = current_card_style[0].row_font;

      console.log(row_font);

      return (
        <>
          {content.card_info.cardtype === "read" && (
            <>
              <div style={{ marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  {/* ????????? ????????? ?????? */}
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
                              row_font.face1[index].font === "??????"
                                ? `Nanum Gothic, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Nanum Myeongjo, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face1[index].font === "??????"
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
                          ??????????????????
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
              <div style={{ marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  {/* ????????? ????????? ?????? */}
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
                              row_font.face1[index].font === "??????"
                                ? `Nanum Gothic, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Nanum Myeongjo, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face1[index].font === "??????"
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
                          ??????????????????
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
              <div style={{ marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  {/* ????????? ????????? ?????? */}
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
                              row_font.face1[index].font === "??????"
                                ? `Nanum Gothic, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Nanum Myeongjo, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face1[index].font === "??????"
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
                          ??????????????????
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
          {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "top-bottom" && (
            <>
              <div style={{ marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  {/* ?????????1 ????????? ?????? */}
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
                              row_font.face1[index].font === "??????"
                                ? `Nanum Gothic, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Nanum Myeongjo, sans-serif`
                                : row_font.face1[index].font === "??????"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face1[index].font === "??????"
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
                  {/* ?????????2 ????????? ?????? */}
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
                              row_font.face2[index].font === "??????"
                                ? `Nanum Gothic, sans-serif`
                                : row_font.face2[index].font === "??????"
                                ? `Nanum Myeongjo, sans-serif`
                                : row_font.face2[index].font === "??????"
                                ? `Gowun Batang, sans-serif`
                                : row_font.face2[index].font === "??????"
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
                {content._id === cardId && (
                  <>
                    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                      <div>
                        <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                          ????????????
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
          {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "left-right" && (
            <>
              <div style={{ marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  {/* ?????????1 ????????? ?????? */}
                  <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", width:"100%"}}>
                    <div
                      style={{
                        width:`${current_card_style[0].cardtype_info.flip_option.left_face_ratio}%`,
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
                                row_font.face1[index].font === "??????"
                                  ? `Nanum Gothic, sans-serif`
                                  : row_font.face1[index].font === "??????"
                                  ? `Nanum Myeongjo, sans-serif`
                                  : row_font.face1[index].font === "??????"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face1[index].font === "??????"
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
                    {/* ?????????2 ????????? ?????? */}
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
                                row_font.face2[index].font === "??????"
                                  ? `Nanum Gothic, sans-serif`
                                  : row_font.face2[index].font === "??????"
                                  ? `Nanum Myeongjo, sans-serif`
                                  : row_font.face2[index].font === "??????"
                                  ? `Gowun Batang, sans-serif`
                                  : row_font.face2[index].font === "??????"
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
                {content._id === cardId && (
                  <>
                    <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                      <div>
                        <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                          ????????????
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
        </>
      );
    });
  }
  const onClickCard = (card_id) => {
    console.log("cardClicked!!!!!");
    console.log("onClickCard", card_id);
    setCardId(card_id);
    setEditorOnFromCard("");
    setEditorOn("");
  };

  return (
    <>
      <Desktop>
        <div className="editor_panel" id="editor_panel" style={{ ...a4Page, position: "relative" }}>
          <FloatingMenu cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
          <div className="a4">
            {contents}
            <h1>selected index id : {first_index}</h1>
          </div>
          <div></div>
          <div>{editorOn}</div>
        </div>
      </Desktop>
      <Tablet>
        <div style={{ width: "90%", margin: "auto", marginBottom: "100px", marginTop: "50px" }}>
          <div>selected index id : {first_index}</div>
          <div>{contents}</div>
          <div>{editorOn}</div>
        </div>
        <FixedBottomMenu
          selectedCardType={selectedCardType}
          setSelectedCardType={setSelectedCardType}
          book_id={book_id}
          cardTypes={cardTypes}
          cardTypeInfo={cardTypeInfo}
          cardSetId={cardSetId}
          indexChanged={indexChanged}
          indexSetId={indexSetId}
          setEditorOnFromCard={setEditorOnFromCard}
          setCardId={setCardId}
        />
      </Tablet>
      <Mobile>
        <div style={{ width: "90%", margin: "auto", marginBottom: "100px" }}>
          <div>selected index id : {first_index}</div>
          <div>{contents}</div>
          <div>{editorOn}</div>
        </div>
        <FixedBottomMenu
          selectedCardType={selectedCardType}
          setSelectedCardType={setSelectedCardType}
          book_id={book_id}
          cardTypes={cardTypes}
          cardTypeInfo={cardTypeInfo}
          cardSetId={cardSetId}
          indexChanged={indexChanged}
          indexSetId={indexSetId}
          setEditorOnFromCard={setEditorOnFromCard}
          setCardId={setCardId}
        />
      </Mobile>
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

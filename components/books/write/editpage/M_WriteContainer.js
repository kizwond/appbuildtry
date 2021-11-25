import React, { useState, useEffect, useRef } from "react";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Button, Select, Space } from "antd";
import { AddCard, GET_CARD_CONTENT, GET_BUY_CARD_CONTENT } from "../../../../graphql/query/card_contents";
import { HeartFilled, StarFilled, CheckCircleFilled,PlusOutlined,ApartmentOutlined } from "@ant-design/icons";

const { Option } = Select;

const WriteContainer = ({ indexChanged, index_changed, indexSetId, book_id, Editor, EditorFromCard, FroalaEditorView }) => {
  const myRef = useRef(null); //스크롤
  // const executeScroll = () => myRef.current.scrollTo({
  //   top: 500,
  //   behavior: 'smooth'
  // });//스크롤
  const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" }); //스크롤
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
  const [contentsList, setContentsList] = useState([]);
  const [editorOn, setEditorOn] = useState();
  const [editorOnFromCard, setEditorOnFromCard] = useState();
  const [cardId, setCardId] = useState("");
  const [selectedCardType, setSelectedCardType] = useState();
  const [indexList, setIndexList] = useState();
  const [makerFlagStyle, setMakerFlagStyle] = useState();

  const {
    loading,
    error,
    data: data1,
  } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_id, index_ids: first_index },
  });

  const [mycontent_getMycontentByMycontentIDs, { loading: loading2, error: error2, data }] = useLazyQuery(GET_CARD_CONTENT, { onCompleted: afterGetContent });
  const [buycontent_getBuycontentByBuycontentIDs, { loading: loading3, error: error3, data: buyContents }] = useLazyQuery(GET_BUY_CARD_CONTENT, {
    onCompleted: afterGetBuyContent,
  });

  function afterGetContent(data) {
    console.log(data);
    console.log(contentsList);
    const newArray = contentsList.concat(data.mycontent_getMycontentByMycontentIDs.mycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    console.log(uniq);
    setContentsList(uniq);
  }

  function afterGetBuyContent(data) {
    console.log(data);
    console.log(contentsList);
    const newArray = contentsList.concat(data.buycontent_getBuycontentByBuycontentIDs.buycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    console.log(uniq);
    setContentsList(uniq);
  }

  useEffect(() => {
    if (data1) {
      console.log("최초 로드 data : ", data1);
      setIndexList(data1.indexset_getByMybookids.indexsets[0].indexes);
      setCardTypeSetId(data1.cardtypeset_getbymybookids.cardtypesets[0]._id);
      setCardTypeSets(data1.cardtypeset_getbymybookids.cardtypesets);
      setCardTypes(data1.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
      setMakerFlagStyle(data1.cardtypeset_getbymybookids.cardtypesets[0].makerFlag_style);
      setCardSetId(data1.cardset_getByIndexIDs.cardsets[0]._id);
      setCards(data1.cardset_getByIndexIDs.cardsets[0].cards);
      const cardIdList = data1.cardset_getByIndexIDs.cardsets[0].cards.map((item) => {
        return item.content.mycontent_id;
      });
      const buyContentsIdsList = data1.cardset_getByIndexIDs.cardsets[0].cards.map((item) => {
        return item.content.buycontent_id;
      });
      // const myBuyTotal = cardIdList.concat(buyContentsIdsList);
      // console.log(myBuyTotal);
      console.log(buyContentsIdsList);
      console.log(cardIdList);
      // let temp = [];
      // for (let i of myBuyTotal) i && temp.push(i);
      // let arr = temp;
      // console.log(arr)
      mycontent_getMycontentByMycontentIDs({
        variables: {
          mycontent_ids: cardIdList,
        },
      });

      buycontent_getBuycontentByBuycontentIDs({
        variables: {
          buycontent_ids: buyContentsIdsList,
        },
      });
    } else {
      console.log("why here?");
    }
  }, [data1, indexChanged, first_index, mycontent_getMycontentByMycontentIDs, buycontent_getBuycontentByBuycontentIDs]);

  const cardTypeInfo = (cardtype_info, from, parentId, generalCardId) => {
    console.log("generalCardId", generalCardId);
    console.log(cardId);
    if (generalCardId) {
      const childs = cards.filter((item) => {
        if (item.card_info.parentCard_id === generalCardId) {
          return item;
        }
      });
      console.log("===========>", childs);
      let lastElement = childs[childs.length - 1];
      console.log(lastElement);
      if (lastElement !== undefined) {
        setCardId(lastElement._id);
      }
    }

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
          <Select size="small" defaultValue={cardtype_info.name} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              카드타입선택
            </Option>
            {!parentId && cardTypeListInCard}
            {parentId && cardTypeListInCardChild}
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
      // executeScroll(); //스크롤
    } else if (from === "inCard") {
      console.log("inCard");
      setEditorOnFromCard(editorFromCard);
    }
  };

  useEffect(() => {
    if (editorOn) {
      executeScroll();
    }
  }, [executeScroll, editorOn]);

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

    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, values.face1, values.face2, values.annotation, values.flagStar, values.flagComment);
  };

  const [cardset_addcardAtSameIndex] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    setCards(data.cardset_addcardAtSameIndex.cardsets[0].cards);
    sessionStorage.removeItem("parentId");
    const cardIdList = data.cardset_addcardAtSameIndex.cardsets[0].cards.map((item) => {
      return item.content.mycontent_id;
    });
    console.log(cardIdList);
    mycontent_getMycontentByMycontentIDs({
      variables: {
        mycontent_ids: cardIdList,
      },
    });
  }

  async function addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, face1_contents, face2_contents, annotation_contents, flagStar, flagComment) {
    const parentId = sessionStorage.getItem("parentId");
    console.log("부모카드아이디", parentId);
    if (parentId === null) {
      var hasParent = "no";
    } else {
      hasParent = "yes";
    }
    try {
      await cardset_addcardAtSameIndex({
        variables: {
          forAddcardAtSameIndex: {
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
            content: {
              // user_flag: null,
              // maker_flag: null,
              face1: face1_contents,
              selection: null,
              face2: face2_contents,
              annotation: annotation_contents,
              // memo: null,
            },
            makerFlag: {
              value: Number(flagStar),
              comment: flagComment,
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
    var cardTypeListInCardChild = cardTypes.map((cardType) => {
      if (cardType.cardtype_info.cardtype === "flip") {
        return (
          <>
            <Option value={[cardType.cardtype_info.name, "inCard"]} style={{ fontSize: "0.8rem" }}>
              {cardType.cardtype_info.name}
            </Option>
          </>
        );
      }
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

  function onClickCardAdd(from, generalCardId) {
    setEditorOn("");
    if (selectedCardType === undefined) {
      setSelectedCardType(cardTypes[0].cardtype_info);
      cardTypeInfo(cardTypes[0].cardtype_info, "inCard", null, generalCardId);
      sessionStorage.setItem("cardtype", cardTypes[0].cardtype_info.cardtype);
    } else {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === selectedCardType.name);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, "inCard", null, generalCardId);
    }
  }

  function onClickCardAddChild(from, parentId, typeName) {
    console.log(parentId);
    sessionStorage.setItem("parentId", parentId);
    setEditorOn("");
    if (from === "child") {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === typeName);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
      cardTypeInfo(hello[0].cardtype_info, "inCard", parentId);
    } else if (from === "general") {
      const hello = cardTypes.filter((item) => item.cardtype_info.cardtype === "flip");
      console.log(hello);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
      cardTypeInfo(hello[0].cardtype_info, "inCard", parentId);
    }
  }

  if (cards) {
    var contents = cards.map((content) => {
      // console.log("카드에 스타일 입히기 시작", cardTypeSets);

      const current_card_style = cardTypeSets[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
      console.log(current_card_style);

      const face_style = current_card_style[0].face_style;
      const row_style = current_card_style[0].row_style;
      const row_font = current_card_style[0].row_font;

      // console.log(row_font);
      // console.log(content);
      // console.log(contentsList);
      const show_contents = contentsList.map((content_value) => {
        if (content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) {
          // console.log(content_value._id, content.content.buycontent_id);
          if (content_value._id === cardId) {
            var borderLeft = "2px solid blue";
          } else {
            borderLeft = "none";
          }
          console.log("해당카드 정보", content);
          console.log("해당컨텐츠 정보", content_value);

          const figure_shape = makerFlagStyle.figure_style.shape;
          const figure_size = makerFlagStyle.figure_style.size;
          const figure_color = makerFlagStyle.figure_style.color;

          const comment_font_bold = makerFlagStyle.comment_font.bold;
          const comment_font_color = makerFlagStyle.comment_font.color;
          const comment_font_font = makerFlagStyle.comment_font.font;
          const comment_font_italic = makerFlagStyle.comment_font.italic;
          const comment_font_size = makerFlagStyle.comment_font.size;
          const comment_font_underline = makerFlagStyle.comment_font.underline;

          const star_shape = <StarFilled style={{ color: figure_color }} />;
          const heart_shape = <HeartFilled style={{ color: figure_color }} />;
          const circle_shape = <CheckCircleFilled style={{ color: figure_color }} />;
          if (content.content.makerFlag.value === 1) {
            if (figure_shape === "star") {
              var ratings = star_shape;
            } else if (figure_shape === "heart") {
              var ratings = heart_shape;
            } else if (figure_shape === "circle") {
              var ratings = circle_shape;
            }
          } else if (content.content.makerFlag.value === 2) {
            if (figure_shape === "star") {
              var ratings = (
                <>
                  {star_shape}
                  {star_shape}
                </>
              );
            } else if (figure_shape === "heart") {
              var ratings = (
                <>
                  {heart_shape}
                  {heart_shape}
                </>
              );
            } else if (figure_shape === "circle") {
              var ratings = (
                <>
                  {circle_shape}
                  {circle_shape}
                </>
              );
            }
          } else if (content.content.makerFlag.value === 3) {
            if (figure_shape === "star") {
              var ratings = (
                <>
                  {star_shape}
                  {star_shape}
                  {star_shape}
                </>
              );
            } else if (figure_shape === "heart") {
              var ratings = (
                <>
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                </>
              );
            } else if (figure_shape === "circle") {
              var ratings = (
                <>
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                </>
              );
            }
          } else if (content.content.makerFlag.value === 4) {
            if (figure_shape === "star") {
              var ratings = (
                <>
                  {star_shape}
                  {star_shape}
                  {star_shape}
                  {star_shape}
                </>
              );
            } else if (figure_shape === "heart") {
              var ratings = (
                <>
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                </>
              );
            } else if (figure_shape === "circle") {
              var ratings = (
                <>
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                </>
              );
            }
          } else if (content.content.makerFlag.value === 5) {
            if (figure_shape === "star") {
              var ratings = (
                <>
                  {star_shape}
                  {star_shape}
                  {star_shape}
                  {star_shape}
                  {star_shape}
                </>
              );
            } else if (figure_shape === "heart") {
              var ratings = (
                <>
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                  {heart_shape}
                </>
              );
            } else if (figure_shape === "circle") {
              var ratings = (
                <>
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                  {circle_shape}
                </>
              );
            }
          } else {
            var ratings = <></>;
          }

          if (content.content.makerFlag.comment) {
            var comment = content.content.makerFlag.comment;
          } else {
            comment = "";
          }

          const flagArea = (
            <>
              <div
                style={{
                  display: "inline-flex",
                  backgroundColor: makerFlagStyle.row_style.background.color,
                  marginTop: makerFlagStyle.row_style.outer_margin.top,
                  marginBottom: makerFlagStyle.row_style.outer_margin.bottom,
                  marginLeft: makerFlagStyle.row_style.outer_margin.left,
                  marginRight: makerFlagStyle.row_style.outer_margin.right,
                  paddingTop: makerFlagStyle.row_style.inner_padding.top,
                  paddingBottom: makerFlagStyle.row_style.inner_padding.bottom,
                  paddingLeft: makerFlagStyle.row_style.inner_padding.left,
                  paddingRight: makerFlagStyle.row_style.inner_padding.right,
                  borderTop: `${makerFlagStyle.row_style.border.top.thickness}px ${makerFlagStyle.row_style.border.top.bordertype} ${makerFlagStyle.row_style.border.top.color}`,
                  borderBottom: `${makerFlagStyle.row_style.border.bottom.thickness}px ${makerFlagStyle.row_style.border.bottom.bordertype} ${makerFlagStyle.row_style.border.bottom.color}`,
                  borderLeft: `${makerFlagStyle.row_style.border.left.thickness}px ${makerFlagStyle.row_style.border.left.bordertype} ${makerFlagStyle.row_style.border.left.color}`,
                  borderRight: `${makerFlagStyle.row_style.border.right.thickness}px ${makerFlagStyle.row_style.border.right.bordertype} ${makerFlagStyle.row_style.border.right.color}`,
                }}
              >
                <span style={{ display: "inline-block", marginRight: "5px", fontSize: `${figure_size}px` }}>{ratings}</span>
                <span
                  style={{
                    color: comment_font_color,
                    fontFamily: `${
                      comment_font_font === "고딕"
                        ? `NanumGothic`
                        : comment_font_font === "명조"
                        ? `NanumMyeongjo`
                        : comment_font_font === "바탕"
                        ? `Gowun Batang, sans-serif`
                        : comment_font_font === "돋움"
                        ? `Gowun Dodum, sans-serif`
                        : ""
                    } `,
                    fontStyle: `${comment_font_italic === "on" ? "italic" : "normal"}`,
                    fontSize: `${comment_font_size}px`,
                    textDecoration: `${comment_font_underline === "on" ? "underline" : "none"}`,
                    fontWeight: `${comment_font_bold === "on" ? 700 : 400}`,
                  }}
                >
                  {comment}
                </span>
              </div>
            </>
          );

          return (
            <>
              {content.card_info.cardtype === "read" && (
                <>
                  <div className={`${content._id} other`} style={{ marginBottom: "5px", boxShadow: "0px 0px 6px -5px #5E5E5E" }}>
                    <div onClick={() => onClickCard(content._id, "normal")}>
                      {/* 페이스 스타일 영역 */}
                      {content.content.makerFlag.value !== null && flagArea}
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
                          {content_value.face1.map((item, index) => (
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
                          {content_value.annotation.length > 0 &&
                            content_value.annotation.map((item, index) => (
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
                        <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                          <div>
                          <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  다음카드
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
                  <div className={`${content._id} other`} style={{ marginBottom: "5px", boxShadow: "0px 0px 6px -5px #5E5E5E" }}>
                    <div onClick={() => onClickCard(content._id, "normal")}>
                      {/* 페이스 스타일 영역 */}
                      {content.content.makerFlag.value !== null && flagArea}
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
                        {content_value.face1.map((item, index) => (
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
                        <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                          <div>
                            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  다음카드
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
                  <div className={`${content._id} child_group other`} style={{ boxShadow: "0px 0px 6px -5px #5E5E5E" }}>
                    <div style={{ marginBottom: "5px" }}>
                      <div onClick={() => onClickCard(content._id, "general")}>
                        {/* 페이스 스타일 영역 */}
                        {content.content.makerFlag.value !== null && flagArea}
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
                          {content_value.face1.map((item, index) => (
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
                          <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                            <Space>
                              <div>
                                <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => onClickCardAdd("general", content._id)} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  다음카드
                                </Button>
                              </div>
                              <div>
                                <Button icon={<ApartmentOutlined />} size="small"  type="primary" onClick={() => onClickCardAddChild("general", content._id)} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  자식카드
                                </Button>
                              </div>
                            </Space>
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
                  <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`} style={{ boxShadow: "0px 0px 6px -5px #5E5E5E" }}>
                    <div style={{ marginBottom: "0px" }}>
                      <div
                        onClick={() => onClickCard(content._id, "flip", content.card_info.parentCard_id)}
                        // style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}` }}
                      >
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
                          {/* 페이스1 스타일 영역 */}
                          {content.content.makerFlag.value !== null && flagArea}
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
                            {content_value.face1.map((item, index) => (
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
                              backgroundColor: face_style[2].background.color,
                              marginTop: face_style[2].outer_margin.top,
                              marginBottom: face_style[2].outer_margin.bottom,
                              marginLeft: face_style[2].outer_margin.left,
                              marginRight: face_style[2].outer_margin.right,
                              paddingTop: face_style[2].inner_padding.top,
                              paddingBottom: face_style[2].inner_padding.bottom,
                              paddingLeft: face_style[2].inner_padding.left,
                              paddingRight: face_style[2].inner_padding.right,
                              borderTop: `${face_style[2].border.top.thickness}px ${face_style[2].border.top.bordertype} ${face_style[2].border.top.color}`,
                              borderBottom: `${face_style[2].border.bottom.thickness}px ${face_style[2].border.bottom.bordertype} ${face_style[2].border.bottom.color}`,
                              borderLeft: `${face_style[2].border.left.thickness}px ${face_style[2].border.left.bordertype} ${face_style[2].border.left.color}`,
                              borderRight: `${face_style[2].border.right.thickness}px ${face_style[2].border.right.bordertype} ${face_style[2].border.right.color}`,
                            }}
                          >
                            {content_value.face2.map((item, index) => (
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
                          <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                            <div>
                              <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  다음카드
                                </Button>
                            </div>
                          </div>
                        </>
                      )}
                      {content._id === cardId && content.card_info.hasParent === "yes" && (
                        <>
                          <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                            <div>
                   
                              <Button icon={<ApartmentOutlined />} size="small"  type="primary" onClick={() => onClickCardAddChild("child", content.card_info.parentCard_id, current_card_style[0].cardtype_info.name)} style={{ fontSize: "0.75rem", borderRadius:"5px" }}>
                                  자식카드
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
                  <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`} style={{ boxShadow: "0px 0px 6px -5px #5E5E5E" }}>
                    <div style={{ marginBottom: "0px" }}>
                      <div
                        onClick={() => onClickCard(content._id, "flip", content.card_info.parentCard_id)}
                        // style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}` }}
                      >
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
                          {/* 페이스1 스타일 영역 */}
                          {content.content.makerFlag.value !== null && flagArea}
                          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "100%" }}>
                            <div
                              style={{
                                width: `${current_card_style[0].cardtype_info.flip_option.left_face_ratio}%`,
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
                              {content_value.face1.map((item, index) => (
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
                                backgroundColor: face_style[2].background.color,
                                marginTop: face_style[2].outer_margin.top,
                                marginBottom: face_style[2].outer_margin.bottom,
                                marginLeft: face_style[2].outer_margin.left,
                                marginRight: face_style[2].outer_margin.right,
                                paddingTop: face_style[2].inner_padding.top,
                                paddingBottom: face_style[2].inner_padding.bottom,
                                paddingLeft: face_style[2].inner_padding.left,
                                paddingRight: face_style[2].inner_padding.right,
                                borderTop: `${face_style[2].border.top.thickness}px ${face_style[2].border.top.bordertype} ${face_style[2].border.top.color}`,
                                borderBottom: `${face_style[2].border.bottom.thickness}px ${face_style[2].border.bottom.bordertype} ${face_style[2].border.bottom.color}`,
                                borderLeft: `${face_style[2].border.left.thickness}px ${face_style[2].border.left.bordertype} ${face_style[2].border.left.color}`,
                                borderRight: `${face_style[2].border.right.thickness}px ${face_style[2].border.right.bordertype} ${face_style[2].border.right.color}`,
                              }}
                            >
                              {content_value.face2.map((item, index) => (
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
                            <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                              <div>
                                <Button size="small" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", border: "1px solid grey" }}>
                                  다음카드
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        {content._id === cardId && content.card_info.hasParent === "yes" && (
                          <>
                            <div style={{ padding: "5px 0 0 5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                              <div>
                                <Button
                                  size="small"
                                  onClick={() => onClickCardAddChild("child", content.card_info.parentCard_id, current_card_style[0].cardtype_info.name)}
                                  style={{ fontSize: "0.75rem", border: "1px solid grey" }}
                                >
                                  자식카드
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div style={{ height: "5px" }}></div>
                    </div>
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
        }
      });
      return show_contents;
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
        section2.style.borderLeft = "5px solid #4285f4";
        // section2.style.borderRadius = "4px";
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
        section2.style.borderLeft = "5px solid #4285f4";
        // section2.style.borderRadius = "4px";
      }
    } else if (from === "flip" && group === null) {
      console.log("flip1");
      const selected4 = document.getElementsByClassName(card_id);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var b = 0; b < selected4.length; b++) {
        const section4 = selected4.item(b);
        section4.style.borderLeft = "5px solid #4285f4";
        // section4.style.borderRadius = "4px";
      }
    } else if (from === "flip" && group === undefined) {
      console.log("flip2");
      const selected4 = document.getElementsByClassName(card_id);
      const selected2 = document.getElementsByClassName("other");
      for (var a = 0; a < selected2.length; a++) {
        const section1 = selected2.item(a);
        section1.style.borderLeft = "none";
      }
      for (var b = 0; b < selected4.length; b++) {
        const section4 = selected4.item(b);
        section4.style.borderLeft = "5px solid #4285f4";
        // section4.style.borderRadius = "4px";
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
        section3.style.borderLeft = "5px solid #4285f4";
        // section3.style.borderRadius = "4px";
      }
    }

    setCardId(card_id);
    setEditorOnFromCard("");
    setEditorOn("");
  };

  return (
    <>
      <div style={{ width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
        {/* <div>selected index id : {first_index}</div> */}
        <div>{contents}</div>
        <div>{editorOn}</div>
        <div ref={myRef} style={{ height: "50px" }}></div>
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
            index_changed={index_changed}
            indexSetId={indexSetId}
            indexList={indexList}
            setEditorOnFromCard={setEditorOnFromCard}
            setCardId={setCardId}
            cardTypeSets={cardTypeSets}
            cardTypeSetId={cardTypeSetId}
          />
        </>
      )}
    </>
  );
};

export default WriteContainer;

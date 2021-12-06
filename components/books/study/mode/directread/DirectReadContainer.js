import React, { useState, useEffect, useRef } from "react";
import { GetCardRelated } from "../../../../../graphql/query/allQuery";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Button, Select, Space } from "antd";
import { UpdateMyContents, AddCard, DeleteCard, GET_CARD_CONTENT, GET_BUY_CARD_CONTENT } from "../../../../../graphql/query/card_contents";
import { DeleteOutlined, EditOutlined, HeartFilled, StarFilled, CheckCircleFilled, PlusOutlined, ApartmentOutlined } from "@ant-design/icons";
import FixedBottomMenuDirectRead from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuDirectRead";
const { Option } = Select;

const DirectReadContainer = ({ FroalaEditorView, indexChanged, index_changed, indexSets }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = JSON.parse(sessionStorage.getItem("books_selected"));
    var book_ids = book_id.map((item) => item.book_id);
    console.log(book_ids);
    console.log(indexChanged);

    var first_index_tmp = localStorage.getItem("first_index");
    console.log(first_index_tmp);
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
      localStorage.removeItem("book_ids");
      localStorage.setItem("book_ids", book_ids);
    } else {
      localStorage.setItem("book_ids", book_ids);
    }
  }

  const [cardTypeSetId, setCardTypeSetId] = useState();
  const [cardTypeSets, setCardTypeSets] = useState();
  const [cardTypes, setCardTypes] = useState();
  const [cardSetId, setCardSetId] = useState();
  const [cards, setCards] = useState([]);
  const [contentsList, setContentsList] = useState([]);
  const [cardId, setCardId] = useState("");
  const [editMode, setEditMode] = useState("normal");
  const [indexList, setIndexList] = useState();
  const [makerFlagStyle, setMakerFlagStyle] = useState();

  const {
    loading,
    error,
    data: data1,
  } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_ids, index_ids: first_index },
  });

  const [mycontent_getMycontentByMycontentIDs, { loading: loading2, error: error2, data }] = useLazyQuery(GET_CARD_CONTENT, { onCompleted: afterGetContent });
  const [buycontent_getBuycontentByBuycontentIDs, { loading: loading3, error: error3, data: buyContents }] = useLazyQuery(GET_BUY_CARD_CONTENT, {
    onCompleted: afterGetBuyContent,
  });

  function afterGetContent(data) {
    console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(data.mycontent_getMycontentByMycontentIDs.mycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    // console.log(uniq);
    setContentsList(uniq);
  }

  function afterGetBuyContent(data) {
    // console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(data.buycontent_getBuycontentByBuycontentIDs.buycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    // console.log(uniq);
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
  }, [data1, mycontent_getMycontentByMycontentIDs, buycontent_getBuycontentByBuycontentIDs]);

  if (cards) {
    var contents = cards.map((content) => {
      // console.log("카드에 스타일 입히기 시작", cardTypeSets);

      const current_card_style = cardTypeSets[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
      // console.log(current_card_style);

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
          // console.log("해당카드 정보", content);
          // console.log("해당컨텐츠 정보", content_value);

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
                  <div className={`${content._id} other`} style={{ marginBottom: "5px" }}>
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
                  </div>
                </>
              )}
              {content.card_info.cardtype === "subject" && (
                <>
                  <div className={`${content._id} other`} style={{ marginBottom: "5px" }}>
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
                  </div>
                </>
              )}
              {content.card_info.cardtype === "general" && (
                <>
                  <div className={`${content._id} child_group other`}>
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
                    </div>
                    <div style={{ height: "5px" }}></div>
                  </div>
                </>
              )}
              {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "top-bottom" && (
                <>
                  <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`}>
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
                            {content_value.selection &&
                              content_value.selection.map((item, index) => (
                                <>
                                  <div
                                    style={{
                                      backgroundColor: row_style.face1[row_style.face1.length - 1].background.color,
                                      marginTop: row_style.face1[row_style.face1.length - 1].outer_margin.top,
                                      marginBottom: row_style.face1[row_style.face1.length - 1].outer_margin.bottom,
                                      marginLeft: row_style.face1[row_style.face1.length - 1].outer_margin.left,
                                      marginRight: row_style.face1[row_style.face1.length - 1].outer_margin.right,
                                      paddingTop: row_style.face1[row_style.face1.length - 1].inner_padding.top,
                                      paddingBottom: row_style.face1[row_style.face1.length - 1].inner_padding.bottom,
                                      paddingLeft: row_style.face1[row_style.face1.length - 1].inner_padding.left,
                                      paddingRight: row_style.face1[row_style.face1.length - 1].inner_padding.right,
                                      borderTop: `${row_style.face1[row_style.face1.length - 1].border.top.thickness}px ${
                                        row_style.face1[row_style.face1.length - 1].border.top.bordertype
                                      } ${row_style.face1[row_style.face1.length - 1].border.top.color}`,
                                      borderBottom: `${row_style.face1[row_style.face1.length - 1].border.bottom.thickness}px ${
                                        row_style.face1[row_style.face1.length - 1].border.bottom.bordertype
                                      } ${row_style.face1[row_style.face1.length - 1].border.bottom.color}`,
                                      borderLeft: `${row_style.face1[row_style.face1.length - 1].border.left.thickness}px ${
                                        row_style.face1[row_style.face1.length - 1].border.left.bordertype
                                      } ${row_style.face1[row_style.face1.length - 1].border.left.color}`,
                                      borderRight: `${row_style.face1[row_style.face1.length - 1].border.right.thickness}px ${
                                        row_style.face1[row_style.face1.length - 1].border.right.bordertype
                                      } ${row_style.face1[row_style.face1.length - 1].border.right.color}`,
                                      textAlign: row_font.face1[row_font.face1.length - 1].align,
                                      fontWeight: `${row_font.face1[row_font.face1.length - 1].bold === "on" ? 700 : 400}`,
                                      color: row_font.face1[row_font.face1.length - 1].color,
                                      fontFamily: `${
                                        row_font.face1[row_font.face1.length - 1].font === "고딕"
                                          ? `NanumGothic`
                                          : row_font.face1[row_font.face1.length - 1].font === "명조"
                                          ? `NanumMyeongjo`
                                          : row_font.face1[row_font.face1.length - 1].font === "바탕"
                                          ? `Gowun Batang, sans-serif`
                                          : row_font.face1[row_font.face1.length - 1].font === "돋움"
                                          ? `Gowun Dodum, sans-serif`
                                          : ""
                                      } `,
                                      fontSize: row_font.face1[row_font.face1.length - 1].size,
                                      textDecoration: `${row_font.face1[row_font.face1.length - 1].underline === "on" ? "underline" : "none"}`,
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
                    </div>
                    <div style={{ height: "5px" }}></div>
                  </div>
                </>
              )}
              {content.card_info.cardtype === "flip" && current_card_style[0].cardtype_info.flip_option.card_direction === "left-right" && (
                <>
                  <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`}>
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
                              {content_value.selection &&
                                content_value.selection.map((item, index) => (
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
                      </div>
                      <div style={{ height: "5px" }}></div>
                    </div>
                  </div>
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
    setEditMode("normal");
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
  };

  return (
    <>
      <div>{contents}</div>
      {data1 && (
        <>
          <FixedBottomMenuDirectRead book_ids={book_ids} index_changed={index_changed} indexSets={indexSets} />
        </>
      )}
    </>
  );
};

export default DirectReadContainer;

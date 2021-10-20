import React, { useState, useEffect, useCallback } from "react";
import { GetCardTypeSet, CardTypeCreate } from "../../../../graphql/query/cardtype";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FloatingMenu from "./sidemenu/FloatingMenu";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Input, message, Button, Select } from "antd";
import { AddCard, GetCardSet } from "../../../../graphql/query/card_contents";

import axios from "axios";

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
      setCardTypeSetId(data1.cardtypeset_getbymybookid.cardtypesets[0]._id);
      setCardTypes(data1.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
      setIndexId(data1.indexset_getbymybookid.indexsets[0].indexes[0]._id);
      setCardSetId(data1.cardset_getbyindexid.cardsets[0]._id);
      setCards(data1.cardset_getbyindexid.cardsets[0].cards);
    } else {
      console.log("why here?");
    }
  }, [data1, indexChanged, first_index]);

  if (selectedCardType) {
    var selectedCardTypeOption = selectedCardType.name;
  } else {
    selectedCardTypeOption = "default";
  }

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
          <div>카드 템플릿 선택 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{fontSize:"0.8rem", color:"black", fontWeight:"700"}} disabled>카드타입선택</Option>
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
          <div>카드 템플릿 선택 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{fontSize:"0.8rem", color:"black", fontWeight:"700"}} disabled>카드타입선택</Option>
            {cardTypeListInCard}
          </Select>
        </div>
        <EditorFromCard nicks={nicks} onFinish={onFinish} setEditorOnFromCard={setEditorOnFromCard} cardtype_info={cardtype_info} />
      </>
    );

    if (from === "normal") {
      console.log("노멀모드로 에디터가 뿌려질것임. 여기다가 setCardId() 이걸 했는데 안먹음.")
      console.log(cardId)
      setEditorOn(editor);
    } else if (from === "inCard") {
      setEditorOnFromCard(editorFromCard);
    }
  };

  const onFinish = (values, from) => {
    console.log(values);
    const mybook_id = localStorage.getItem("book_id");
    const cardtype = sessionStorage.getItem("cardtype");
    console.log("??????????????????????", cardId)
    if (from === "inCard") {
      var current_position_card_id = cardId;
      console.log("should have cardid", cardId)
    } else {
      current_position_card_id = null;
      console.log("should be null", cardId)
    }
    const cardtype_id = cardTypes[0]._id;
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
          <Option value={[cardType.cardtype_info.name, "normal"]} style={{fontSize:"0.8rem"}}>{cardType.cardtype_info.name}</Option>
        </>
      );
    });
    var cardTypeListInCard = cardTypes.map((cardType) => {
      return (
        <>
          <Option value={[cardType.cardtype_info.name, "inCard"]} style={{fontSize:"0.8rem"}}>{cardType.cardtype_info.name}</Option>
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
        borderLeft = "1px solid lightgrey";
      }
      return (
        <>
          {content.card_info.cardtype === "read" && (
            <>
              <div style={{ border: "1px solid lightgrey", marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  <div>
                    {content.contents.mycontents_id.face1.map((item) => (
                      <>
                        <div>
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

          {content.card_info.cardtype === "flip" && (
            <>
              <div style={{ border: "1px solid lightgrey", marginBottom: "5px", borderLeft: borderLeft }}>
                <div onClick={() => onClickCard(content._id)}>
                  <div>
                    {content.contents.mycontents_id.face1.map((item) => (
                      <>
                        <div>
                          <FroalaEditorView model={item} />
                        </div>
                      </>
                    ))}
                    {content.contents.mycontents_id.face2.map((item) => (
                      <>
                        <div>
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
                          카드추가
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
    console.log("onClickCard",card_id);
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

import React, { useState, useEffect, useCallback } from "react";
import { GetCardTypeSet, CardTypeCreate } from "../../../../graphql/query/cardtype";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FloatingMenu from "./sidemenu/FloatingMenu";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Input, message, Button, Select } from "antd";
import { AddCard, GetCardSet } from "../../../../graphql/query/card_contents";
// import Editor from "./Editor";
// import EditorFromCard from "./EditorFromCard";
import axios from "axios";
// import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import { useMediaQuery } from "react-responsive";

// import dynamic from 'next/dynamic';

// const Editor = dynamic(() => import('./Editor'), {
//   ssr: false
// });

// const EditorFromCard = dynamic(() => import('./EditorFromCard'), {
//   ssr: false
// });
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

    console.log(book_id);
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
  const [cardId, setCardId] = useState();
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
    console.log("카드타입셋을 불러옴", first_index);
    if (data1) {
      console.log("--->", data1);
      setCardTypeSetId(data1.cardtypeset_getbymybookid.cardtypesets[0]._id);
      setCardTypes(data1.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
      setIndexId(data1.indexset_getbymybookid.indexsets[0].indexes[0]._id);
      setCardSetId(data1.cardset_getbyindexid.cardsets[0]._id);
      setCards(data1.cardset_getbyindexid.cardsets[0].cards);
    } else {
      console.log("why here?");
    }
  }, [data1, indexChanged, first_index]);

  const cardTypeInfo = (cardtype_info, from) => {
    setcardTypeInfos(cardtype_info);
    console.log(cardtype_info);
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
    const editor = (
      <>
      <div>여기다가 카드타입 셀렉션</div>
        <Editor nicks={nicks} onFinish={onFinish} setEditorOn={setEditorOn} cardtype_info={cardtype_info} />
      </>
    );

    const editorFromCard = (
      <>
      <div>여기다가 카드타입 셀렉션</div>
        <EditorFromCard nicks={nicks} onFinish={onFinish} setEditorOnFromCard={setEditorOnFromCard} cardtype_info={cardtype_info} />
      </>
    );

    // const editor = (
    //   <>
    //     {face1Editor}
    //     {face2.length > 0 && face2Editor}
    //   </>
    // );
    if (from === "normal") {
      setEditorOn(editor);
    } else if (from === "inCard") {
      setEditorOnFromCard(editorFromCard);
    }
  };

  const onFinish = (values) => {
    console.log(values);
    const mybook_id = localStorage.getItem("book_id");
    const cardtype = sessionStorage.getItem("cardtype");

    // const face1_contents_temp = [];
    // for (var i = 0; i < 5; i++) {
    //   face1_contents_temp.push(values[`face1_input${i}`]);
    // }
    // var face1_contents = face1_contents_temp.filter(function (el) {
    //   return el != null;
    // });

    // const face2_contents_temp = [];
    // for (var i = 0; i < 5; i++) {
    //   face2_contents_temp.push(values[`face2_input${i}`]);
    // }
    // var face2_contents = face2_contents_temp.filter(function (el) {
    //   return el != null;
    // });
    if (cardId) {
      var current_position_card_id = cardId;
    } else {
      current_position_card_id = null;
    }
    console.log(cardTypeInfos);
    // const cardtype = cardTypeInfos.cardtype;
    const cardtype_id = cardTypes[0]._id;
    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, values.face1, values.face2);
  };

  const [cardset_addcard] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    console.log("data", data);
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
    var cardTypeList = cardTypes.map((cardType) => {
      return (
        <>
          <Option value={cardType.cardtype_info.name}>{cardType.cardtype_info.name}</Option>
        </>
      );
    });
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
    if(value !== "default"){
      const hello = cardTypes.filter((item) => item.cardtype_info.name === value);
      console.log(hello);
      setSelectedCardType(hello[0].cardtype_info);
    }
  }

  const warning = () => {
    message.warning({ content: '카드타입을 선택해 주세요',  duration: 0.7 });
  };

  function onClickCardAdd() {
    if(selectedCardType === undefined){
      warning()
    } else {
      console.log("----------------------", selectedCardType);
      cardTypeInfo(selectedCardType, "inCard");
    }
  }
  if (selectedCardType) {
    console.log(selectedCardType);
    var selectedCardTypeOption = selectedCardType.name;
  } else {
    selectedCardTypeOption = "default";
  }

  if (cards) {
    console.log("????????????????????????????????????????????????????????");
    console.log(cards);
    console.log(first_index);
    var contents = cards.map((content) => {
      if(content._id === cardId){
        var borderLeft = "2px solid blue"
      } else {
        borderLeft = "1px solid lightgrey"
      }
      return (
        <>
          {content.card_info.cardtype === "read" && (
            <>
              <div style={{ border: "1px solid lightgrey", marginBottom: "5px", borderLeft : borderLeft }}>
                <div onClick={() => onClickCard(content._id)} >
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
                      <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 100, fontSize: "0.75rem" }} onChange={handleChange}>
                        <Option value="default">카드타입선택</Option>
                        {cardTypeList}
                      </Select>
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

          {content.card_info.cardtype === "flip" && (
            <>
             <div style={{ border: "1px solid lightgrey", marginBottom: "5px", borderLeft : borderLeft  }}>
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
                    <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 100, fontSize: "0.75rem" }} onChange={handleChange}>
                      <Option value="default">카드타입선택</Option>
                      {cardTypeList}
                    </Select>
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
    console.log(card_id);
    setCardId(card_id);
    setEditorOnFromCard("");
    setEditorOn("");
  };

  const onClickTest = () => {
    console.log("click");
    axios
      .post("/api/cardset/imageUpload", {
        test: "hello",
      })
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleReload = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleReload);

    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, []);

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
          <button onClick={onClickTest}>test</button>
        </div>
      </Desktop>
      <Tablet>
        <div style={{ width: "90%", margin: "auto", marginBottom: "100px", marginTop: "50px" }}>
          <div>selected index id : {first_index}</div>
          <div>{contents}</div>
          <div>{editorOn}</div>
        </div>
        <FixedBottomMenu book_id={book_id} cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
      </Tablet>
      <Mobile>
        <div style={{ width: "90%", margin: "auto", marginBottom: "100px" }}>
          <div>selected index id : {first_index}</div>
          <div>{contents}</div>
          <div>{editorOn}</div>
        </div>
        <FixedBottomMenu book_id={book_id} cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
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

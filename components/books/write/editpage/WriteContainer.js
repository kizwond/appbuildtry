import React, { useState, useEffect, useCallback } from "react";
import { GetCardTypeSet, CardTypeCreate } from "../../../../graphql/query/cardtype";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FloatingMenu from "./sidemenu/FloatingMenu";
import { Input, Form, Button } from "antd";
import { AddCard, GetCardSet } from "../../../../graphql/query/card_contents";
import Editor from "./Editor";
import axios from 'axios'
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

const WriteContainer = ({ indexChanged, indexSetId }) => {
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
  const [cards, setCards] = useState();
  const [editorOn, setEditorOn] = useState();
  const [cardId, setCardId] = useState();

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


  
  const cardTypeInfo = (cardtype_info) => {
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

    const nicks = []
    const face1 = [];
    const face1Nick = [];
    for (var i = 0; i < num_face1; i++) {
      face1.push(i);
      face1Nick.push(nick_face1[i]);
      nicks.push(nick_face1[i])
    }

    const face2 = [];
    const face2Nick = [];
    for (var i = 0; i < num_face2; i++) {
      face2.push(i);
      face2Nick.push(nick_face2[i]);
      nicks.push(nick_face2[i])
    }
    const editor = (
      <>
        <Editor nicks={nicks} onFinish={onFinish} cardtype_info={cardtype_info}/>
      </>
    );

    // const editor = (
    //   <>
    //     {face1Editor}
    //     {face2.length > 0 && face2Editor}
    //   </>
    // );
    
      setEditorOn(editor);
    
  };

  const onFinish = (values) => {
    console.log(values);
    const mybook_id = localStorage.getItem("book_id");
    const cardtype = sessionStorage.getItem("cardtype")

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
    console.log(cardTypeInfos)
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
  if (cards) {
    var contents = cards.map((content) => {
      return (
        <>
          {content.card_info.cardtype === "read" && (
            <div onClick={() => onClickCard(content._id)} style={{ border: "1px solid grey", marginBottom: "5px" }}>
              <div>
                {content.contents.mycontents_id.face1.map((item) => (
                  <>
                    <div><FroalaEditorView model={item} /></div>
                  </>
                ))}
              </div>
            </div>
          )}

          {content.card_info.cardtype === "flip" && (
            <div onClick={() => onClickCard(content._id)} style={{ border: "1px solid grey", marginBottom: "5px" }}>
              <div>
                {content.contents.mycontents_id.face1.map((item) => (
                  <>
                    <div><FroalaEditorView model={item} /></div>
                  </>
                ))}
                {content.contents.mycontents_id.face2.map((item) => (
                  <>
                    <div><FroalaEditorView model={item} /></div>
                  </>
                ))}
              </div>
            </div>
          )}
        </>
      );
    });
  }
  const onClickCard = (card_id) => {
    console.log("cardClicked!!!!!");
    console.log(card_id);
    setCardId(card_id);
  };

  const onClickTest = () => {
    console.log("click")
    axios.post('/api/cardset/imageUpload', {
      test:"hello"
    })
    .then(res => {
      console.log(res)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  return (
    <div className="editor_panel" id="editor_panel" style={{ ...a4Page, position: "relative" }}>
      <FloatingMenu cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
      <div className="a4">
        {contents}
        <h1>selected index id : {first_index}</h1>
        <div>1. 우측 카드추가 부분에 cardTypeSet를 query해서 뿌려주고</div>
        <div>2. 카드타입 클릭시 해당 카드타입 설정에 따라 input창을 여기다가 뿌려주고</div>
        <div>3. form submit시 mutation 해서 저장해주고.</div>
        <div>4. mutation후 response data를 상태값으로 넣어서 위에다가 차례로 추가해주고.</div>
        <div>5. 촤측 목차 클릭시 해당 하는 카드들만 불러서 뿌려주고</div>
      </div>
      <div></div>
      <div>{editorOn}</div>
      <button onClick={onClickTest}>test</button>
    </div>
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

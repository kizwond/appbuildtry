import React, { useState, useEffect, useCallback } from "react";
import { GetCardTypeSet, CardTypeCreate } from "../../../../graphql/query/cardtype";
import { useMutation, useQuery, useLazyQuery  } from "@apollo/client";
import FloatingMenu from "./sidemenu/FloatingMenu";
import { Input, Form, Button } from "antd";
import { AddCard, GetCardSet } from "../../../../graphql/query/card_contents";

const WriteContainer = () => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
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
  const [editorOn, setEditorOn] = useState();

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

  const { loading, error, data:data1 } = useQuery(GetCardTypeSet, {
    variables: { mybook_id: book_id },
  });
  
  useEffect(() => {
    console.log("카드타입셋을 불러옴");
    if (data1) {
      console.log("--->", data1);
      setCardTypeSetId(data1.cardtypeset_getbymybookid.cardtypesets[0]._id);
      setCardTypes(data1.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
      setIndexId(data1.indexset_getbymybookid.indexsets[0].indexes[0]._id)
    } else {
      console.log("why here?");
    }
  }, [data1]);

  const [cardset_getbyindexid, { data:data2 }] = useLazyQuery(GetCardSet);

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

    const face1 = [];
    const face1Nick = [];
    for (var i = 0; i < num_face1; i++) {
      face1.push(i);
      face1Nick.push(nick_face1[i]);
    }

    const face2 = [];
    const face2Nick = [];
    for (var i = 0; i < num_face2; i++) {
      face2.push(i);
      face2Nick.push(nick_face2[i]);
    }
    const face1Editor = face1.map((item, index) => {
      return (
        <>
          {face1Nick[index]}
          <Form.Item name={[`face1_input${index}`]} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      );
    });
    const face2Editor = face2.map((item, index) => (
      <>
        {face2Nick[index]}
        <Form.Item name={[`face2_input${index}`]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
      </>
    ));
    const editor = (
      <>
        {face1Editor}
        {face2Editor}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            완료
          </Button>
        </Form.Item>
      </>
    );
    setEditorOn(editor);
  };

  const onFinish = (values) => {
    console.log(values);
    // addcard(values)
  };

  const [cardset_addcard] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    console.log("data", data);
  }

  async function addcard(values) {
    try {
      await cardset_addcard({
        variables: {
          forAddCard: {
            cardset_id: ID,
            current_position_card_id: ID,
            card_info: {
              cardtypeset_id,
              cardtype_id,
              cardtype,
              hasParent,
              parent_card_id,
            },
            contents: {
              user_flag: values.bbbbb,
              maker_flag: values.bbbbb,
              face1: values.bbbbb,
              selection: values.bbbbb,
              face2: values.bbbbb,
              annotation: values.bbbbb,
              memo: values.bbbbb,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="editor_panel" id="editor_panel" style={{ ...a4Page, position: "relative" }}>
      <FloatingMenu cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} />
      <div className="a4">
        <div>1. 우측 카드추가 부분에 cardTypeSet를 query해서 뿌려주고</div>
        <div>2. 카드타입 클릭시 해당 카드타입 설정에 따라 input창을 여기다가 뿌려주고</div>
        <div>3. form submit시 mutation 해서 저장해주고.</div>
        <div>4. mutation후 response data를 상태값으로 넣어서 위에다가 차례로 추가해주고.</div>
        <div>5. 촤측 목차 클릭시 해당 하는 카드들만 불러서 뿌려주고</div>
      </div>
      <div></div>
      <div>
        <Form size="small" onFinish={onFinish}>
          {editorOn}
        </Form>
      </div>
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

import React, { useState, useEffect, useRef } from "react";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import FixedBottomMenu from "./sidemenu/FixedBottomMenu";
import { Button, Select, Space, notification } from "antd";
import { AddPolly, UpdateMyContents, AddCard, DeleteCard, GET_CARD_CONTENT, GET_BUY_CARD_CONTENT, UpdateMakerFlag } from "../../../../graphql/query/card_contents";
import { DeleteOutlined, EditOutlined, HeartFilled, StarFilled, CheckCircleFilled, PlusOutlined, ApartmentOutlined } from "@ant-design/icons";

const { Option } = Select;

const WriteContainer = ({ indexChanged, index_changed, indexSetId, book_id, Editor, EditorFromCard, FroalaEditorView, UpdateEditor }) => {
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
  const [editorOnForUpdate, setEditorOnForUpdate] = useState();
  const [cardId, setCardId] = useState("");
  const [editMode, setEditMode] = useState("normal");
  const [selectedCardType, setSelectedCardType] = useState();
  const [indexList, setIndexList] = useState();
  const [makerFlagStyle, setMakerFlagStyle] = useState();
  const [updateStatus, setUpdateStatus] = useState(false);
  const [getLink, setGetLink] = useState(false);
  // const [forceUpdateBool, setForceUpdateBool] = useState(false);
  // const [selections, setSelections] = useState();
  // const [selectionNicks, setSelectionNicks] = useState([]);

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

  const [cardset_makeSoundFile] = useMutation(AddPolly, { onCompleted: afteraddpollymutation });
  function afteraddpollymutation(data) {
    console.log("addpolly : ", data);
    setGetLink(data.cardset_makeSoundFile.route);
    sessionStorage.setItem("getLink", data.cardset_makeSoundFile.route);
  }

  async function addPolly(selection) {
    console.log(selection);
    try {
      await cardset_makeSoundFile({
        variables: {
          forMakeSoundFile: {
            targetText: selection,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const closeNotification = () => {
    notification.close("newCardInfo");
  };
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
      if (data1.cardset_getByIndexIDs.cardsets[0].cards.length === 0) {
        notification.info({
          message: <span style={{ fontSize: "1rem", fontWeight: "700" }}>카드를 생성 해 보세요!!!</span>,
          description: <span style={{ fontSize: "0.9rem" }}>하단 메뉴 두번째, &quot;카드추가&quot; 버튼을 눌러 새로운 카드를 만들수 있습니다.</span>,
          onClick: () => {
            console.log("Notification Clicked!");
          },
          placement: "topLeft",
          duration: 0,
          top: "150px",
          key: "newCardInfo",
        });
      }
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
  }, [data1, updateStatus, indexChanged, first_index, mycontent_getMycontentByMycontentIDs, buycontent_getBuycontentByBuycontentIDs]);

  const cardTypeInfo = (cardtype_info, from, parentId, shareCardId, selections, mycontent, card_info) => {
    sessionStorage.setItem("cardtype_info", JSON.stringify(cardtype_info));
    sessionStorage.setItem("from", from);
    sessionStorage.setItem("parentId", parentId);
    sessionStorage.setItem("shareCardId", shareCardId);

    console.log("cardTypeInfo fired!!!! editor on process");
    console.log(selections);
    // console.log("shareCardId", shareCardId);
    // console.log(cardId);
    if (shareCardId) {
      const childs = cards.filter((item) => {
        if (item.card_info.parentCard_id === shareCardId) {
          return item;
        }
      });
      // console.log("===========>", childs);
      let lastElement = childs[childs.length - 1];
      // console.log(lastElement);
      if (lastElement !== undefined) {
        setCardId(lastElement._id);
      }
    }

    // console.log(parentId);
    // console.log("여기다여기 : ", cardtype_info);
    const cardtypeEditor = cardtype_info.cardtype; //에디터에서 플립모드에 셀렉션 부과하려고 필요한 정보

    const num_face1 = cardtype_info.num_of_row.face1;
    const num_face2 = cardtype_info.num_of_row.face2;
    if (selections) {
      if (selections > 0) {
        var num_selection = selections;
      }
    }
    const num_annotation = cardtype_info.num_of_row.annotation;

    const nick_face1 = cardtype_info.nick_of_row.face1;
    const nick_face2 = cardtype_info.nick_of_row.face2;
    const nick_annotation = cardtype_info.nick_of_row.annotation;

    const nicks = [];

    const face1 = [];
    const face1Nick = [];
    for (var i = 0; i < num_face1; i++) {
      face1.push(i);
      face1Nick.push(nick_face1[i]);
      nicks.push(nick_face1[i]);
    }

    if (selections) {
      if (selections > 0) {
        const selection = [];
        const selectionNick = [];
        for (var i = 0; i < num_selection; i++) {
          selection.push(i);
          selectionNick.push(`보기${i + 1}`);
          nicks.push(`보기${i + 1}`);
        }
      }
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

    if (selections > 0) {
      console.log("here1");
      sessionStorage.setItem("nicks_with_selections", JSON.stringify(nicks));
    } else if (cardtypeEditor === "flip") {
      console.log("here2");
      sessionStorage.setItem("nicks_without_selections", JSON.stringify(nicks));
      sessionStorage.removeItem("nicks_with_selections");
      sessionStorage.setItem("selections_adding", 0);
    }

    const editor = (
      <>
        <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          <div style={{ width: "50px" }}>템플릿 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              카드타입선택
            </Option>
            {cardTypeListNormal}
          </Select>
          {cardtypeEditor === "flip" && (
            <>
              {selections == undefined && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
              {selections == 0 && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: "100px" }}>
          <Editor
            removeSelection={removeSelection}
            face1={face1}
            face2={face2}
            annot={annot}
            parentId={parentId}
            nicks={nicks}
            cardtypeEditor={cardtypeEditor}
            onFinish={onFinish}
            setEditorOn={setEditorOn}
            cardtype_info={cardtype_info}
            addSelections={addSelections}
            addPolly={addPolly}
            // forceUpdateBool={forceUpdateBool}
            // setForceUpdateBool={setForceUpdateBool}
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
          {cardtypeEditor === "flip" && (
            <>
              {selections == undefined && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
              {selections == 0 && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
            </>
          )}
        </div>
        <EditorFromCard
          removeSelection={removeSelection}
          face1={face1}
          face2={face2}
          annot={annot}
          parentId={parentId}
          nicks={nicks}
          cardtypeEditor={cardtypeEditor}
          onFinish={onFinish}
          setEditorOnFromCard={setEditorOnFromCard}
          cardtype_info={cardtype_info}
          addSelections={addSelections}
          addPolly={addPolly}
        />
      </>
    );

    const editorForUpdate = (
      <>
        <UpdateEditor
          face1={face1}
          face2={face2}
          annot={annot}
          parentId={parentId}
          nicks={nicks}
          cardtypeEditor={cardtypeEditor}
          onFinishUpdateContents={onFinishUpdateContents}
          setEditorOnForUpdate={setEditorOnForUpdate}
          cardtype_info={cardtype_info}
          mycontent={mycontent}
          card_info={card_info}
          addPolly={addPolly}
        />
      </>
    );

    if (from === "normal") {
      // console.log(cardId);
      setEditorOn(editor);
    } else if (from === "inCard") {
      console.log("inCard");
      setEditorOnFromCard(editorFromCard);
    } else if (from === "update") {
      console.log("update");
      console.log(nicks);
      setEditorOnForUpdate(editorForUpdate);
    }
  };

  function addSelections() {
    console.log("add selection clicked!!!");
    sessionStorage.removeItem("removed");
    const selections = sessionStorage.getItem("selections");
    if (selections === undefined) {
      sessionStorage.setItem("selections", 1);
      var num_selection = 1;
    } else {
      var num_selection = Number(selections) + 1;
      if (num_selection === 6) {
        return;
      }
      sessionStorage.setItem("selections", num_selection);
    }

    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));
    const from = sessionStorage.getItem("from");
    const parentId = sessionStorage.getItem("parentId");
    const shareCardId = sessionStorage.getItem("shareCardId");

    cardTypeInfo(cardtype_info, from, parentId, shareCardId, num_selection);
  }

  function removeSelection() {
    console.log("removeSelection clicked!!!");
    const selections = sessionStorage.getItem("selections");
    const num_selection = Number(selections) - 1;
    console.log(num_selection);
    sessionStorage.setItem("selections", num_selection);
    sessionStorage.setItem("removed", true);

    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));
    const from = sessionStorage.getItem("from");
    const parentId = sessionStorage.getItem("parentId");
    const shareCardId = sessionStorage.getItem("shareCardId");

    sessionStorage.setItem("lastSelectionRemoving", true);
    cardTypeInfo(cardtype_info, from, parentId, shareCardId, num_selection);
  }

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

    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, values.face1, values.selection, values.face2, values.annotation, values.flagStar, values.flagComment);
  };

  const [cardset_addcardAtSameIndex] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    sessionStorage.setItem("selections", 0);
    console.log(data)
    setCards(data.cardset_addcardAtSameIndex.cardsets[0].cards);
    sessionStorage.removeItem("parentId");
    sessionStorage.removeItem("nicks_with_selections");
    sessionStorage.removeItem("nicks_without_selections");
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
  async function addcard(
    mybook_id,
    cardtype,
    cardtype_id,
    current_position_card_id,
    face1_contents,
    selection_contents,
    face2_contents,
    annotation_contents,
    flagStar,
    flagComment
  ) {
    const parentId = sessionStorage.getItem("parentId");
    console.log("부모카드아이디", parentId);
    if (parentId === null) {
      var hasParent = "no";
      var parentCard_id = undefined;
    } else if (parentId === "null") {
      var hasParent = "no";
      var parentCard_id = undefined;
    } else if (parentId === "undefined") {
      hasParent = "no";
      parentCard_id = undefined;
    } else if (parentId === undefined) {
      hasParent = "no";
      parentCard_id = undefined;
    } else {
      hasParent = "yes";
      parentCard_id = parentId;
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
              parentCard_id: parentCard_id,
            },
            content: {
              // user_flag: null,
              // maker_flag: null,
              face1: face1_contents,
              selection: selection_contents,
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

  const [cardset_deleteCard] = useMutation(DeleteCard, { onCompleted: afterdeletecardmutation });

  function afterdeletecardmutation(data) {
    console.log("after delete card", data);
    const cardIdList = data.cardset_deleteCard.cardsets[0].cards.map((item) => {
      return item.content.mycontent_id;
    });
    console.log(cardIdList);
    mycontent_getMycontentByMycontentIDs({
      variables: {
        mycontent_ids: cardIdList,
      },
    });
  }
  async function deletecard(cardset_id, card_id) {
    try {
      await cardset_deleteCard({
        variables: {
          forDeleteCard: {
            cardset_id: cardset_id,
            card_id: card_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [mycontent_updateMycontent] = useMutation(UpdateMyContents, { onCompleted: afterupdatemycontentsmutation });

  function afterupdatemycontentsmutation(data) {
    console.log("after update contents", data);
    const newData = data.mycontent_updateMycontent.mycontents[0];
    console.log(contentsList);
    // const newArray = contentsList;
    const prevIndex = contentsList.findIndex((item) => item._id === newData._id);
    contentsList[prevIndex] = newData;
    // setContentsList(newArray)
    setUpdateStatus(!updateStatus);
  }

  async function updatecontents(mycontent_id, face1, selection, face2, annotation) {
    try {
      await mycontent_updateMycontent({
        variables: {
          forUpdateMycontent: {
            mycontent_id: mycontent_id,
            face1: face1,
            selection: selection,
            face2: face2,
            annotation: annotation,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [cardset_updateMakerFlag] = useMutation(UpdateMakerFlag, { onCompleted: afterupdateflag });

  function afterupdateflag(data) {
    console.log("after update flag", data);
    setCards(data.cardset_updateMakerFlag.cardsets[0].cards);
  }

  async function updatemakerflag(cardset_id, card_id, value, commentTmp) {
    console.log(commentTmp);
    if (commentTmp === "") {
      var comment = null;
    } else {
      comment = commentTmp;
    }
    try {
      await cardset_updateMakerFlag({
        variables: {
          forUpdateMakerFlag: {
            cardset_id,
            card_id,
            makerFlag: {
              value: Number(value),
              comment,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishUpdateContents = (values, from, mycontent_id, card_info) => {
    console.log(values);
    console.log(mycontent_id);
    console.log(card_info);
    updatecontents(mycontent_id, values.face1, values.selection, values.face2, values.annotation);
    updatemakerflag(card_info.card_info.cardset_id, card_info._id, values.flagStar, values.flagComment);
  };

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
    sessionStorage.setItem("selections", 0);
    sessionStorage.removeItem("nicks_with_selections");
    sessionStorage.removeItem("nicks_without_selections");
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

  function onClickCardAdd(from, shareCardId) {
    sessionStorage.setItem("selections", 0);
    setEditorOn("");
    setEditMode("normal");
    if (selectedCardType === undefined) {
      setSelectedCardType(cardTypes[0].cardtype_info);
      cardTypeInfo(cardTypes[0].cardtype_info, "inCard", null, shareCardId);
      sessionStorage.setItem("cardtype", cardTypes[0].cardtype_info.cardtype);
      sessionStorage.setItem("selectedCardTypeId", cardTypes[0]._id);
    } else {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === selectedCardType.name);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, "inCard", null, shareCardId);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
    }
  }

  function onClickCardUpdate(mycontent, thisCardType, card_info) {
    sessionStorage.setItem("selections", 0);
    setEditorOn("");
    setEditMode("update");
    const hello = cardTypes.filter((item) => item.cardtype_info.name === thisCardType.cardtype_info.name);
    setSelectedCardType(hello[0].cardtype_info);
    sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
    if (mycontent.selection) {
      var selection = mycontent.selection.length;
      console.log(mycontent.selection.length);
    } else {
      selection = null;
    }
    cardTypeInfo(hello[0].cardtype_info, "update", null, null, selection, mycontent, card_info);
  }

  function onClickCardAddChild(from, parentId, typeName) {
    sessionStorage.setItem("selections", 0);
    console.log(parentId);
    sessionStorage.setItem("parentId", parentId);
    setEditorOn("");
    setEditMode("normal");
    if (from === "child") {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === typeName);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
      cardTypeInfo(hello[0].cardtype_info, "inCard", parentId);
    } else if (from === "share") {
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
                        ? `Nanum Gothic, sans-serif`
                        : comment_font_font === "명조"
                        ? `Nanum Myeongjo, sans-serif`
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
                  <div className={`${content._id} other`} style={{ marginBottom: "0px" }}>
                    <div onClick={() => onClickCard(content._id, "normal")}>
                      {/* 페이스 스타일 영역 */}
                      {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.annotation[index].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                        <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                          <div>
                            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius: "5px" }}>
                              다음카드
                            </Button>
                          </div>
                          <div>
                            <Space style={{ display: "flex", alignItems: "center" }}>
                              {content.content.buycontent_id === null ? (
                                <>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  ></Button>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  ></Button>
                                </>
                              )}
                            </Space>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
                    </>
                  )}
                </>
              )}
              {content.card_info.cardtype === "general" && (
                <>
                  <div className={`${content._id} other`} style={{ marginBottom: "0px" }}>
                    <div onClick={() => onClickCard(content._id, "normal")}>
                      {/* 페이스 스타일 영역 */}
                      {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.annotation[index].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                        <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                          <div>
                            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius: "5px" }}>
                              다음카드
                            </Button>
                          </div>
                          <div>
                            <Space style={{ display: "flex", alignItems: "center" }}>
                              {content.content.buycontent_id === null ? (
                                <>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  ></Button>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  ></Button>
                                </>
                              )}
                            </Space>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
                    </>
                  )}
                </>
              )}
              {content.card_info.cardtype === "subject" && (
                <>
                  <div className={`${content._id} other`} style={{ marginBottom: "0px" }}>
                    <div onClick={() => onClickCard(content._id, "normal")}>
                      {/* 페이스 스타일 영역 */}
                      {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                    ? `Nanum Gothic, sans-serif`
                                    : row_font.face1[index].font === "명조"
                                    ? `Nanum Myeongjo, sans-serif`
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
                        <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                          <div>
                            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius: "5px" }}>
                              다음카드
                            </Button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Space>
                              {content.content.buycontent_id === null ? (
                                <>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  ></Button>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                  <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  >
                                    내용편집
                                  </Button>
                                  <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                    size="small"
                                    type="secondary"
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    disabled
                                  ></Button>
                                </>
                              )}
                            </Space>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
                    </>
                  )}
                </>
              )}
              {content.card_info.cardtype === "share" && (
                <>
                  <div className={`${content._id} child_group other`}>
                    <div style={{ marginBottom: "0px" }}>
                      <div onClick={() => onClickCard(content._id, "share")}>
                        {/* 페이스 스타일 영역 */}
                        {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row" }}>
                              <Space>
                                <div>
                                  <Button
                                    icon={<PlusOutlined />}
                                    size="small"
                                    type="primary"
                                    onClick={() => onClickCardAdd("share", content._id)}
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  >
                                    다음카드
                                  </Button>
                                </div>
                                <div>
                                  <Button
                                    icon={<ApartmentOutlined />}
                                    size="small"
                                    type="primary"
                                    onClick={() => onClickCardAddChild("share", content._id)}
                                    style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                  >
                                    자식카드
                                  </Button>
                                </div>
                              </Space>
                            </div>
                            <div>
                              <Space style={{ display: "flex", alignItems: "center" }}>
                                {content.content.buycontent_id === null ? (
                                  <>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    ></Button>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    ></Button>
                                  </>
                                )}
                              </Space>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ height: "0px" }}></div>
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
                    </>
                  )}
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
                          {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.face1[index].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                                          ? `Nanum Gothic, sans-serif`
                                          : row_font.face1[row_font.face1.length - 1].font === "명조"
                                          ? `Nanum Myeongjo, sans-serif`
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
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                      <span>
                                        {index === 0 && (
                                          <>
                                            <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➀</span>
                                          </>
                                        )}
                                        {index === 1 && (
                                          <>
                                            <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➁</span>
                                          </>
                                        )}
                                        {index === 2 && (
                                          <>
                                            <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➂</span>
                                          </>
                                        )}
                                        {index === 3 && (
                                          <>
                                            <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➃</span>
                                          </>
                                        )}
                                        {index === 4 && (
                                          <>
                                            <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➄</span>
                                          </>
                                        )}
                                      </span>
                                      <FroalaEditorView model={item} />
                                      {/* <FroalaEditorView model={item} /> */}
                                    </div>
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
                            {content_value.selection !== null &&
                              content_value.selection.length > 0 &&
                              content_value.face2.map((item, index) => (
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
                                          ? `Nanum Gothic, sans-serif`
                                          : row_font.face2[index].font === "명조"
                                          ? `Nanum Myeongjo, sans-serif`
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
                                    {item === "1" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➀</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "2" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➁</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "3" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➂</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "4" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➃</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "5" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➄</span>
                                      </div>
                                    </>
                                  )}

                                  {index !== 0 && <FroalaEditorView model={item} />}

  
                                  </div>
                                </>
                              ))}

                            {(content_value.selection === null || content_value.selection.length === 0) &&
                              content_value.face2.map((item, index) => (
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
                                          ? `Nanum Gothic, sans-serif`
                                          : row_font.face2[index].font === "명조"
                                          ? `Nanum Myeongjo, sans-serif`
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
                          <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div>
                              <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius: "5px" }}>
                                다음카드
                              </Button>
                            </div>
                            <div>
                              <Space style={{ display: "flex", alignItems: "center" }}>
                                {content.content.buycontent_id === null ? (
                                  <>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    ></Button>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    ></Button>
                                  </>
                                )}
                              </Space>
                            </div>
                          </div>
                        </>
                      )}
                      {content._id === cardId && content.card_info.hasParent === "yes" && (
                        <>
                          <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <div>
                              <Button
                                icon={<ApartmentOutlined />}
                                size="small"
                                type="primary"
                                onClick={() => onClickCardAddChild("child", content.card_info.parentCard_id, current_card_style[0].cardtype_info.name)}
                                style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                              >
                                자식카드
                              </Button>
                            </div>
                            <div>
                              <Space style={{ display: "flex", alignItems: "center" }}>
                                {content.content.buycontent_id === null ? (
                                  <>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                    ></Button>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                    <Button
                                      icon={<EditOutlined />}
                                      onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    >
                                      내용편집
                                    </Button>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                      size="small"
                                      type="secondary"
                                      style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      disabled
                                    ></Button>
                                  </>
                                )}
                              </Space>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ height: "0px" }}></div>
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
                    </>
                  )}
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
                          {(content.content.makerFlag.value !== 0 || content.content.makerFlag.comment !== null) && flagArea}
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
                                          ? `Nanum Gothic, sans-serif`
                                          : row_font.face1[index].font === "명조"
                                          ? `Nanum Myeongjo, sans-serif`
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
                                            ? `Nanum Gothic, sans-serif`
                                            : row_font.face1[index].font === "명조"
                                            ? `Nanum Myeongjo, sans-serif`
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
                                          ? `Nanum Gothic, sans-serif`
                                          : row_font.face2[index].font === "명조"
                                          ? `Nanum Myeongjo, sans-serif`
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
                            <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                              <div>
                                <Button icon={<PlusOutlined />} size="small" type="primary" onClick={onClickCardAdd} style={{ fontSize: "0.75rem", borderRadius: "5px" }}>
                                  다음카드
                                </Button>
                              </div>
                              <div>
                                <Space style={{ display: "flex", alignItems: "center" }}>
                                  {content.content.buycontent_id === null ? (
                                    <>
                                      <Button
                                        icon={<EditOutlined />}
                                        onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      >
                                        내용편집
                                      </Button>
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      ></Button>
                                    </>
                                  ) : (
                                    <>
                                      <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                      <Button
                                        icon={<EditOutlined />}
                                        onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                        disabled
                                      >
                                        내용편집
                                      </Button>
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                        disabled
                                      ></Button>
                                    </>
                                  )}
                                </Space>
                              </div>
                            </div>
                          </>
                        )}
                        {content._id === cardId && content.card_info.hasParent === "yes" && (
                          <>
                            <div style={{ padding: "5px", fontSize: "0.8rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                              <div>
                                <Button
                                  icon={<ApartmentOutlined />}
                                  size="small"
                                  type="primary"
                                  onClick={() => onClickCardAddChild("child", content.card_info.parentCard_id, current_card_style[0].cardtype_info.name)}
                                  style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                >
                                  자식카드
                                </Button>
                              </div>
                              <div>
                                <Space style={{ display: "flex", alignItems: "center" }}>
                                  {content.content.buycontent_id === null ? (
                                    <>
                                      <Button
                                        icon={<EditOutlined />}
                                        onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      >
                                        내용편집
                                      </Button>
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                      ></Button>
                                    </>
                                  ) : (
                                    <>
                                      <span style={{ fontSize: "0.8rem" }}>구매한 카드는 편집 및 삭제가 불가합니다.</span>
                                      <Button
                                        icon={<EditOutlined />}
                                        onClick={() => onClickCardUpdate(content_value, current_card_style[0], content)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                        disabled
                                      >
                                        내용편집
                                      </Button>
                                      <Button
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletecard(content.card_info.cardset_id, content._id)}
                                        size="small"
                                        type="secondary"
                                        style={{ fontSize: "0.75rem", borderRadius: "5px" }}
                                        disabled
                                      ></Button>
                                    </>
                                  )}
                                </Space>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div style={{ height: "0px" }}></div>
                    </div>
                  </div>
                  {content._id === cardId && editMode === "normal" && (
                    <>
                      <div>{editorOnFromCard}</div>
                    </>
                  )}

                  {content._id === cardId && editMode === "update" && (
                    <>
                      <div>{editorOnForUpdate}</div>
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
    console.log(contents);
  }

  const onClickCard = (card_id, from, group) => {
    console.log("cardClicked!!!!!");
    console.log("onClickCard", card_id);
    console.log("from", from);
    console.log("parent", group);
    setEditMode("normal");
    if ((from !== "share" && from !== "normal" && from !== "flip" && group === undefined) || null) {
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
    } else if (from === "share") {
      console.log("share");
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
      <div style={{ width: "95%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
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
            closeNotification={closeNotification}
          />
        </>
      )}
    </>
  );
};

export default WriteContainer;

import { Space, Button, Select, Modal, Tag, message, Input, Popover } from "antd";
const { Option } = Select;
const Editor = dynamic(() => import("../../../../../components/books/write/editpage/Editor"), {
    ssr: false,
  });
  
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
      cardTypeInfoNewCard(hello[0].cardtype_info, value[1]);
    }
  }

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
    cardTypeInfoNewCard(cardtype_info, num_selection);
  }

  function removeSelection() {
    console.log("removeSelection clicked!!!");
    const selections = sessionStorage.getItem("selections");
    const num_selection = Number(selections) - 1;
    console.log(num_selection);
    sessionStorage.setItem("selections", num_selection);
    sessionStorage.setItem("removed", true);

    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));

    sessionStorage.setItem("lastSelectionRemoving", true);
    cardTypeInfoNewCard(cardtype_info, num_selection);
  }

  const cardTypeInfoNewCard = (cardtype_info, selections) => {
    sessionStorage.setItem("cardtype_info", JSON.stringify(cardtype_info));
    console.log("여기다여기 : ", cardtype_info);

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

    if (cardTypes.length > 0) {
      var cardTypeListNormal = cardTypes.map((cardType) => {
        return (
          <>
            <Option value={[cardType.cardtype_info.name, "normal"]} style={{ fontSize: "0.8rem" }}>
              {cardType.cardtype_info.name}
            </Option>
          </>
        );
      });
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
            parentId={null}
            nicks={nicks}
            cardtypeEditor={cardtypeEditor}
            onFinish={onFinish}
            setEditorOn={setNewCardEditor}
            cardtype_info={cardtype_info}
            addSelections={addSelections}
            addPolly={addPolly}
          />
        </div>
      </>
    );

    setNewCardEditor(editor);
  };



  exports.editorPrepare = () => {  
    


    return editor
};

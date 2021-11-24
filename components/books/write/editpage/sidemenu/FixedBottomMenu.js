import ImportModal from "../import/ImportModal";
import M_RightDrawer from "../M_RightDrawer";
import M_FlagSettingDrawer from "../M_FlagSettingDrawer";
import { Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
const backgroundColor = "black";
const buttonColor = "white";
const fontColor = "white";

const FloatingMenu = ({
  indexList,
  setCardId,
  setEditorOnFromCard,
  setSelectedCardType,
  cardTypes,
  cardTypeInfo,
  cardSetId,
  indexChanged,
  indexSetId,
  book_id,
  selectedCardType,
  cardTypeSets,
  cardTypeSetId
}) => {
  const addCard = () => {
    setCardId("");
    setEditorOnFromCard("");
    if (selectedCardType) {
      const hello = cardTypes.filter((item) => item.cardtype_info.name === selectedCardType.name);
      console.log(hello);
      setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      cardTypeInfo(hello[0].cardtype_info, "normal");
      console.log("selectedCardType이 있을때 바텀메뉴에서 로그");
    } else {
      console.log("no cardtype selected!!!!!!! 그래서 그냥 첫번째 읽기 기본이 미리 선택된것임");
      console.log(cardTypes[0].cardtype_info.cardtype);
      setSelectedCardType(cardTypes[0].cardtype_info);
      sessionStorage.setItem("selectedCardTypeId", cardTypes[0]._id);
      cardTypeInfo(cardTypes[0].cardtype_info, "normal");
      sessionStorage.setItem("cardtype", cardTypes[0].cardtype_info.cardtype);
      console.log("selectedCardType이 없을때 바텀메뉴에서 로그");
    }
    console.log("clicked!!!");
  };
  return (
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, zIndex: 3, fontSize: "0.8rem" }}>
      <div
        style={{
          margin: "auto",
          background: backgroundColor,
          borderRadius: "5px 5px 0 0",
          borderBottom: "none",
          width: "90%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          boxShadow: "0px -1px 6px -1px #999999",
          alignItems: "center",
          color: fontColor,
        }}
      >
        <div
          style={{
            margin: 0,
            width:"100%",
            display: "flex",
            flexDirection: "row",
            listStyle: "none",
            alignItems: "center",
            justifyContent:"space-around"
          }}
        >
          <PlusSquareOutlined style={{fontSize:"1.2rem"}} onClick={addCard} />
          <ImportModal indexList={indexList} cardSetId={cardSetId} />
          <M_FlagSettingDrawer cardTypeSets={cardTypeSets} cardTypeSetId={cardTypeSetId}/>
          <M_RightDrawer book_id={book_id} />
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;

import ImportModal from "../import/ImportModal";
import RightDrawer from "../RightDrawer";
import { Button } from "antd";

const FloatingMenu = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId, book_id }) => {
  if (cardTypes) {
    var cardTypeList = cardTypes.map((cardType) => {
      return (
        <>
          <span>
            <Button size="small" onCspanck={() => selectCardType(cardType.cardtype_info)} style={{ fontSize: "0.8rem" }}>
              {cardType.cardtype_info.name}
            </Button>
          </span>
        </>
      );
    });
  }
  const selectCardType = (cardtype_info) => {
    console.log(cardtype_info);
    console.log("clicked!!!");
    cardTypeInfo(cardtype_info);
    sessionStorage.setItem("cardtype", cardtype_info.cardtype);
  };
  return (
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, zIndex: 3, fontSize: "0.8rem" }}>
      <div
        style={{
          margin: "auto",
          background: "white",
          borderRadius: "5px 5px 0 0",
          borderBottom: "none",
          width: "90%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          boxShadow: "0px -1px 6px -1px #999999",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: 0,
            display: "flex",
            flexDirection: "row",
            listStyle: "none",
            alignItems: "center",
          }}
        >
          <span>카드타입 : </span>
          {cardTypeList}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", flexBasis:"100px", alignItems:"center"}}>
          <ImportModal cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
          <RightDrawer book_id={book_id} />
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;

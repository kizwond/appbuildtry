import ImportModal from "../import/ImportModal";
import RightDrawer from "../RightDrawer";
import { Button } from "antd";

const backgroundColor = "black";
const buttonColor = "white";
const fontColor = "white"

const FloatingMenu = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId, book_id }) => {
  if (cardTypes) {
    var cardTypeList = cardTypes.map((cardType) => {
      return (
        <>
          <span style={{marginLeft:"5px"}}>
            <Button size="small" onClick={() => selectCardType(cardType.cardtype_info)} style={{ fontSize: "0.8rem" }}>
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
          background:backgroundColor,
          borderRadius: "5px 5px 0 0",
          borderBottom: "none",
          width: "90%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          boxShadow: "0px -1px 6px -1px #999999",
          alignItems: "center",
          color:fontColor
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
          <span style={{marginRight:"10px"}}>타입선택 : </span>
          <div style={{backgroundColor:"#e7e7e7", borderRadius:"5px", border:"1px solid lightgrey", boxShadow:"#9d9d9d80 1px 1px 3px inset", padding:"5px", width:"120px", overflow:"scroll", display:"flex", flexDirection:"row"}}>
          {cardTypeList}
          </div>
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

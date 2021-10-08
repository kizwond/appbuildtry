import ImportModal from "../import/ImportModal";
import RightDrawer from "../RightDrawer";

const FloatingMenu = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId, book_id }) => {
  if (cardTypes) {
    var cardTypeList = cardTypes.map((cardType) => {
      return (
        <>
          <li style={{ marginBottom: "5px" }}>
            <button onClick={() => selectCardType(cardType.cardtype_info)}>{cardType.cardtype_info.name}</button>
          </li>
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
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, zIndex: 3 }}>
      <div
        style={{
          margin: "auto",
          background: "white",
          borderRadius: "10px 10px 0 0",
          borderBottom: "none",
          width: "90%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          boxShadow: "0px -1px 6px -1px #999999",
        }}
      >
        <h3>카드추가</h3>
        <ul
          style={{
            margin: 0,
            display: "flex",
            flexDirection: "row",
            listStyle: "none",
          }}
        >
          {cardTypeList}
        </ul>
        <ImportModal cardTypes={cardTypes} cardTypeInfo={cardTypeInfo} cardSetId={cardSetId} indexChanged={indexChanged} indexSetId={indexSetId} />
        <RightDrawer book_id={book_id} />
      </div>
    </div>
  );
};

export default FloatingMenu;

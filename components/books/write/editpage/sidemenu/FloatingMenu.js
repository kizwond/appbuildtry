const FloatingMenu = ({ cardTypes, cardTypeInfo }) => {
  if (cardTypes) {
    var cardTypeList = cardTypes.map((cardType) => {
      return (
        <>
          <li style={{marginBottom:"5px"}}><button onClick={()=>selectCardType(cardType.cardtype_info)}>{cardType.cardtype_info.name}</button></li>
        </>
      );
    });
  }
  const selectCardType = (cardtype_info) => {
      console.log(cardtype_info)
      console.log("clicked!!!")
      cardTypeInfo(cardtype_info)
  }
  return (
    <div
      style={{
        border: "1px solid lightgrey",
        borderRadius: "5px",
        backgroundColor: "white",
        width: "120px",
        padding: "10px",
        //  height:"100px",
        position: "absolute",
        right: "-130px",
        fontSize: "11px",
        top: `100px`,
        boxShadow: "3px 2px 4px -2px rgba(138,138,138,1)",
        transition: "all ease 0.4s",
      }}
    >
      <h3>카드추가</h3>
      <ul
        style={{
          marginLeft: "10px",
          display: "flex",
          flexDirection: "column",
          listStyle:"none",
          padding:"0"
        }}
      >
          {cardTypeList}
      </ul>
    </div>
  );
};

export default FloatingMenu;

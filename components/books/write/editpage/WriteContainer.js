const WriteContainer = () => {
  const a4Page = {
    width: `790px`,
    minHeight: `1000px`,
    padding: `75px 75px 75px 75px`,
    border: "1px #D3D3D3 solid",
    borderRadius: "5px",
    background: `#ffffff`,
    boxShadow: " 0 0 5px rgba(0, 0, 0, 0.1)",
  };
  return (
    <div className="editor_panel" id="editor_panel" style={{ ...a4Page, position: "relative" }}>
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
          }}
        ></ul>
      </div>
      {/* 카드 뿌려지는 영역 */}

      <div className="a4">
        <div> 1. 우측 카드추가 부분에 cardTypeSet를 query해서 뿌려주고</div>
        <div>2. 카드타입 클릭시 해당 카드타입 설정에 따라 input창을 여기다가 뿌려주고</div>
        <div>3. form submit시 mutation 해서 저장해주고.</div>
        <div>4. mutation후 response data를 상태값으로 넣어서 위에다가 차례로 추가해주고.</div>
        <div>5. 촤측 목차 클릭시 해당 하는 카드들만 불러서 뿌려주고</div>
      </div>
    </div>
  );
};

export default WriteContainer;

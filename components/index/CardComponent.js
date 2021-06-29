import Image from "next/image";

const CardComponent = ({width}) => {
  if(width) {
    var value = width;
  } else {
    value = "49%"
  }
  return (
    <div style={{ display: "flex", width:value, border: "1px solid lightgrey",fontSize:"1rem" }}>
      <Image src={"/image/2.png"} width="100px" height="100px" alt="logo" />
      <div style={{display:'flex', width:"100%", flexDirection:'column', padding:5}}>
        <h3>2020.12.25</h3>
        <div style={{display:'flex', width:'100%',justifyContent:'space-between'}}>
          <div>진도율 50%</div>
          <button>학습이어하기</button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;

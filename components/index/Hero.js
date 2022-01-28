import { Carousel } from "antd";

const Hero = () => {
  const contentStyle = {
    height: "320px",
    color: "#fff",
    lineHeight: "320px",
    textAlign: "center",
    background: "#d4e0ff",
    marginTop:"50px",
    fontSize:"20px",
    borderRadius:"5px"
  };
  return (
    <>
      {/* <Carousel autoplay> */}
          <div>
            <h3 style={contentStyle}>잘 부탁드립니다~</h3>
          </div>
        {/* </Carousel> */}
    </>
  );
};

export default Hero;

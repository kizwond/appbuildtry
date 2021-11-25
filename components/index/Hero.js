import { Carousel } from "antd";

const Hero = () => {
  const contentStyle = {
    height: "320px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#939393",
  };
  return (
    <>
      <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
        </Carousel>
    </>
  );
};

export default Hero;

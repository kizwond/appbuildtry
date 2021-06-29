import { Carousel } from "antd";

const Hero = () => {
  const contentStyle = {
    height: "320px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#4f93c4",
  };
  return (
    <>
      <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
    </>
  );
};

export default Hero;

import Image from "next/image";
const Hero = () => {
  return (
    <>
    {/* <Image src="/image/hello_img.jpg" width="100%" height="100%" layout="responsive" objectFit="contain" alt="hello" /> */}
      <div style={contentStyle}><Image src="/image/hello_neon.jpg" width="1024px" height="400px" layout="responsive" sizes="50vw" alt="hello" className="hero_img" /></div>
    </>
  );
};

export default Hero;

const contentStyle = {
  width: "100%",
  maxWidth: "1024px",
  textAlign: "center",
  marginTop: "40px",
  fontSize: "20px",
  borderRadius: "5px",
  marginBottom:"10px",
};

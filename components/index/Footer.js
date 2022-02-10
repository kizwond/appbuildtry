import Image from "next/image";

const backgroundColor = "black";
const buttonColor = "white";
const logoColor = "#b7b7b7";

const Footer = () => {
  return (
    <>
      <div style={{ backgroundColor: backgroundColor }}>
        <div style={{ color: "#606060", width: "100%", margin: "auto", padding: 20, fontSize: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "70%" }}>
              <div>
                <span style={{ fontFamily: `Architects Daughter, cursive`, fontWeight: 900, color: logoColor }}>CogBook</span> | 개입정보 취급방침 | 이용약관
              </div>
              <div>(주)오픈스카이 | 대표자: 윤상일 | 사업자번호: 000-00-00000</div>
              <div>통신판매업: 2021-0000000-0000 | 개인정보보호책임자: 윤상일 | 이메일: cogbook@opensky.co.kr</div>
              <div>주소: 서울특별시 서초구 사평대로335 금성빌딩 501b호</div>
              <div>(주)오픈스카이. ALL RIGHTS RESERVED</div>
            </div>
            <div style={{ width: "30%", textAlign: "right", display: "flex", flexDirection: "column" }}>
              <span>
                <Image src={"/image/appstore.png"} width="100px" height="30px" alt="apple_app_store_logo" />
              </span>
              <span>
                <Image src={"/image/google.png"} width="100px" height="30px" alt="google_play_store_logo" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

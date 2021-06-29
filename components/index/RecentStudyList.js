import CardComponent from "./CardComponent";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useWindowSize } from "react-use";

const RecentStudyList = () => {
    const { width } = useWindowSize();
  
  if (width < 769 && width > 426) {
    var tablet = true;
  } else {
    tablet = false;
  }

  if (width < 1025 && width > 769) {
    var laptop = true;
  } else {
    laptop = false;
  }

  if (width > 1024) {
    var desktop = true;
  } else {
    desktop = false;
  }

  return (
    <>

        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  나의 최근학습 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <CardComponent/>
          <CardComponent/>
          </div>
        </div>


      {/* <DeskTopSm>
        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  나의 최근학습 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <CardComponent/>
          <CardComponent/>
          </div>
        </div>
      </DeskTopSm>
      <Tablet>
        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  나의 최근학습 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <CardComponent/>
            <CardComponent/>
          </div>
        </div>
      </Tablet>
      <Mobile>
        <h1 style={{ fontSize: "20px" }}>
          <div style={{ width: "100%", margin: "auto", padding: 20 }}>
            <div style={{ marginBottom: 10 }}>
              <Link href="/">
                <a>
                  <strong style={{ fontSize: "1rem", color: "black" }}>
                    나의 최근학습 <RightOutlined />
                  </strong>
                </a>
              </Link>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", flexDirection:'column' }}>
              <div style={{marginBottom:5}}>
              <CardComponent width={'100%'}/>
              </div>
              <CardComponent width={'100%'}/>
            </div>
          </div>
        </h1>
      </Mobile> */}
    </>
  );
};

export default RecentStudyList;

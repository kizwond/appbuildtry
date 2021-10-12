import NewBookCard from "./NewBookCard";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Row, Col, Carousel } from "antd";
import { useWindowSize } from "react-use";

const NewBooks = () => {
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
                <span style={{ fontSize: "0.8rem", color: "grey" }}>
                  콕북 신간 <RightOutlined />
                </span>
              </a>
            </Link>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            {/* <NewBookCard /> */}
          </div>
        </div>


      {/* <DeskTopSm>
        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  콕북 신간 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
          </div>
        </div>
      </DeskTopSm>
      <Tablet>
        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  콕북 신간 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", flexWrap:'wrap' }}>
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
          </div>
        </div>
      </Tablet>
      <Mobile>
        <div style={{ width: "100%", margin: "auto", padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <Link href="/">
              <a>
                <strong style={{ fontSize: "1rem", color: "black" }}>
                  콕북 신간 <RightOutlined />
                </strong>
              </a>
            </Link>
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", overflowY: 'hidden' }}>
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
            <NewBookCard />
          </div>
        </div>
      </Mobile> */}
    </>
  );
};

export default NewBooks;

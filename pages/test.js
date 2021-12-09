import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faStar } from "@fortawesome/free-solid-svg-icons";
import { Card, Space } from "antd";

const Test = () => {
  return (
    <Card>
      <Space size={30}>
        <span className="fa-layers fa-fw" style={{ fontSize: "16px" }}>
          <FontAwesomeIcon icon={faFlag} size="2x" />
          <span
            style={{
              position: "absolute",
              color: "white",
              fontSize: "10px",
              fontFamily: "NanumGothic",
            }}
          >
            2
          </span>
        </span>
        <span className="fa-layers fa-fw" style={{ fontSize: "16px" }}>
          <FontAwesomeIcon icon={faStar} size="2x" color="red" />
          <span
            style={{
              position: "absolute",
              color: "white",
              fontSize: "10px",
              fontFamily: "NanumGothic",
            }}
          >
            5
          </span>
        </span>
      </Space>
    </Card>
  );
};

export default Test;

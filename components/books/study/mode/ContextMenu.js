import useContextMenu from "./useContextMenu";
import { Button, Popover, Space } from "antd";
import {
  CopyOutlined,
  SearchOutlined,
  FormOutlined,
  HighlightOutlined,
  UnderlineOutlined,
  DragOutlined,
  EyeInvisibleOutlined,
  CheckCircleFilled,
  PlusOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

const Menu = ({hide}) => {
  const { anchorPoint, show } = useContextMenu();

  if (show) {
    return (
      <ul className="menu" style={{ top: anchorPoint.y, left: anchorPoint.x }}>
        <li style={{fontSize:"1rem"}}><DragOutlined /> 모두선택</li>
        <li style={{fontSize:"1rem"}}><CopyOutlined /> 복사</li>
        <li style={{fontSize:"1rem"}}><FormOutlined /> 단어카드생성</li>
        <li onClick={hide} style={{fontSize:"1rem"}}><EyeInvisibleOutlined /> 가리기</li>
        <li style={{fontSize:"1rem"}}><UnderlineOutlined /> 밑줄</li>
        <li style={{fontSize:"1rem"}}><HighlightOutlined /> 형광펜</li>
        <li style={{fontSize:"1rem"}}><SearchOutlined /> 검색</li>
      </ul>
    );
  }
  return <></>;
};

export default Menu;
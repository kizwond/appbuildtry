import react, { useState } from "react";
import { Button, Menu, Dropdown, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import TtsSettingModal from "./ttsSettingModal";

const { SubMenu } = Menu;

const StudyNav = () => {
  const [current, setCurrent] = useState("mail");
  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  const menu_0 = (
    <Menu>
      <Menu.ItemGroup>
        {/* <Menu.Item><NavLink to="/" exact onClick={this.onMenuClick}>메인</NavLink></Menu.Item>
        <Menu.Item><NavLink to="/write" exact onClick={this.onMenuClick}>만들기</NavLink></Menu.Item>
        <Menu.Item><NavLink to="/store" exact onClick={this.onMenuClick}>서점</NavLink></Menu.Item> */}
        <Button>로그아웃</Button>
      </Menu.ItemGroup>
    </Menu>
  );
  const menu_1 = (
    <Menu>
      <SubMenu title="카드 보기 모드" trigger={["click"]}>
        <Menu.Item>3rd menu item</Menu.Item>
        <Menu.Item>4th menu item</Menu.Item>
      </SubMenu>
      <Menu.ItemGroup>
        <Menu.Item>전체보기</Menu.Item>
        <Menu.Divider />
        <Menu.Item>앞/뒷면 바꾸기</Menu.Item>
        <Menu.Divider />
        <Menu.Item>보이기/순기기 설정</Menu.Item>
        <Menu.Divider />
        <Menu.Item><TtsSettingModal/></Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
  const menu_2 = (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item>앞/뒷면 서식 설정</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
  const menu_3 = (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item>ooooo</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );
  return (
    <div className="study_page_container">
      <header style={{ background: "black", borderBottom: "1px solid #d3d3d3" }}>
        <div style={{ display: "flex", width: "100%", margin: "auto", flexDirection: "row", justifyContent: "space-between" }}>
          <Dropdown overlay={menu_0}>
            <div href="/" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              <MenuOutlined style={{ marginRight: "100px", color: "white" }} />
            </div>
          </Dropdown>
          <div style={{ display: "flex", width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Space size="large">
              <Dropdown overlay={menu_1}>
                <div  className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>
                  보기
                </div>
              </Dropdown>
              <Dropdown overlay={menu_2}>
                <div  className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>
                  서식
                </div>
              </Dropdown>
              <Dropdown overlay={menu_3}>
                <div className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>
                  학습
                </div>
              </Dropdown>
              <Button size="small" width="90px">
                세션종료
              </Button>
            </Space>
          </div>
        </div>
      </header>
    </div>
  );
};

export default StudyNav;

import React, { useState, useEffect, useCallback } from "react";
import { message, Modal, Space, Drawer, Button, Radio, Select } from "antd";
import M_LeftDrawerDirectRead from "../M_LeftDrawerDirectRead";
import {
  ProfileOutlined,
  FlagFilled,
  HeartFilled,
  StarFilled,
  CheckCircleFilled,
  PlusOutlined,
  MenuFoldOutlined,
  HighlightOutlined,
  MessageOutlined,
  UnderlineOutlined,
  TagOutlined,
  PicRightOutlined,
  QuestionCircleOutlined,
  EyeInvisibleOutlined,
  FlagOutlined,
  SettingOutlined,
  CloseOutlined,
  DashOutlined,
  SoundOutlined,
  ToolOutlined,
  ReadOutlined,
  HighlightTwoTone,
  EyeInvisibleTwoTone,
} from "@ant-design/icons";

import StudyToolSetting from "../../../study/mode/StudyToolSetting";
import Item from "antd/lib/list/Item";
import Image from "next/image";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { Dictionary } from "../../../../../graphql/query/card_contents";
const { Option } = Select;

const FloatingMenu = ({
  highlightToggle,
  highlightToggleHandler,
  hiddenToggleHandler,
  underlineToggleHandler,
  searchToggleHandler,
  cardTypeSets,
  hiddenToggle,
  underlineToggle,
  searchToggle,
  hide,
  underline,
  highlight,
  search,
  updateStudyToolApply,
  setHiddenToggle,
  setUnderlineToggle,
  setHighlightToggle,
  setSearchToggle,
  searchResult,
  prepareCardInDictionary,
  editorOn,
  selectedCardType,
  fireEditor,
}) => {
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createCardOn, setCreateCardOn] = useState(false);
  const [caseRadio, setCaseRadio] = useState("next");
  const [result, setResult] = useState();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const info = () => {
    var selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === null) {
      selectionText = "??????????????? ????????????.";
      message.warning({
        content: selectionText,
        style: {
          marginTop: "20vh",
        },
      });
    } else {
      message.success({
        content: selectionText,
        style: {
          marginTop: "20vh",
        },
      });
    }
  };

  if (cardTypeSets.length > 0) {
    const hiddenSettings = cardTypeSets[0].studyTool.hidden;
    const highlightSettings = cardTypeSets[0].studyTool.highlight;
    const underlineSettings = cardTypeSets[0].studyTool.underline;

    var hiddenButtons = hiddenSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            className={`hiddenGroup${index}`}
            onClick={() => hide(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #909090",
              padding: "10px 10px 10px 10px",
              color: "black",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                width: "30px",
                height: "20px",
                borderRadius: "3px",
                backgroundColor: item.color,
                textAlign: "center",
              }}
            ></div>
          </div>
        </>
      );
    });

    var underlineButtons = underlineSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            className={`underlineGroup${index}`}
            onClick={() => underline(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              // left: "-7px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #909090",
              padding: "15px 10px 5px 10px",
              color: "black",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                width: "30px",
                height: "1px",
                borderBottom: `${item.attr1}px ${item.attr2} ${item.color}`,
                textAlign: "center",
                lineHeight: "20px",
              }}
            >
              {item.attr1}px
            </div>
          </div>
        </>
      );
    });

    const searchSettings = ["????????????", "????????????"];
    var searchButtons = searchSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            className={`searchGroup${index}`}
            onClick={() => editorModalOpen(item)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              // left: "-7px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #909090",
              color: "black",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                textAlign: "center",
                lineHeight: "40px",
              }}
            >
              {item}
            </div>
          </div>
        </>
      );
    });

    var highlightButtons = highlightSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            className={`highlightGroup${index}`}
            onClick={() => highlight(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              // left: "-10px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #909090",
              padding: "10px 10px 5px 10px",
              lineHeight: "45px",
              color: "black",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <>
                  <div className={item.attr1} style={{ height: "15px", fontSize: "0.8rem", display: "inline-block", backgroundColor: item.color }}>
                    <div style={{ visibility: "hidden" }}> brush{index + 1}</div>
                  </div>
                </>
              {/* {item.attr1 === "brush2" && (
                <>
                  <div className={item.attr1} style={{ height: "15px", fontSize: "0.8rem", display: "inline-block", backgroundColor: item.color }}>
                    <div style={{ visibility: "hidden" }}> brush{index + 1}</div>
                  </div>
                </>
              )}
              {item.attr1 !== "brush2" && (
                <>
                  <div className={item.attr1} style={{ fontSize: "0.8rem", display: "inline-block", "--bubble-color": item.color, "--z-index": 0 }}>
                    <div style={{ visibility: "hidden" }}> brush{index + 1}</div>
                  </div>
                </>
              )} */}
            </div>
          </div>
        </>
      );
    });
  }
  function hideAll() {
    setHiddenToggle(false);
    setUnderlineToggle(false);
    setHighlightToggle(false);
    setSearchToggle(false);
    setBottomVisible(!bottomVisible);
  }

  const onClose = () => {
    setBottomVisible(false);
  };

  async function editorModalOpen(menu) {
    const hello = async () => search(menu);
    await hello().then(setResult(searchResult));

    if (memu === "????????????") {
      showModal();
    } else {
      alert("??????????????????.");
    }
  }
  function createCardInDictionary() {
    console.log("??????????????? ??????!!");
    setCreateCardOn(true);
    if (caseRadio === "next") {
      prepareCardInDictionary("next");
    }
    // prepareCardInDictionary()
  }
  function onChange(e) {
    console.log("radio checked", e.target.value);
    setCaseRadio(e.target.value);
    if (e.target.value === "next") {
      prepareCardInDictionary("next");
    }
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
    fireEditor(value);
  }

  if (selectedCardType) {
    if (selectedCardType.length > 0) {
      var selections = selectedCardType.map((item) => {
        if (item.cardtype_info.cardtype === "flip") {
          return (
            <>
              <Option value={item._id}>{item.cardtype_info.name}</Option>
            </>
          );
        }
      });
    }
  }
  return (
    <>
      <svg xmlns="//www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{ display: "none" }}>
        <defs>
          <filter id="marker-shape">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
          </filter>
        </defs>
      </svg>
      <div style={{ width:"100%", position: "fixed", bottom: 0}}>
      <div style={{ margin:"auto", width: "100%", maxWidth: "1024px", alignItems: "center", left: 0, zIndex: 3, fontSize: "0.8rem" }}>
        <div
          style={{
            margin: "auto",
            background: "#484848",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            boxShadow: "0px -1px 2px 0px #b4b4b4",
            alignItems: "center",
            color: "#c6c6c6",
            borderRadius: "13px 13px 0 0",
          }}
        >
          <div
            style={{
              margin: 0,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              listStyle: "none",
              alignItems: "center",
              justifyContent: "space-around",
              cursor:"pointer"
            }}
          >
            {hiddenToggle && (
              <div
                onClick={() => hiddenToggleHandler(info)}
                style={{
                  borderTopLeftRadius: "13px",
                  padding: "5px 0",
                  backgroundColor: "#262626",
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <EyeInvisibleOutlined className="hiddenToggleButton" style={{ fontSize: "1.5rem", color: "white" }} />
                <span style={{ color: "white" }}>?????????</span>
                {hiddenButtons}
              </div>
            )}
            {!hiddenToggle && (
              <div
                onClick={() => hiddenToggleHandler(info)}
                style={{ padding: "5px 0", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {underlineToggle || highlightToggle || searchToggle ? (
                  <>
                    <EyeInvisibleOutlined style={{ fontSize: "1.5rem", color: "#636363" }} />
                    <span style={{ color: "#636363" }}>?????????</span>
                  </>
                ) : (
                  <>
                    <EyeInvisibleOutlined style={{ fontSize: "1.5rem" }} />
                    ?????????
                  </>
                )}
              </div>
            )}

            {underlineToggle && (
              <div
                onClick={() => underlineToggleHandler(info)}
                style={{ padding: "5px 0", backgroundColor: "#262626", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <UnderlineOutlined className="underlineToggleButton" style={{ fontSize: "1.5rem", color: "white" }} />
                <span style={{ color: "white" }}>????????????</span>

                {underlineButtons}
              </div>
            )}
            {!underlineToggle && (
              <div
                onClick={() => underlineToggleHandler(info)}
                style={{ padding: "5px 0", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {hiddenToggle || highlightToggle || searchToggle ? (
                  <>
                    <UnderlineOutlined style={{ fontSize: "1.5rem", color: "#636363" }} />
                    <span style={{ color: "#636363" }}>????????????</span>
                  </>
                ) : (
                  <>
                    <UnderlineOutlined style={{ fontSize: "1.5rem" }} />
                    ????????????
                  </>
                )}
              </div>
            )}
            {highlightToggle && (
              <div
                onClick={() => highlightToggleHandler(info)}
                style={{ padding: "5px 0", backgroundColor: "#262626", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <HighlightOutlined className="highlightToggleButton" style={{ fontSize: "1.5rem", color: "white" }} />
                <span style={{ color: "white" }}>?????????</span>

                {highlightButtons}
              </div>
            )}
            {!highlightToggle && (
              <div
                onClick={() => highlightToggleHandler(info)}
                style={{ padding: "5px 0", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {hiddenToggle || underlineToggle || searchToggle ? (
                  <>
                    <HighlightOutlined style={{ fontSize: "1.5rem", color: "#636363" }} />
                    <span style={{ color: "#636363" }}>?????????</span>
                  </>
                ) : (
                  <>
                    <HighlightOutlined style={{ fontSize: "1.5rem" }} />
                    ?????????
                  </>
                )}
              </div>
            )}

            {searchToggle && (
              <div
                onClick={() => searchToggleHandler(info)}
                style={{ padding: "5px 0", backgroundColor: "#262626", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src="/image/dictionary_icon_white.png" width={"20px"} height={"20px"} alt="dictionary" />
                  ????????????
                </div>

                {searchButtons}
              </div>
            )}
            {!searchToggle && (
              <div
                onClick={() => searchToggleHandler(info)}
                style={{ padding: "5px 0", width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                {hiddenToggle || underlineToggle || highlightToggle ? (
                  <>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Image src="/image/dictionary_icon.png" width={"20px"} height={"20px"} alt="dictionary" />
                      <span style={{ color: "#636363" }}>????????????</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Image src="/image/dictionary_icon_white.png" width={"20px"} height={"20px"} alt="dictionary" />
                      ????????????
                    </div>
                  </>
                )}
              </div>
            )}

            {hiddenToggle || underlineToggle || highlightToggle || searchToggle ? (
              <>
                <div onClick={hideAll} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <DashOutlined style={{ fontSize: "1.5rem", color: "#636363" }} />
                  <span style={{ color: "#636363" }}>?????????</span>
                </div>
              </>
            ) : (
              <>
                <div onClick={hideAll} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <DashOutlined style={{ fontSize: "1.5rem" }} />
                  ?????????
                </div>
              </>
            )}

            <Drawer className="moreBottomDrawer" maskStyle={{ marginTop: "40px" }} height="300px" placement="bottom" closable={false} onClose={onClose} visible={bottomVisible}>
              <Space
                size={16}
                style={{ padding: 20, display: "flex", flexDirection: "flex-start", justifyContent: "flex-start", flexWrap: "wrap", fontSize: "0.8rem", color: "#7a7a7a" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <ReadOutlined style={{ fontSize: "1.5rem" }} />
                  ????????????
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <StudyToolSetting setBottomVisible={setBottomVisible} cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <SoundOutlined style={{ fontSize: "1.5rem" }} />
                  TTS??????
                </div>
              </Space>
            </Drawer>
            <Modal footer={null} title="????????????" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              {searchResult && (
                <>
                  <div style={{ fontSize: "1rem" }}>???????????? : {searchResult.selectionText}</div>
                  <div style={{ fontSize: "1rem" }}>??? : {searchResult.meaning1}</div>
                  <div style={{ fontSize: "1rem" }}>????????? : {searchResult.meaningEng1}</div>
                  <div style={{ fontSize: "1rem" }}>???2 : {searchResult.meaning2}</div>
                  <div style={{ fontSize: "1rem" }}>?????????2 : {searchResult.meaningEng2}</div>
                  <div style={{ fontSize: "1rem" }}>??????1 : {searchResult.example1}</div>
                  <div style={{ fontSize: "1rem" }}>??????2 : {searchResult.example2}</div>
                </>
              )}
              <Button size="small" type="primary" onClick={createCardInDictionary}>
                ????????????
              </Button>
              {createCardOn && (
                <>
                  <Radio.Group onChange={onChange} value={caseRadio}>
                    <Space direction="vertical">
                      <Radio value="next">???????????? ?????? ???</Radio>
                      <Radio value="same_last">???????????? ????????? ??? ???</Radio>
                      <Radio value="diff_last">????????? ?????? ????????? ??? ???</Radio>
                      <Radio value="diff_book">????????? ?????? ????????? ??? ???</Radio>
                    </Space>
                  </Radio.Group>
                </>
              )}
              {caseRadio === "next" && (
                <>
                  <div>???????????? ????????? selection</div>
                </>
              )}
              {caseRadio === "same_last" && (
                <>
                  <div>???????????? ????????? ??? ??? selection</div>
                </>
              )}
              {caseRadio === "diff_last" && (
                <>
                  <div>????????? ?????? ????????? ??? ??? selection</div>
                </>
              )}
              {caseRadio === "diff_book" && (
                <>
                  <div>????????? ?????? ????????? ??? ??? selection</div>
                </>
              )}

              {selectedCardType && (
                <>
                  <Select defaultValue="default" style={{ width: 120 }} onChange={handleChange}>
                    <Option value="default" disabled>
                      ???????????? ??????
                    </Option>
                    {selections}
                  </Select>
                </>
              )}
              {editorOn}
            </Modal>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default FloatingMenu;

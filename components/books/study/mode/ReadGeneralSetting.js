import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider, Tag } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { ReadOutlined } from "@ant-design/icons";
import HiddenSetting from "./HiddenSetting";
import UnderlineSetting from "./UnderlineSetting";
import HighlightSetting from "./HighlightSetting";
import { Tabs, Switch, Radio } from "antd";
import SectionForResult from "../result/SectionForResult";
import { useMemo } from "react";
const { TabPane } = Tabs;

const RightDrawer = ({
  setBottomVisible,
  face1row,
  face1On,
  face2row,
  face2On,
  selectionShow,
  selectionOn,
}) => {
  const [visible, setVisible] = useState(false);
  console.log({ face1row });

  const [faceOneTTS, setFaceOneTTS] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    selection: true,
  });
  const [faceTwoTTS, setFaceTwoTTS] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const readModeDisplayOption = {
    face1row,
    face2row,
  };

  const showDrawer = () => {
    setVisible(true);
    setBottomVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const readModeTTSOption = {
      faceOneTTS,
      faceTwoTTS,
    };

    sessionStorage.setItem(
      "readModeTTSOption",
      JSON.stringify(readModeTTSOption)
    );
  }, [faceOneTTS, faceTwoTTS]);

  useEffect(() => {
    const readModeDisplayOption = {
      face1row,
      face2row,
      selectionShow,
    };

    sessionStorage.setItem(
      "readModeDisplayOption",
      JSON.stringify(readModeDisplayOption)
    );
  }, [face1row, face2row, selectionShow]);

  function faceOneTTSHandler(rowStr) {
    setFaceOneTTS({
      ...faceOneTTS,
      ["" + rowStr]: !faceOneTTS["" + rowStr],
    });
  }
  function faceTwoTTSHandler(rowStr) {
    setFaceTwoTTS({
      ...faceTwoTTS,
      ["" + rowStr]: !faceTwoTTS["" + rowStr],
    });
  }

  function face1Handler(checked, rowStr) {
    console.log(`switch to ${checked}`);
    if (checked === true) {
      face1On(rowStr, true);
      setFaceOneTTS({
        ...faceOneTTS,
        ["" + rowStr]: true,
      });
    } else {
      face1On(rowStr, false);
      setFaceOneTTS({
        ...faceOneTTS,
        ["" + rowStr]: false,
      });
    }
  }
  function face2Handler(checked, rowStr) {
    console.log(`switch to ${checked}`);
    if (checked === true) {
      face2On(rowStr, true);
      setFaceTwoTTS({
        ...faceTwoTTS,
        ["" + rowStr]: true,
      });
    } else {
      face2On(rowStr, false);
      setFaceTwoTTS({
        ...faceTwoTTS,
        ["" + rowStr]: false,
      });
    }
  }

  const getValueFaceOneRow = (keyName) => face1row[keyName];
  const getValueFaceTwoRow = (keyName) => face2row[keyName];

  return (
    <>
      <div onClick={showDrawer} className="flex flex-col items-center">
        <ReadOutlined className="text-[1.5rem]" />
        학습설정
      </div>
      <Drawer
        title={
          <>
            <span className="text-base font-bold">학습설정</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={260}
        style={{ zIndex: 1031 }}
      >
        <div className="flex justify-between px-2 text-base font-medium text-gray-600 border-b border-b-gray-200">
          <div>제목</div>
          <div className="flex gap-4">
            <div className="min-w-[4rem] flex justify-center items-center">
              표시
            </div>
            <div className="min-w-[4rem] flex justify-center items-center">
              TTS
            </div>
          </div>
        </div>
        <div className="flex flex-col px-2 mt-2 gap-y-3">
          <div className="flex flex-col gap-y-2">
            <div className="text-base font-semibold">앞면</div>
            {Object.keys(face1row).map((row, i, face1row) => (
              <div key={row} className="flex justify-end gap-4">
                <div className="min-w-[4rem] flex justify-end items-center">
                  {i + 1}행
                </div>
                <div className="min-w-[4rem] flex justify-center items-center">
                  <Switch
                    checked={getValueFaceOneRow(row)}
                    onChange={(_bool) => {
                      face1Handler(_bool, String(i + 1));
                    }}
                  />
                </div>
                <div className="min-w-[4rem] flex justify-center items-center">
                  <div
                    className={`h-[22px] w-[40px] text-[#00000071] text-base rounded-[2px] border border-[#d9d9d9] text-center ${
                      !getValueFaceOneRow(row)
                        ? "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-not-allowed"
                        : faceOneTTS[`${i + 1}`]
                        ? "bg-[#1890FF] border-[#1890FF] text-white cursor-pointer"
                        : "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-pointer"
                    }`}
                    onClick={(e) => {
                      if (getValueFaceOneRow(row)) {
                        faceOneTTSHandler(i + 1);
                      }
                    }}
                  >
                    {getValueFaceOneRow(row) && faceOneTTS[`${i + 1}`]
                      ? "on"
                      : "off"}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <div className="min-w-[4rem] flex justify-end items-center">
                보기
              </div>
              <div className="min-w-[4rem] flex justify-center items-center">
                <Switch checked={selectionShow} onChange={selectionOn} />
              </div>
              <div className="min-w-[4rem] flex justify-center items-center">
                <div
                  className={`h-[22px] w-[40px] text-[#00000071] text-base rounded-[2px] border border-[#d9d9d9] text-center ${
                    !selectionShow
                      ? "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-not-allowed"
                      : faceOneTTS.selection
                      ? "bg-[#1890FF] border-[#1890FF] text-white cursor-pointer"
                      : "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-pointer"
                  }`}
                  onClick={(e) => {
                    if (selectionShow) {
                      faceOneTTSHandler("selection");
                    }
                  }}
                >
                  {selectionShow && faceOneTTS.selection ? "on" : "off"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="text-base font-semibold">뒷면</div>
            {Object.keys(face2row).map((row, i, face1row) => (
              <div key={row} className="flex justify-end gap-4">
                <div className="min-w-[4rem] flex justify-end items-center">
                  {i + 1}행
                </div>
                <div className="min-w-[4rem] flex justify-center items-center">
                  <Switch
                    checked={getValueFaceTwoRow(row)}
                    onChange={(_bool) => {
                      face2Handler(_bool, String(i + 1));
                    }}
                  />
                </div>
                <div className="min-w-[4rem] flex justify-center items-center">
                  <div
                    className={`h-[22px] w-[40px] text-[#00000071] text-base rounded-[2px] border border-[#d9d9d9] text-center ${
                      !getValueFaceTwoRow(row)
                        ? "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-not-allowed"
                        : faceTwoTTS[`${i + 1}`]
                        ? "bg-[#1890FF] border-[#1890FF] text-white cursor-pointer"
                        : "bg-[#fafafa] border-[#d9d9d9] text-[#00000071] cursor-pointer"
                    }`}
                    onClick={(e) => {
                      if (getValueFaceTwoRow(row)) {
                        faceTwoTTSHandler(i + 1);
                      }
                    }}
                  >
                    {getValueFaceTwoRow(row) && faceTwoTTS[`${i + 1}`]
                      ? "on"
                      : "off"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <Space
          className="pt-0 pb-0 pl-0 pr-0"
          style={{
            padding: "0px 10px 0px 10px",
            fontSize: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>화면표시</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>표시</span>
                <span style={{ width: "30px" }}>TTS</span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px" }}>앞면</span>
              <span>1행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face1row1Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                앞면
              </span>
              <span>2행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face1row2Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                앞면
              </span>
              <span>3행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face1row3Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                앞면
              </span>
              <span>4행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face1row4Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                앞면
              </span>
              <span>5행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face1row5Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px" }}>뒷면</span>
              <span>1행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face2row1Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                뒷면
              </span>
              <span>2행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face2row2Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                뒷면
              </span>
              <span>3행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face2row3Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                뒷면
              </span>
              <span>4행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={face2row4Handler} />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
            <div
              style={{
                width: "230px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginLeft: "50px", visibility: "hidden" }}>
                뒷면
              </span>
              <span>5행</span>
              <div
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ width: "30px" }}>
                  <Switch
                    size="small"
                    defaultChecked
                    onChange={face2row5Handler}
                  />
                </span>
                <span style={{ width: "30px" }}>
                  <Switch size="small" onChange={tempFunction} />
                </span>
              </div>
            </div>
          </div>
        </Space> */}
      </Drawer>
    </>
  );
};

export default RightDrawer;

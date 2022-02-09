import React, { useState } from "react";
import {
  Modal,
  Button,
  Popover,
  Form,
  Input,
  Space,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  AreaChartOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  RightCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import styled from "styled-components";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

const StyledModal = styled(Modal)`
  min-width: 340px;
  & .ant-modal-body {
    padding: 8px 8px 8px 8px;
`;

const withNothing = (Component) =>
  function hocCompo({ ...props }) {
    return <Component {...props} />;
  };

const IndexSettingModal = ({
  indexinfo,
  onFinish,
  onFinishRename,
  indexSetInfo,
  onFinishChangeLevel,
  onFinishIndexDelete,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [expandedId, setExpandedId] = useState("");
  const changeExpandedId = useCallback((_id) => {
    setExpandedId(_id);
  }, []);

  const [popconfirmVisible, setPopconfirmVisible] = useState(false);
  const changePopconfirmVisible = useCallback((_bool) => {
    setPopconfirmVisible(_bool);
  }, []);

  useEffect(() => {
    setExpandedId("");
  }, [isModalVisible]);

  const toggleToExpandForAdding = () => {
    if (expandedId === "첫번째 행입니다용") {
      setExpandedId("");
      setName("");
    } else {
      setExpandedId("첫번째 행입니다용");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    setPopconfirmVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setPopconfirmVisible(false);
  };

  const handleCancel = () => {
    setPopconfirmVisible(false);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 100);
  };

  return (
    <>
      <SettingOutlined
        size="small"
        onClick={showModal}
        style={{ fontSize: "1rem" }}
      />
      <StyledModal
        footer={null}
        title="목차설정"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <table
          className="w-full table-fixed"
          /* onClick={() => setPopconfirmVisible(false)} */
        >
          <thead>
            <tr className="border-collapse border-y border-y-gray-200">
              <th
                className=" bg-slate-100 w-[30px] text-base font-normal text-blue-500 h-[27px] "
                onClick={toggleToExpandForAdding}
              >
                {expandedId === "첫번째 행입니다용" ? (
                  "접기"
                ) : (
                  <Button
                    size="small"
                    shape="circle"
                    type="text"
                    icon={<PlusOutlined />}
                  />
                )}
              </th>
              <th className="text-base bg-slate-100 w-[24%]">레벨변경</th>
              <th className="text-base bg-slate-100">목차명</th>
              <th className="text-base bg-slate-100 w-[10%]"></th>
              <th className="text-base bg-slate-100 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {expandedId === "첫번째 행입니다용" && (
              <tr className="border-b border-collapse border-b-gray-200">
                <td colSpan={5} className="py-3">
                  <div className="flex w-full gap-2">
                    <Input
                      size="small"
                      className="w-full"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        setExpandedId("");
                        setName("");
                        onFinish({
                          name,
                          current_index_id: null,
                          indexset_id: indexSetInfo._id,
                        });
                      }}
                    >
                      추가
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setExpandedId("");
                        setName("");
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            {indexinfo.map((index, i) => (
              <TableRow
                key={index._id}
                index={index}
                prevItemIndex={i === 0 ? null : i - 1}
                indexSetInfo={indexSetInfo}
                onFinish={onFinish}
                onFinishIndexDelete={onFinishIndexDelete}
                onFinishChangeLevel={onFinishChangeLevel}
                onFinishRename={onFinishRename}
                isModalVisible={isModalVisible}
                expandedId={expandedId}
                changeExpandedId={changeExpandedId}
                popconfirmVisible={popconfirmVisible}
                changePopconfirmVisible={changePopconfirmVisible}
              />
            ))}
          </tbody>
        </table>
      </StyledModal>
    </>
  );
};

export default IndexSettingModal;

const TableRow = ({
  index,
  onFinish,
  onFinishRename,
  indexSetInfo,
  onFinishChangeLevel,
  onFinishIndexDelete,
  prevItemIndex,
  isModalVisible,
  expandedId,
  changeExpandedId,
  popconfirmVisible,
  changePopconfirmVisible,
}) => {
  const turnOffPopConfirm = () => {
    if (Popconfirm) {
      changePopconfirmVisible(false);
    }
  };
  const [name, setName] = useState("");
  const [rename, setReName] = useState("");
  const [indexForCardsInDeletedIndex, setIndexForCardsInDeletedIndex] =
    useState("none");
  const [content, setContent] = useState("");
  /* const [popconfirmVisible, setPopconfirmVisible] = useState(false); */

  const deleteIndexesSelectorRef = useRef();

  const addNewIndexInputRef = useRef();
  const renameInputRef = useRef();
  useEffect(() => {
    if (expandedId === index._id && content === "add") {
      addNewIndexInputRef.current.focus();
    }
    if (expandedId === index._id && content === "rename") {
      renameInputRef.current.focus();
    }
    if (expandedId === index._id && content === "delete") {
      deleteIndexesSelectorRef.current.focus();
    }
  }, [expandedId, index, content]);

  const toggleToExpandForAdding = () => {
    if (expandedId === index._id) {
      changeExpandedId("");
      setName("");
      setContent("");
      setIndexForCardsInDeletedIndex("none");
      setReName("");
    } else {
      changeExpandedId(index._id);
      setContent("add");
    }
  };

  const toggleToExpandForDeleting = () => {
    if (expandedId === index._id) {
      changeExpandedId("");
      setName("");
      setContent("");
      setIndexForCardsInDeletedIndex("none");
      setReName("");
    } else {
      changeExpandedId(index._id);
      setContent("delete");
      setIndexForCardsInDeletedIndex("none");
    }
  };
  const toggleToExpandForRenaming = () => {
    if (expandedId === index._id) {
      changeExpandedId("");
      setName("");
      setContent("");
      setIndexForCardsInDeletedIndex("none");
      setReName("");
    } else {
      changeExpandedId(index._id);
      setContent("rename");
    }
  };

  const prevItemLevel =
    prevItemIndex === null ? -1 : indexSetInfo.indexes[prevItemIndex].level;
  const chagneIndexLevel = (direction) => {
    onFinishChangeLevel(direction, index._id, indexSetInfo._id);
  };

  return (
    <>
      <tr className="border-b border-collapse border-b-gray-200">
        <td
          className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"
          onClick={toggleToExpandForAdding}
        >
          {expandedId === index._id && content === "add" ? (
            <span className="text-blue-500">접기</span>
          ) : (
            <Button
              size="small"
              shape="circle"
              type="text"
              icon={<PlusOutlined />}
            />
          )}
        </td>

        <td className="border-r border-collapse border-r-gray-200">
          <div className="flex justify-center items-center gap-2 text-[18px]">
            <div
              className="flex justify-end w-full item-center"
              onClick={() => {
                chagneIndexLevel("left");
              }}
            >
              <Button
                disabled={index.level === 1}
                shape="circle"
                size="small"
                type="text"
                icon={<ArrowLeftOutlined />}
              />
            </div>

            <div
              className="flex w-full item-center"
              onClick={() => {
                chagneIndexLevel("right");
              }}
            >
              <Button
                disabled={
                  prevItemLevel === -1 ||
                  index.level === prevItemLevel + 1 ||
                  index.level === 3
                }
                shape="circle"
                size="small"
                type="text"
                icon={<ArrowRightOutlined />}
              />
            </div>
          </div>
        </td>

        <td className="text-[1rem] border-r border-collapse border-r-gray-200">
          <div className="flex items-center">
            <div
              className={`${
                index.level === 1
                  ? "pl-0"
                  : index.level === 2
                  ? "pl-2"
                  : index.level === 3
                  ? "pl-4"
                  : ""
              }`}
            >
              <div className="w-[18px] h-[18px] relative">
                <Image
                  src={`/image/svg/level${index.level}.svg`}
                  layout="fill"
                  alt={"starRate"}
                />
              </div>
            </div>
            <div className="truncate">
              {index.level}
              {index.name}
            </div>
          </div>
        </td>

        <td
          className="text-[1rem] py-[4px] text-center"
          onClick={toggleToExpandForRenaming}
        >
          {expandedId === index._id && content === "rename" ? (
            <span className="text-blue-500">접기</span>
          ) : (
            <Button
              size="small"
              shape="circle"
              type="text"
              icon={<EditOutlined />}
            />
          )}
        </td>
        <td
          className="text-[1rem] py-[4px] text-center"
          onClick={toggleToExpandForDeleting}
        >
          {expandedId === index._id && content === "delete" ? (
            <span className="text-blue-500">접기</span>
          ) : (
            <Button
              disabled={indexSetInfo.indexes.length === 1}
              size="small"
              shape="circle"
              type="text"
              icon={<DeleteOutlined />}
            />
          )}
        </td>
      </tr>
      {expandedId === index._id && (
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="py-3" colSpan={5}>
            {content === "add" && (
              <div className="flex w-full gap-2">
                <Input
                  size="small"
                  className="w-full"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  ref={addNewIndexInputRef}
                />
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    changeExpandedId("");
                    setName("");
                    onFinish({
                      name,
                      current_index_id: index._id,
                      indexset_id: indexSetInfo._id,
                    });
                  }}
                >
                  추가
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    changeExpandedId("");
                    setName("");
                  }}
                >
                  취소
                </Button>
              </div>
            )}
            {content === "rename" && (
              <div className="flex w-full gap-2">
                <Input
                  size="small"
                  className="w-full"
                  defaultValue={index.name}
                  onChange={(e) => {
                    setReName(e.target.value);
                  }}
                  ref={renameInputRef}
                />
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    changeExpandedId("");
                    setReName("");
                    onFinishRename({
                      name: rename,
                      current_index_id: index._id,
                      indexset_id: indexSetInfo._id,
                    });
                  }}
                >
                  수정
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    changeExpandedId("");
                    setReName("");
                  }}
                >
                  취소
                </Button>
              </div>
            )}
            {content === "delete" && (
              <div className="flex flex-col gap-1">
                <div className="text-base text-gray-700">
                  카드를 옮길 목차를 선택해주세요.
                </div>

                <Select
                  size="small"
                  className="w-full"
                  value={indexForCardsInDeletedIndex}
                  onChange={(_index) => {
                    setIndexForCardsInDeletedIndex(_index);
                  }}
                  optionLabelProp="label"
                  ref={deleteIndexesSelectorRef}
                  onFocus={turnOffPopConfirm}
                >
                  {indexSetInfo.indexes
                    .filter((_index) => _index._id !== index._id)
                    .map((item) => (
                      <Select.Option
                        key={item._id}
                        value={item._id}
                        label={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                  <Select.Option value="none" label="목차 선택 안됨">
                    목차 선택 안함
                  </Select.Option>
                </Select>
                <div className="flex justify-end w-full gap-2">
                  <Button
                    size="small"
                    onClick={() => {
                      changeExpandedId("");
                      setIndexForCardsInDeletedIndex(null);
                    }}
                  >
                    취소
                  </Button>
                  <Popconfirm
                    title={
                      <div>
                        <div className="text-base">
                          해당 목차의 카드가 삭제됩니다.
                        </div>
                        <div className="text-lg font-medium">
                          정말 진행하시겠습니까?
                        </div>
                      </div>
                    }
                    visible={popconfirmVisible}
                    okText={"삭제"}
                    okButtonProps={{
                      danger: true,
                    }}
                    cancelText="취소"
                    onConfirm={async () => {
                      await onFinishIndexDelete({
                        moveto_index_id: null,
                        current_index_id: index._id,
                        indexset_id: indexSetInfo._id,
                      });
                      changePopconfirmVisible(false);
                      changeExpandedId("");
                    }}
                    onCancel={() => {
                      changePopconfirmVisible(false);
                      deleteIndexesSelectorRef.current.focus();
                    }}
                    placement="topRight"
                  >
                    <Button
                      size="small"
                      type="primary"
                      danger
                      onClick={async () => {
                        if (indexForCardsInDeletedIndex === "none") {
                          changePopconfirmVisible(true);
                          return;
                        }

                        await onFinishIndexDelete({
                          moveto_index_id: indexForCardsInDeletedIndex,
                          current_index_id: index._id,
                          indexset_id: indexSetInfo._id,
                        });
                        changeExpandedId("");
                        setIndexForCardsInDeletedIndex(null);
                      }}
                    >
                      삭제
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

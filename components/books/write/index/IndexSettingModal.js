import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space, Select } from "antd";
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

const StyledModal = styled(Modal)`
  min-width: 340px;
  & .ant-modal-body {
    padding: 8px 8px 8px 8px;
`;

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
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleToExpandForAdding = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setName("");
    } else {
      setIsExpanded(true);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-collapse border-y border-y-gray-200">
              <th
                className="text-[1rem] bg-slate-100 w-[30px]"
                onClick={toggleToExpandForAdding}
              >
                <Button
                  size="small"
                  shape="circle"
                  type="text"
                  icon={<PlusOutlined />}
                />
              </th>
              <th className="text-[1rem] bg-slate-100 w-[24%]">레벨변경</th>
              <th className="text-[1rem] bg-slate-100">목차명</th>
              <th className="text-[1rem] bg-slate-100 w-[10%]"></th>
              <th className="text-[1rem] bg-slate-100 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {isExpanded && (
              <tr className="border-b border-collapse border-b-gray-200">
                <td colSpan={5}>
                  <div className="w-full flex gap-2">
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
                        setIsExpanded(false);
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
                        setIsExpanded(false);
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [rename, setReName] = useState("");
  const [indexForCardsInDeletedIndex, setIndexForCardsInDeletedIndex] =
    useState("");
  const [content, setContent] = useState("");

  const toggleToExpandForAdding = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setName("");
      setContent("");
    } else {
      setIsExpanded(true);
      setContent("add");
    }
  };

  const toggleToExpandForDeleting = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setContent("");
    } else {
      setIsExpanded(true);
      setContent("delete");
    }
  };
  const toggleToExpandForRenaming = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setName("");
      setContent("");
    } else {
      setIsExpanded(true);
      setContent("rename");
    }
  };

  const prevItemLevel =
    prevItemIndex === null ? -1 : indexSetInfo.indexes[prevItemIndex].level;
  const chagneIndexLevel = (direction) => {
    onFinishChangeLevel(direction, index._id, indexSetInfo._id);
  };

  const isSome = () => {};

  return (
    <>
      <tr className="border-b border-collapse border-b-gray-200">
        <td
          className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"
          onClick={toggleToExpandForAdding}
        >
          <Button
            size="small"
            shape="circle"
            type="text"
            icon={<PlusOutlined />}
          />
        </td>

        <td className="border-r border-collapse border-r-gray-200">
          <div className="flex justify-center items-center gap-2 text-[18px]">
            <div
              className="flex justify-end w-full item-center"
              onClick={() => {
                chagneIndexLevel("up");
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
                chagneIndexLevel("down");
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
          <Button
            size="small"
            shape="circle"
            type="text"
            icon={<EditOutlined />}
          />
        </td>
        <td
          className="text-[1rem] py-[4px] text-center"
          onClick={toggleToExpandForDeleting}
        >
          <Button
            size="small"
            shape="circle"
            type="text"
            icon={<DeleteOutlined />}
          />
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-collapse border-b-gray-200">
          <td colSpan={5}>
            {content === "add" && (
              <div className="w-full flex gap-2">
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
                    setIsExpanded(false);
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
                    setIsExpanded(false);
                    setName("");
                  }}
                >
                  취소
                </Button>
              </div>
            )}
            {content === "rename" && (
              <div className="w-full flex gap-2">
                <Input
                  size="small"
                  className="w-full"
                  defaultValue={index.name}
                  onChange={(e) => {
                    setReName(e.target.value);
                  }}
                />
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setIsExpanded(false);
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
                    setIsExpanded(false);
                    setReName("");
                  }}
                >
                  취소
                </Button>
              </div>
            )}
            {content === "delete" && (
              <div className="w-full flex gap-2">
                <Select
                  size="small"
                  className="w-full"
                  placeholder="카드를 옮길 목차를 선택하세요"
                  onChange={(_index) => {
                    setIndexForCardsInDeletedIndex(_index);
                  }}
                >
                  {indexSetInfo.indexes
                    .filter((_index) => _index._id !== index._id)
                    .map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setIsExpanded(false);
                    setName("");
                    onFinishIndexDelete({
                      moveto_index_id: indexForCardsInDeletedIndex,
                      current_index_id: index._id,
                      indexset_id: indexSetInfo._id,
                    });
                  }}
                >
                  삭제
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setIsExpanded(false);
                    setName("");
                  }}
                >
                  취소
                </Button>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

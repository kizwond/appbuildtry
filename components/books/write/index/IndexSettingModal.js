import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space, Select } from "antd";
import {
  AreaChartOutlined,
  PlusOutlined,
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
  onFinishExcelExport,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
              <th className="text-[1rem] bg-slate-100 w-[30%]">목차명</th>
              <th className="text-[1rem] bg-slate-100 w-[10%]">이름변경</th>
              <th className="text-[1rem] bg-slate-100 w-[20%]">좌</th>
              <th className="text-[1rem] bg-slate-100 w-[10%]">삭제</th>
              <th className="text-[1rem] bg-slate-100 w-[10%]">추가</th>
            </tr>
          </thead>
          <tbody>
            {indexinfo.map((index) => (
              <tr
                key={index._id}
                className="border-b border-collapse border-b-gray-200"
              >
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                  {index.name}
                </td>
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                  <Button
                    size="small"
                    shape="circle"
                    icon={<AreaChartOutlined />}
                  />
                </td>
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
                <td className="text-[1rem] py-[4px] text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </StyledModal>
    </>
  );
};

/* {indexinfo.map((item, i) => (
          <IndexList
            key={i}
            indexinfo={indexinfo}
            indexSetInfo={indexSetInfo}
            onFinish={onFinish}
            index={item}
            onFinishRename={onFinishRename}
            onFinishChangeLevel={onFinishChangeLevel}
            onFinishIndexDelete={onFinishIndexDelete}
            onFinishExcelExport={onFinishExcelExport}
          />
        ))} */

const IndexList = ({
  indexinfo,
  index,
  onFinish,
  onFinishRename,
  indexSetInfo,
  onFinishChangeLevel,
  onFinishIndexDelete,
  onFinishExcelExport,
}) => {
  const [newInput, setNewInput] = useState(false);
  const [renameInput, setRenameInput] = useState(false);
  const [deleteInput, setDeleteInput] = useState(false);

  const createIndex = (indexset_id, current_index_id, current_level) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        current_level: current_level,
        indexset_id: indexset_id,
      }}
      onFinish={onFinish}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["name"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name={["current_index_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item
          name={["current_level"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={current_level} />
        </Form.Item>
        <Form.Item
          name={["indexset_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={indexset_id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button
            size="small"
            type="primary"
            onClick={() => setNewInput(false)}
            htmlType="submit"
            style={{ fontSize: "0.8rem" }}
          >
            완료
          </Button>
          <Button
            size="small"
            onClick={() => setNewInput(false)}
            style={{ fontSize: "0.8rem" }}
          >
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );

  const renameIndex = (indexset_id, current_index_id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        indexset_id: indexset_id,
      }}
      onFinish={onFinishRename}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["name"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item
          name={["current_index_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item
          name={["indexset_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={indexset_id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button
            size="small"
            type="primary"
            onClick={() => setRenameInput(false)}
            htmlType="submit"
            style={{ fontSize: "0.8rem" }}
          >
            완료
          </Button>
          <Button
            size="small"
            onClick={() => setRenameInput(false)}
            style={{ fontSize: "0.8rem" }}
          >
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );

  if (indexinfo) {
    var optionList = indexinfo.map((item) => {
      if (item._id === index._id) {
        return null;
      } else {
        return (
          <React.Fragment key={item._id}>
            <Select.Option value={item._id}>{item.name}</Select.Option>
          </React.Fragment>
        );
      }
    });
  }

  const deleteIndex = (indexset_id, current_index_id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        indexset_id: indexset_id,
      }}
      onFinish={onFinishIndexDelete}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["moveto_index_id"]} rules={[{ required: false }]}>
          <Select style={{ width: 120 }}>
            <Select.Option value="default">목차선택</Select.Option>
            {optionList}
          </Select>
        </Form.Item>
        <Form.Item
          name={["current_index_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item
          name={["indexset_id"]}
          hidden={true}
          rules={[{ required: true }]}
        >
          <Input placeholder={indexset_id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button
            size="small"
            type="primary"
            onClick={() => setDeleteInput(false)}
            htmlType="submit"
            style={{ fontSize: "0.8rem" }}
          >
            완료
          </Button>
          <Button
            size="small"
            onClick={() => setDeleteInput(false)}
            style={{ fontSize: "0.8rem" }}
          >
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
  const levelChange = (direction, current_level) => {
    const prevItemIndex =
      indexinfo.findIndex((item) => item._id === index._id) - 1;
    if (prevItemIndex !== -1) {
      const prevItemLevel = indexinfo[prevItemIndex].level;
      if (current_level === 1 && direction === "up") {
        alert("1레벨짜리를 왜 0으로 만들라그랴");
      } else if (current_level === prevItemLevel + 1 && direction === "down") {
        alert("왜 부모없이 2레벨을 건너뛰냐");
      } else {
        onFinishChangeLevel(direction, index._id, indexSetInfo._id);
      }
    } else {
      alert("최상위 목차레벨변동 없어야지");
    }
  };

  const excelExportHandler = (value) => {
    onFinishExcelExport(value);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          listStyle: "none",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "0",
        }}
      >
        <div>
          <Popover
            placement="rightTop"
            title={
              <span style={{ fontSize: "0.8rem" }}>
                새로운 목차의 이름을 입력해 주세요.
              </span>
            }
            visible={newInput}
            content={createIndex(indexSetInfo._id, index._id, index.level)}
            trigger="click"
          >
            <PlusOutlined
              onClick={() => setNewInput(true)}
              style={{ fontSize: "1rem" }}
            />
          </Popover>
        </div>
        <div style={{ fontSize: "0.8rem" }}>
          {index.name}, level : {index.level}
        </div>
        <div>
          <Popover
            placement="rightTop"
            title={
              <span style={{ fontSize: "0.8rem" }}>
                변경할 목차 이름을 입력해 주세요.
              </span>
            }
            visible={renameInput}
            content={renameIndex(indexSetInfo._id, index._id)}
            trigger="click"
          >
            <Button
              size="small"
              onClick={() => setRenameInput(true)}
              style={{ fontSize: "0.8rem" }}
            >
              이름변경
            </Button>
          </Popover>
        </div>
        <div>
          <Button
            size="small"
            onClick={() => levelChange("up", index.level)}
            style={{ fontSize: "0.8rem" }}
          >
            좌
          </Button>
          <Button
            size="small"
            onClick={() => levelChange("down", index.level)}
            style={{ fontSize: "0.8rem" }}
          >
            우
          </Button>
        </div>
        <div>
          <Popover
            placement="rightTop"
            title={
              <span style={{ fontSize: "0.8rem" }}>
                삭제후 카드를 이동할 목차를 선택해주세요.
              </span>
            }
            visible={deleteInput}
            content={deleteIndex(indexSetInfo._id, index._id)}
            trigger="click"
          >
            <Button
              size="small"
              onClick={() => setDeleteInput(true)}
              style={{ fontSize: "0.8rem" }}
            >
              삭제
            </Button>
          </Popover>
        </div>
        {/* <div>
            <Button size="small" icon={<Image src="/image/export_excel.png" width={"24px"} height={"24px"} alt="excel_export" />} onClick={() => excelExportHandler(index._id)} style={{border:"none", marginTop:"3px"}}></Button>
        </div> */}
      </div>
    </>
  );
};

export default IndexSettingModal;

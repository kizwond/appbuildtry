import { EditFilled } from "@ant-design/icons";
import { Button, Col, Input, Row, Table, Tag } from "antd";
import { useEffect, useRef, useState } from "react";

const M_MenteeGroupTable = ({ menteeGroup }) => {
  const inputRefs = useRef({});
  const [inputValues, setInputValues] = useState({});
  const [activedInput, setActivedInput] = useState("");

  useEffect(() => {
    let inialValues = {};
    menteeGroup.forEach((group) => {
      inialValues[group._id] = group.name;
    });
    setInputValues(inialValues);
  }, [menteeGroup]);

  var focusInput;
  return (
    <>
      <Table
        size="small"
        pagination={false}
        dataSource={menteeGroup.map((group) => ({ ...group, key: group._id }))}
        bordered={false}
        columns={[
          {
            title: "그룹명",
            dataIndex: "name",
            render: function menteeGroupElement(value, record, index) {
              return (
                <>
                  <Row>
                    <Col span={activedInput.includes(record._id) ? 17 : 12}>
                      <Input
                        ref={(ref) => (inputRefs.current[record._id] = ref)}
                        size="small"
                        value={inputValues[record._id]}
                        onChange={(e) => setInputValues({ ...inputValues, [record._id]: e.target.value })}
                        bordered={activedInput.includes(record._id)}
                        disabled={!activedInput.includes(record._id)}
                      />
                    </Col>
                    <Col
                      span={activedInput.includes(record._id) ? 7 : 3}
                      onClick={() => {
                        if (!activedInput.includes(record._id)) {
                          clearTimeout(focusInput);
                          setActivedInput(record._id);
                          focusInput = setTimeout(() => inputRefs.current[record._id].focus(), 100);
                        }
                      }}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {!activedInput.includes(record._id) ? (
                        <EditFilled style={{ fontSize: "1.1rem" }} />
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div
                            onClick={() => {
                              setActivedInput("");
                              // 서버요청보내야함
                            }}
                          >
                            <Tag>수정</Tag>
                          </div>
                          <div
                            onClick={() => {
                              setActivedInput("");
                              setInputValues({ ...inputValues, [record._id]: value });
                            }}
                          >
                            <Tag>취소</Tag>
                          </div>
                        </div>
                      )}
                    </Col>
                    <Col span={activedInput.includes(record._id) ? 0 : 6}>상하이동</Col>
                    <Col span={activedInput.includes(record._id) ? 0 : 3}>삭제</Col>
                  </Row>
                </>
              );
            },
          },
          // {
          //   title: "그룹명 변경",
          //   align: "center",
          //   width: 0,
          //   colSpan: 0,
          //   onCell: (record, rowIndex) => {
          //     return {
          //       onClick: (event) => {}, // click row
          //       onDoubleClick: (event) => {}, // double click row
          //       onContextMenu: (event) => {}, // right button click row
          //       onMouseEnter: (event) => {}, // mouse enter row
          //       onMouseLeave: (event) => {}, // mouse leave row
          //     };
          //   },
          // },
          // {
          //   title: "상하 이동",
          //   align: "center",
          //   width: "30%",
          // },
          // {
          //   title: "삭제",
          //   align: "center",
          //   width: "15%",
          // },
        ]}
      />
    </>
  );
};

export default M_MenteeGroupTable;

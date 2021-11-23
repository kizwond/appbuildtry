import { Col, Input, Row, Table } from "antd";
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
        dataSource={menteeGroup}
        bordered={false}
        columns={[
          {
            title: "그룹명",
            dataIndex: "name",
            width: "35%",
            render: function menteeGroupElement(value, record, index) {
              return (
                <>
                  <Row>
                    <Col span={9}>
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
                      span={5}
                      onClick={() => {
                        if (activedInput.includes(record._id)) {
                          setActivedInput("");
                          console.log(inputRefs);
                        } else {
                          clearTimeout(focusInput);
                          setActivedInput(record._id);
                          focusInput = setTimeout(() => inputRefs.current[record._id].focus(), 100);
                        }
                      }}
                    >
                      이름
                    </Col>
                    <Col span={6}>상하이동</Col>
                    <Col span={4}>삭제</Col>
                  </Row>
                </>
              );
            },
          },
          // {
          //   title: "그룹명 변경",
          //   align: "center",
          //   width: "15%",
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

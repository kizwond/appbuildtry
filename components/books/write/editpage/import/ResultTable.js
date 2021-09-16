import { Table, Tag, Space } from "antd";

const ResultTable = ({ inspectResultNormal, inspectResultTypeError, inspectResultFlagError }) => {
  const columns = [
    {
      title: "row",
      dataIndex: "row",
      key: "row",
    },
    {
      title: "cardtype",
      dataIndex: "cardtype",
      key: "cardtype",
    },
    {
      title: "maker_flag",
      dataIndex: "maker_flag",
      key: "maker_flag",
    },
    {
      title: "face1",
      dataIndex: "face1",
      key: "face1",
    },
    {
      title: "face2",
      dataIndex: "face2",
      key: "face2",
    },
    {
      title: "annotation",
      dataIndex: "annotation",
      key: "annotation",
    },
  ];
  if (inspectResultNormal) {
    var dataSource = inspectResultNormal.map((item) => {
      return { row: item.row, cardtype: item.cardtype, maker_flag: item.maker_flag, face1: item.face1, face2: item.face2, annotation: item.annotation };
    });
  }
  if (inspectResultTypeError) {
    var dataSource2 = inspectResultTypeError.map((item) => {
      return { row: item.row, cardtype: item.cardtype, maker_flag: item.maker_flag, face1: item.face1, face2: item.face2, annotation: item.annotation };
    });
  }
  if (inspectResultFlagError) {
    var dataSource3 = inspectResultFlagError.map((item) => {
      return { row: item.row, cardtype: item.cardtype, maker_flag: item.maker_flag, face1: item.face1, face2: item.face2, annotation: item.annotation };
    });
  }
  return (
    <>
      <h3>정상</h3>
      <Table dataSource={dataSource} columns={columns} />
      <h3>타입에러</h3>
      <Table dataSource={dataSource2} columns={columns} />
      <h3>플래그에러</h3>
      <Table dataSource={dataSource3} columns={columns} />
    </>
  );
};

export default ResultTable;

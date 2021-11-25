import React, { useState } from "react";
import { Modal, Space, Select, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadExcelFile, ImportExcelFile, CancelImport, InspectTargetSheet } from "../../../../../graphql/query/excelUpload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import ResultTable from "./ResultTable";

const { Option } = Select;

const ImportModal = ({ indexList, cardSetId }) => {
  const [file, setFile] = useState(null);
  const [visiable, setVisiable] = useState(null);
  const [newFileName, setNewFileName] = useState(null);
  const [sheetList, setSheetList] = useState(null);
  const [sheetSelected, setSheetSelected] = useState(null);
  const [indexSelected, setIndexSelected] = useState(null);
  const [inspectResultNormal, setInspectResultNormal] = useState();
  const [inspectResultTypeError, setInspectResultTypeError] = useState();
  const [inspectResultFlagError, setInspectResultFlagError] = useState();

  const [cardset_saveAndExtractSheetList, { loading, data }] = useMutation(UploadExcelFile, { onCompleted: showdata });
  const [cardset_inspectTargetSheet, { loading: loading4, data: data4 }] = useMutation(InspectTargetSheet, { onCompleted: showdata4 });
  const [cardset_confirmMakeCard, { loading: loading2, data: data2 }] = useMutation(ImportExcelFile, { onCompleted: showdata2 });
  const [cardset_cancelImportExcelFile, { loading: loading3, data: data3 }] = useMutation(CancelImport, { onCompleted: showdata3 });

  const showModal = () => {
    setVisiable(true);
  };

  const handleOk = () => {
    setVisiable(false);
  };

  const handleCancel = () => {
    setVisiable(false);
  };

  function showdata(data) {
    console.log("response after file upload :", data);
    setNewFileName(data.cardset_saveAndExtractSheetList.filename);
    setSheetList(data.cardset_saveAndExtractSheetList.sheetList);
    // setInspectResultNormal(data.cardset_saveAndExtractSheetList.inspectionResult.normal);
    // setInspectResultTypeError(data.cardset_saveAndExtractSheetList.inspectionResult.cardtypeErr);
    // setInspectResultFlagError(data.cardset_saveAndExtractSheetList.inspectionResult.makerflagErr);
  }
  if (sheetList) {
    var disabled = false;
    var sheet_list = sheetList.map((item, index) => {
      return (
        <>
          <Option value={index + 1}>{item.name}</Option>
        </>
      );
    });
  } else {
    disabled = true;
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
    setSheetSelected(value);
  }

  if (indexList) {
    var index_disabled = false;
    var index_list = indexList.map((item, index) => {
      return (
        <>
          <Option value={item._id}>{item.name}</Option>
        </>
      );
    });
  } else {
    index_disabled = true;
  }
  function index_handleChange(value) {
    console.log(`selected ${value}`);
    setIndexSelected(value);
  }

  //검토요청부분
  function showdata4(data) {
    console.log("inpection results :", data);
  }
  async function sheetConfirm(mybook_id) {
    console.log(file);
    try {
      await cardset_inspectTargetSheet({
        variables: {
          forInspectTargetSheet: {
            mybook_id: mybook_id,
            filename: newFileName,
            sheetOrder: sheetSelected,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onClickSheetList = () => {
    const mybook_id = localStorage.getItem("book_id");
    sheetConfirm(mybook_id);
  };

  //asdfasdfasdf

  async function uploadfile(mybook_id) {
    console.log(file);
    try {
      await cardset_saveAndExtractSheetList({
        variables: {
          forSaveAndExtractSheetList: {
            file: file,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const uplodeFile = (event) => {
    const mybook_id = localStorage.getItem("book_id");
    uploadfile(mybook_id);
  };

  function showdata2(data2) {
    console.log("response after file upload :", data2);
    setFile("");
    setNewFileName(null);
    setInspectResultNormal("");
    setInspectResultTypeError("");
    setInspectResultFlagError("");
    alert("업로드 완료");
    setVisiable(false);
  }

  async function importfile(mybook_id, cardSetId) {
    console.log(file);
    try {
      await cardset_confirmMakeCard({
        variables: {
          forConfirmMakeCard: {
            mybook_id: mybook_id,
            index_id: indexSelected,
            filename: newFileName,
            sheetOrder: sheetSelected,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const importFile = () => {
    const mybook_id = localStorage.getItem("book_id");
    importfile(mybook_id, cardSetId);
  };

  function showdata3(data3) {
    console.log("cancel import :", data3);
    setFile("");
    setNewFileName(null);
    setInspectResultNormal("");
    setInspectResultTypeError("");
    setInspectResultFlagError("");
    alert("업로드 취소");
    setVisiable(false);
  }

  async function cancelimport() {
    try {
      await cardset_cancelImportExcelFile({
        variables: {
          filename: newFileName,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const cancelImport = (event) => {
    cancelimport();
  };

  return (
    <>
      <div onClick={showModal} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <UploadOutlined style={{ fontSize: "1.3rem" }} onClick={showModal} />
        엑셀임포트
      </div>

      <Modal footer={null} title="엑셀 임포트" width={800} visible={visiable} onOk={handleOk} onCancel={handleCancel}>
        <Space direction="vertical">
          <div>
            <div style={{ marginBottom: "10px" }}>
              <form action="#">
                <input
                  type="file"
                  name="map"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFile(file);
                  }}
                />
              </form>
            </div>
            <Button size="small" onClick={uplodeFile} style={{ fontSize: "0.8rem" }}>
              파일업로드
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Select size="small" defaultValue="default" style={{ width: "70%", fontSize: "0.8rem" }} onChange={handleChange} disabled={disabled}>
              <Option value="default" style={{ fontSize: "0.8rem" }}>
                sheet 선택
              </Option>
              {sheet_list}
            </Select>
            <Button size="small" onClick={onClickSheetList} disabled={disabled} style={{ fontSize: "0.8rem" }}>
              검토요청
            </Button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Select size="small" defaultValue="default" style={{ width: "70%", fontSize: "0.8rem" }} onChange={index_handleChange} disabled={index_disabled}>
              <Option value="default" style={{ fontSize: "0.8rem" }}>
                목차 선택
              </Option>
              {index_list}
            </Select>
            <Button size="small" onClick={importFile} disabled={index_disabled} style={{ fontSize: "0.8rem" }}>
              카드생성
            </Button>
          </div>
          <div>
            {/* <div>파일검토결과</div>
          <div>
            <ResultTable inspectResultNormal={inspectResultNormal} inspectResultTypeError={inspectResultTypeError} inspectResultFlagError={inspectResultFlagError} />
          </div> */}
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default ImportModal;

import React, { Component, useState } from "react";
import { Modal, Button, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { UploadExcelFile, ImportExcelFile, CancelImport, InspectTargetSheet } from "../../../../../graphql/query/excelUpload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import ResultTable from "./ResultTable";

const { Option } = Select;

const ImportModal = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId }) => {
  const [file, setFile] = useState(null);
  const [visiable, setVisiable] = useState(null);
  const [newFileName, setNewFileName] = useState(null);
  const [sheetList, setSheetList] = useState(null);
  const [sheetSelected, setSheetSelected] = useState(null);
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
    var sheet_list = sheetList.map((item, index) => {
      return (
        <>
        <Option value={index}>{item.name}</Option>
        </>
      );
    });
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
    setSheetSelected(value)
  }

  //asdfasdfasdfasdf
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
            sheetOrder : sheetSelected
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
            mybook_id: mybook_id,
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
            cardset_id: cardSetId,
            filename: newFileName,
            sheetOrder:sheetSelected
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const importFile = (event) => {
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
      <Button type="default" size="small" onClick={showModal}>
        <span style={{ fontSize: "0.8rem" }}>import</span>
        <DownloadOutlined />
      </Button>
      <Modal footer={null} title="Basic Modal" width={800} visible={visiable} onOk={handleOk} onCancel={handleCancel}>
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
        <Button size="small" onClick={uplodeFile}>
          파일업로드
        </Button>
        <div>
          <Select defaultValue="default" style={{ width: 120 }} onChange={handleChange}>
            <Option value="default">sheet 선택</Option>
            {sheet_list}
          </Select>
          <button onClick={onClickSheetList}>확인</button>
          
        </div>
        <div>
          <div>파일검토결과</div>
          <Button size="small" onClick={importFile}>
            최종업로드
          </Button>
          <Button size="small" onClick={cancelImport}>
            업로드취소
          </Button>
          <div>
            <ResultTable inspectResultNormal={inspectResultNormal} inspectResultTypeError={inspectResultTypeError} inspectResultFlagError={inspectResultFlagError} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImportModal;

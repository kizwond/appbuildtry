import React, { Component, useState } from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { UploadExcelFile, ImportExcelFile, CancelImport } from "../../../../../graphql/query/excelUpload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import ResultTable from "./ResultTable";

const ImportModal = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId }) => {
  const [file, setFile] = useState(null);
  const [visiable, setVisiable] = useState(null);
  const [newFileName, setNewFileName] = useState(null);
  const [inspectResultNormal, setInspectResultNormal] = useState();
  const [inspectResultTypeError, setInspectResultTypeError] = useState();
  const [inspectResultFlagError, setInspectResultFlagError] = useState();

  const [cardset_inspectExcelFileToImport, { loading, data }] = useMutation(UploadExcelFile, { onCompleted: showdata });
  const [cardset_importExcelFile, { loading: loading2, data:data2 }] = useMutation(ImportExcelFile, { onCompleted: showdata2 });
  const [cardset_cancelImportExcelFile, { loading: loading3, data:data3 }] = useMutation(CancelImport, { onCompleted: showdata3 });

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
    setNewFileName(data.cardset_inspectExcelFileToImport.filename);
    setInspectResultNormal(data.cardset_inspectExcelFileToImport.inspectionResult.normal);
    setInspectResultTypeError(data.cardset_inspectExcelFileToImport.inspectionResult.cardtypeErr);
    setInspectResultFlagError(data.cardset_inspectExcelFileToImport.inspectionResult.makerflagErr);
  }

  async function uploadfile(mybook_id) {
    console.log(file);
    try {
      await cardset_inspectExcelFileToImport({
        variables: {
          forInspectExcelFile: {
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
    setFile('')
    setNewFileName(null)
    setInspectResultNormal('');
    setInspectResultTypeError('');
    setInspectResultFlagError('');
    alert("업로드 완료")
    setVisiable(false)
  }

  async function importfile(mybook_id, cardSetId) {
    console.log(file);
    try {
      await cardset_importExcelFile({
        variables: {
          forImportExcelFile: {
            mybook_id: mybook_id,
            cardset_id: cardSetId,
            filename: newFileName,
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
    setFile('')
    setNewFileName(null)
    setInspectResultNormal('');
    setInspectResultTypeError('');
    setInspectResultFlagError('');
    alert("업로드 취소")
    setVisiable(false)
  }

  async function cancelimport() {
    try {
      await cardset_cancelImportExcelFile({
        variables: {
          filename: newFileName
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
        import <DownloadOutlined />
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

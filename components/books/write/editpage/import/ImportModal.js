import React, { Component, useState } from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { UploadExcelFile } from "../../../../../graphql/query/excelUpload";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

const ImportModal = ({ cardTypes, cardTypeInfo, cardSetId, indexChanged, indexSetId }) => {
  const [file, setFile] = useState(null);
  const [visiable, setVisiable] = useState(null);
  const [cardset_inspectExcelFileToImport, { loading }] = useMutation(UploadExcelFile, { onCompleted: showdata });

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
  }

  async function uploadfile(data, mybook_id, indexChanged, cardSetId, indexSetId) {
    console.log(file);
    try {
      await cardset_inspectExcelFileToImport({
        variables:{
          forInspectExcelFile: {
            mybook_id: mybook_id,
            indexset_id: indexSetId,
            index_id: indexChanged,
            cardset_id: cardSetId,
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
    console.log(file);
    const data = new FormData();
    data.append("0", file);
    data.append("mybook_id", mybook_id);
    // data.append("index_id", indexChanged);
    // data.append("cardset_id", cardSetId);
    // data.append("indexset_id", indexSetId);
    console.log(mybook_id);
    console.log(indexChanged);
    console.log(cardSetId);
    console.log(indexSetId);
    console.log(data);
    uploadfile(data, mybook_id, indexChanged, cardSetId, indexSetId);

    // axios
    //   .post("/api/cardset_inspectExcelFileToImport", data)
    //   .then((res) => {
    //     alert(res.data.msg);
    //     this.setState({
    //       file: "",
    //     });
    //   })
    //   .catch((err) => console.log(err));
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
      </Modal>
    </>
  );
};

export default ImportModal;

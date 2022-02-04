import React, { useState, forwardRef } from "react";
import { message, Upload } from "antd";
import { useMutation } from "@apollo/client";
import { MUTATION_UPLOAD_BOOKCOVER } from "../../graphql/mutation/candidateBook";

const UploadBookcover = forwardRef(function UploadName(props, ref) {
  const [uploadCover] = useMutation(MUTATION_UPLOAD_BOOKCOVER);
  const dummyRequest = async ({ file, onSuccess }) => {
    uploadCover({
      variables: {
        forUploadBookCover: {
          file,
        },
      },
    })
      .then((res) => {
        if (res.data.candibook_uploadBookCover.status === "200") {
          console.log({ res });
          ref(res.data.candibook_uploadBookCover.data1);
          onSuccess("ok");
        }
      })
      .catch((err) => console.log("에러 발생", err));
  };
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(() => newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const isImage =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/apng" ||
      file.type === "image/avif" ||
      file.type === "image/gif" ||
      file.type === "image/svg+xml" ||
      file.type === "image/webp";
    if (!isImage) {
      message.error(`선택하신 ${file.name} 파일은 이미지 파일이 아닙니다`);
    }
    return isImage || Upload.LIST_IGNORE;
  };

  return (
    <div>
      <Upload
        customRequest={dummyRequest}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        maxCount={1}
        beforeUpload={beforeUpload}
      >
        {fileList.length === 0 ? "+ 표지 등록" : "표지 변경"}
      </Upload>
    </div>
  );
});

export default UploadBookcover;

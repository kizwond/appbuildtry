import React, { useState, forwardRef } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useMutation } from "@apollo/client";
import { MUTATION_UPLOAD_BOOKCOVER } from "../../graphql/mutation/candidateBook";

const UploadBookcover = forwardRef(function UploadName(props, ref) {
  const [uploadCover] = useMutation(MUTATION_UPLOAD_BOOKCOVER);
  const dummyRequest = async ({ file, onSuccess }) => {
    console.log({ file });
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

  return (
    <div>
      <ImgCrop rotate aspect={1 / 1.3}>
        <Upload
          customRequest={dummyRequest}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          maxCount={1}
        >
          {fileList.length === 0 ? "+ 표지 등록" : "표지 변경"}
        </Upload>
      </ImgCrop>
    </div>
  );
});

export default UploadBookcover;

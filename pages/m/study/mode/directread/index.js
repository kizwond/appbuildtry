import React, { useEffect, useState } from "react";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import dynamic from "next/dynamic";
import DirectReadContainer from "../../../../../components/books/study/mode/directread/DirectReadContainer";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
    ssr: false,
  });

const SessionSetting = () => {
  return (
    <>
      <StudyLayout>
        <div style={{ width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
            {/* <DirectReadContainer FroalaEditorView={FroalaEditorView}/> */}
        </div>
      </StudyLayout>
    </>
  );
};
export default SessionSetting;

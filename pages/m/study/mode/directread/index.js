import React, { useEffect, useState } from "react";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import dynamic from "next/dynamic";
import DirectReadContainer from "../../../../../components/books/study/mode/directread/DirectReadContainer";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
    ssr: false,
  });


const SessionSetting = () => {

    // const []
    // const hide = () => {
    //     const textSelected = getSelectionText();
    //     console.log(textSelected)
    
    //     var one = document.getElementById('temp');
    //     var sibling = one.previousSibling;
    //     var stringy = sibling.outerHTML
    //     console.log(sibling)
    //     console.log(stringy)
    //     const change = stringy.replace(textSelected, `<span style={{display:"none"}}>${textSelected}</span>`)
    //     console.log(change)
    //     var nodes = document.fromString(change);
    // }
    
    // function getSelectionText() {
    //     var text = "";
    //     if (window.getSelection) {
    //         text = window.getSelection().toString();
    //     } else if (document.selection && document.selection.type != "Control") {
    //         text = document.selection.createRange().text;
    //     }
    //     return text;
    // }

  return (
    <>
      <StudyLayout>
        <div style={{ width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
            {/* <DirectReadContainer FroalaEditorView={FroalaEditorView}/> */}
            {/* <div>hello there</div>
                {nodes}
            <button id="temp" onClick={hide}>버튼</button> */}
            hello
        </div>
      </StudyLayout>
    </>
  );
};
export default SessionSetting;

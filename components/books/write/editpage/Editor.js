import React, { Component } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/languages/ko";
import "froala-editor//css/themes/gray.css";
// import 'froala-editor//css/themes/gray.min.css'

import FroalaEditorComponent from "react-froala-wysiwyg";

import axios from "axios";
// import Button from "../../styledComponents/defaultButton";

// import { InputNumber } from 'antd'

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor1: "",
      editor2: "",
      editor3: "",
      editor4: "",
      editor5: "",
      editor6: "",
      editor7: "",
      editor8: "",
      editor9: "",
      editor10: "",
      editor11: "",
      editor12: "",
      editor13: "",
      editor14: "",
      editor15: "",
      editor16: "",
    };
  }

  handleModelChangeEditor1 = (model) => {
    console.log("editor1:", model);
    this.setState({
      editor1: model,
    });
  };
  handleModelChangeEditor2 = (model) => {
    console.log("editor2:", model);
    this.setState({
      editor2: model,
    });
  };
  handleModelChangeEditor3 = (model) => {
    console.log("editor3:", model);
    this.setState({
      editor3: model,
    });
  };
  handleModelChangeEditor4 = (model) => {
    console.log("editor4:", model);
    this.setState({
      editor4: model,
    });
  };

  handleModelChangeEditor5 = (model) => {
    console.log("editor5:", model);
    this.setState({
      editor5: model,
    });
  };

  handleModelChangeEditor6 = (model) => {
    console.log("editor6:", model);
    this.setState({
      editor6: model,
    });
  };

  handleModelChangeEditor7 = (model) => {
    console.log("editor7:", model);
    this.setState({
      editor7: model,
    });
  };

  handleModelChangeEditor8 = (model) => {
    console.log("editor8:", model);
    this.setState({
      editor8: model,
    });
  };

  handleModelChangeEditor9 = (model) => {
    console.log("editor9:", model);
    this.setState({
      editor9: model,
    });
  };

  handleModelChangeEditor10 = (model) => {
    console.log("editor10:", model);
    this.setState({
      editor10: model,
    });
  };

  handleModelChangeEditor11 = (model) => {
    console.log("editor11:", model);
    this.setState({
      editor11: model,
    });
  };

  handleModelChangeEditor12 = (model) => {
    console.log("editor12:", model);
    this.setState({
      editor12: model,
    });
  };

  handleModelChangeEditor13 = (model) => {
    console.log("editor13:", model);
    this.setState({
      editor13: model,
    });
  };

  handleModelChangeEditor14 = (model) => {
    console.log("editor14:", model);
    this.setState({
      editor14: model,
    });
  };

  handleModelChangeEditor15 = (model) => {
    console.log("editor15:", model);
    this.setState({
      editor15: model,
    });
  };
  handleModelChangeEditor16 = (model) => {
    console.log("editor16:", model);
    this.setState({
      editor16: model,
    });
  };

  handleSubmit = () => {
    console.log("onClick handleSubmit!!!!!");
    // console.log(this.state.editor1)
    // this.props.onFinish(this.state.editor1);
    const num_face1 = this.props.cardtype_info.num_of_row.face1;
    const num_face2 = this.props.cardtype_info.num_of_row.face2;
    console.log(num_face1);
    console.log(num_face2);
    const face1_array = [];
    const selection_array = [];
    const face2_array = [];
    const annotation_array = [];

    //읽기카드만 있을때
    if (num_face1 > 0 && num_face2 === 0) {
      for (var i = 1; i < num_face1 + 1; i++) {
        face1_array.push(this.state["editor" + i]);
      }
    }

    //뒤집기카드만 있을때
    if (num_face1 > 0 && num_face2 > 0) {
      for (i = 1; i < num_face1 + 1; i++) {
        face1_array.push(this.state["editor" + i]);
      }
      if (num_face2 > 0) {
        for (i = num_face1 + 1; i < num_face1 + num_face2 + 1; i++) {
          face2_array.push(this.state["editor" + i]);
        }
      }
    }
    console.log(face1_array);
    console.log(face2_array);
    const values = { face1: face1_array, face2: face2_array };
    this.props.onFinish(values);
  };

  render() {
    const config = {
      editorClass: "editor_try",
      quickInsertEnabled: false,
      imageUploadURL: "/api/cardset/imageUpload",
      fileUploadURL: "/api/cardset/fileUpload",
      saveParam: "content",
      width: "auto",
      theme: "gray",
      tabSpaces: 0,
      toolbarContainer: "#toolbarContainer",
      attribution: false,
      charCounterCount: false,
      language: "ko",
      toolbarButtons: [
        "fullscreen",
        "bold",
        "italic",
        "underline",
        "subscript",
        "superscript",
        "fontFamily",
        "fontSize",
        "color",
        "textColor",
        "align",
        "formatOL",
        "formatUL",
        "outdent",
        "indent",
        "insertLink",
        "insertImage",
        "insertVideo",
        "insertFile",
        "insertTable",
        "emoticons",
        "specialCharacters",
        "insertHR",
        "selectAll",
        "clearFormatting",
        "help",
        "html",
        "undo",
        "redo",
      ],
    };

    const editorList = this.props.nicks.map((item, index) => {
      return (
        <div key={index} style={{ display: "flex", marginTop: "5px", alignItems: "center" }}>
          <label className="editor_label" style={{ width: "80px" }}>
            {item}
          </label>
          <FroalaEditorComponent
            tag="textarea"
            config={config}
            model={this.state["editor" + (index + 1).toString()]}
            onModelChange={this["handleModelChangeEditor" + (index + 1).toString()]}
            width={100}
          />
        </div>
      );
    });

    return (
      <>
        <div id="editor" style={{ border: "1px solid black", borderRadius: "10px" }}>
          <div id="toolbarContainer"></div>
          <div style={{ padding: "10px" }}>{editorList}</div>
          <button onClick={this.handleSubmit} id="saveButton">
            저장
          </button>
          <button onClick={() => console.log("cancel clicked!!!")} id="cancelButton">
            취소
          </button>
        </div>
      </>
    );
  }
}

export default Editor;

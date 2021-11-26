import React, { Component } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/languages/ko";
import "froala-editor//css/themes/gray.css";

import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditor from "froala-editor";
import { Form, Input, Button, Select } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";

const { Option } = Select;

class Editor extends Component {
  constructor(props) {
    super(props);
    FroalaEditor.DefineIcon("insertFiles", { SRC: "/image/speaker_Icon.png", ALT: "audioIcon", template: "image" });
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
      flagStar: "default",
      flagComment: "",
      editorZindex1: 10,
      editorZindex2: 10,
      editorZindex3: 10,
      editorZindex4: 10,
      editorZindex5: 10,
      editorZindex6: 10,
      editorZindex7: 10,
      editorZindex8: 10,
      editorZindex9: 10,
      editorZindex10: 10,
      editorZindex11: 10,
      editorZindex12: 10,
      editorZindex13: 10,
      editorZindex14: 10,
      editorZindex15: 10,
      editorZindex16: 10,
    };
    this.config = {
      key: process.env.NEXT_PUBLIC_FROALA_EDITOR_ACTIVATION_KEY,
      editorClass: "editor_try",
      quickInsertEnabled: false,
      imageUploadURL: "/api/cardset/imageUpload",
      fileUploadURL: "/api/cardset/fileUpload",
      //   videoUploadURL: "/api/cardset/videoUpload",
      filesManagerUploadURL: "/api/cardset/fileUpload",
      saveParam: "content",
      width: "auto",
      theme: "gray",
      tabSpaces: 0,
      toolbarContainer: "#toolbarContainer",
      attribution: false,
      charCounterCount: false,
      videoAllowedTypes: ["mp3"],
      placeholderText: "",
      //   videoDefaultWidth: "90%",
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
        // "insertFile",
        "insertFiles",
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
  }

  handleFlagStar = (e) => {
    console.log("comment:", e);
    this.setState({
      flagStar: e,
    });
  };
  handleFlagComment = (e) => {
    console.log("comment:", e.target.value);
    this.setState({
      flagComment: e.target.value,
    });
  };
  handleModelChangeEditor1 = (model) => {
    console.log("editor1:", model);
    this.setState({
      editor1: model,
      editorZindex1: 0,
    });
    if (model === "") {
      this.setState({
        editor1: model,
        editorZindex1: 10,
      });
    }
  };
  handleModelChangeEditor2 = (model) => {
    console.log("editor2:", model);
    this.setState({
      editor2: model,
      editorZindex2: 0,
    });
    if (model === "") {
      this.setState({
        editor2: model,
        editorZindex2: 10,
      });
    }
  };
  handleModelChangeEditor3 = (model) => {
    console.log("editor3:", model);
    this.setState({
      editor3: model,
      editorZindex3: 0,
    });
    if (model === "") {
      this.setState({
        editor3: model,
      editorZindex3: 10,
      });
    }
  };
  handleModelChangeEditor4 = (model) => {
    console.log("editor4:", model);
    this.setState({
      editor4: model,
      editorZindex4: 0,
    });
    if (model === "") {
      this.setState({
        editor4: model,
        editorZindex4: 10,
      });
    }
  };

  handleModelChangeEditor5 = (model) => {
    console.log("editor5:", model);
    this.setState({
      editor5: model,
      editorZindex5: 0,
    });
    if (model === "") {
      this.setState({
        editor5: model,
      editorZindex5: 10,
      });
    }
  };

  handleModelChangeEditor6 = (model) => {
    console.log("editor6:", model);
    this.setState({
      editor6: model,
      editorZindex6: 0,
    });
    if (model === "") {
      this.setState({
        editor6: model,
      editorZindex6: 10,
      });
    }
  };

  handleModelChangeEditor7 = (model) => {
    console.log("editor7:", model);
    this.setState({
      editor7: model,
      editorZindex7: 0,
    });
    if (model === "") {
      this.setState({
        editor7: model,
        editorZindex7: 10,
      });
    }
  };

  handleModelChangeEditor8 = (model) => {
    console.log("editor8:", model);
    this.setState({
      editor8: model,
      editorZindex8: 0,
    });
    if (model === "") {
      this.setState({
        editor8: model,
        editorZindex8: 10,
      });
    }
  };

  handleModelChangeEditor9 = (model) => {
    console.log("editor9:", model);
    this.setState({
      editor9: model,
      editorZindex9: 0,
    });
    if (model === "") {
      this.setState({
        editor9: model,
        editorZindex9: 10,
      });
    }
  };

  handleModelChangeEditor10 = (model) => {
    console.log("editor10:", model);
    this.setState({
      editor10: model,
      editorZindex10: 0,
    });
    if (model === "") {
      this.setState({
        editor10: model,
      editorZindex10: 10,
      });
    }
  };

  handleModelChangeEditor11 = (model) => {
    console.log("editor11:", model);
    this.setState({
      editor11: model,
      editorZindex11: 0,
    });
    if (model === "") {
      this.setState({
        editor11: model,
        editorZindex11: 10,
      });
    }
  };

  handleModelChangeEditor12 = (model) => {
    console.log("editor12:", model);
    this.setState({
      editor12: model,
      editorZindex12: 0,
    });
    if (model === "") {
      this.setState({
        editor12: model,
      editorZindex12: 10,
      });
    }
  };

  handleModelChangeEditor13 = (model) => {
    console.log("editor13:", model);
    this.setState({
      editor13: model,
      editorZindex13: 0,
    });
    if (model === "") {
      this.setState({
        editor13: model,
      editorZindex13: 10,
      });
    }
  };

  handleModelChangeEditor14 = (model) => {
    console.log("editor14:", model);
    this.setState({
      editor14: model,
      editorZindex14: 0,
    });
    if (model === "") {
      this.setState({
        editor14: model,
      editorZindex14: 10,
      });
    }
  };

  handleModelChangeEditor15 = (model) => {
    console.log("editor15:", model);
    this.setState({
      editor15: model,
      editorZindex15: 0,
    });
    if (model === "") {
      this.setState({
        editor15: model,
      editorZindex15: 10,
      });
    }
  };
  handleModelChangeEditor16 = (model) => {
    console.log("editor16:", model);
    this.setState({
      editor16: model,
      editorZindex16: 0,
    });
    if (model === "") {
      this.setState({
        editor16: model,
      editorZindex16: 10,
      });
    }
  };

  handleSubmit = () => {
    console.log("onClick handleSubmit!!!!!");
    // console.log(this.state.editor1)
    // this.props.onFinish(this.state.editor1);
    const num_face1 = this.props.cardtype_info.num_of_row.face1;
    const num_face2 = this.props.cardtype_info.num_of_row.face2;
    const num_annot = this.props.cardtype_info.num_of_row.annotation;

    const face1_array = [];
    const selection_array = [];
    const face2_array = [];
    const annotation_array = [];

    //읽기카드만 있을때
    if (num_face1 > 0 && num_face2 === 0 && num_annot > 0) {
      for (var i = 1; i < num_face1 + 1; i++) {
        face1_array.push(this.state["editor" + i]);
      }
      if (num_annot > 0) {
        for (i = num_face1 + 1; i < num_face1 + num_annot + 1; i++) {
          annotation_array.push(this.state["editor" + i]);
        }
      }
    }

    //뒤집기카드만 있을때
    if (num_face1 > 0 && num_face2 > 0 && num_annot > 0) {
      for (i = 1; i < num_face1 + 1; i++) {
        face1_array.push(this.state["editor" + i]);
      }
      if (num_face2 > 0) {
        for (i = num_face1 + 1; i < num_face1 + num_face2 + 1; i++) {
          face2_array.push(this.state["editor" + i]);
        }
      }
      if (num_annot > 0) {
        for (i = num_face1 + num_face2 + 1; i < num_face1 + num_face2 + num_annot + 1; i++) {
          annotation_array.push(this.state["editor" + i]);
        }
      }
    }

    const values = { face1: face1_array, face2: face2_array, annotation: annotation_array, flagStar:this.state.flagStar, flagComment:this.state.flagComment  };
    console.log(this.props.parentId);
    this.props.onFinish(values, "normal", this.props.parentId);

    this.props.setEditorOn("");
  };

  onClickAddSelection = () => {
    console.log("selection add clicked!!!");
  };
  // componentDidMount() {
  //   this.props.nicks.map((item, index) => {
  //     this.setState({
  //       ["editor" + (index + 1).toString()]: item,
  //     });
  //   });
  // }
  // componentDidUpdate() {
  //   console.log("did update");
  //   const selected = document.getElementsByClassName("fr-placeholder");
  //   for (var a = 0; a < selected.length; a++) {
  //     const section = selected.item(a);
  //     console.log(section);
  //     this.props.nicks.map((item, index) => {
  //       if (index == a) {
  //         section.innerHTML = `<span style='font-size:0.8rem; color:lightgrey;'>${item}</span>`;
  //       }
  //     });
  //   }
  // }

  render() {
    const editorList = this.props.nicks.map((item, index) => {
        return (
          <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: "1px", marginBottom:"3px"  }}>
          <label
            className="editor_label"
            style={{
              zIndex: this.state["editorZindex" + (index + 1).toString()],
              position: "absolute",
              left: "5px",
              top: "15px",
              width: "50px",
              fontSize: "0.5rem",
              color: "lightgrey",
            }}
          >
            {item}
          </label>
          <FroalaEditorComponent
            tag="textarea"
            config={this.config}
            model={this.state["editor" + (index + 1).toString()]}
            onModelChange={this["handleModelChangeEditor" + (index + 1).toString()]}
          />
        </div>
        );
      
    });

    return (
      <>
        <div id="editor">
          <div id="toolbarContainer"></div>
          <div style={{ padding: "3px", border: "1px solid lightgrey" }}>
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "3px" }}>
              <Select size="small" defaultValue={this.state.flagStar} style={{ flexBasis: "100px", flexShrink: 0, width: 100, fontSize: "0.8rem", marginRight:"3px"  }} onChange={this.handleFlagStar}>
                <Option value="default" disabled>
                  플래그선택
                </Option>
                <Option value="1">
                  <StarFilled style={{ color: "#fff006" }} />
                </Option>
                <Option value="2">
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                </Option>
                <Option value="3">
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                </Option>
                <Option value="4">
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                </Option>
                <Option value="5">
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                  <StarFilled style={{ color: "#fff006" }} />
                </Option>
              </Select>
              <Input size="small" style={{ fontSize: "0.8rem", height: "24px" }} onChange={this.handleFlagComment} value={this.state.flagComment} placeholder="코멘트 입력" />
            </div>
            <div style={{ marginBottom: "10px" }}>{editorList}</div>
            <div style={{ textAlign: "right" }}>
              <Button size="small" onClick={this.handleSubmit} id="saveButton" style={{ fontSize: "0.8rem", marginRight: "5px" }}>
                저장
              </Button>
              <Button size="small" onClick={() => this.props.setEditorOn("")} id="cancelButton" style={{ fontSize: "0.8rem" }}>
                취소
              </Button>
            </div>
          </div>
        </div>
        <div style={{ height: "50px" }}></div>
      </>
    );
  }
}

export default Editor;

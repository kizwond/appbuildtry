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
import { Radio, Input, Button, Select } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined, StarFilled } from "@ant-design/icons";
import { s3Hash } from "./EditorSub";

const { Option } = Select;

class UpdateEditor extends Component {
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
      lastSelectionNick: "",
      selectionNextNick: "",
      diffValues: [],
      answerRadio: null,
      answerFieldNick: "",
    };

    FroalaEditor.DefineIcon("insertFiles", { SRC: "/image/speaker_Icon.png", ALT: "audioIcon", template: "image" });
    FroalaEditor.DefineIcon("alert", { SRC: "/image/tts_icon.png", NAME: "tts", template: "image" });
    this.config = {
      key: process.env.NEXT_PUBLIC_FROALA_EDITOR_ACTIVATION_KEY,
      imageUploadToS3: s3Hash,
      editorClass: "editor_try",
      quickInsertEnabled: false,
      imageUploadURL: false,
      // imageUploadURL: "/api/cardset/imageUpload",
      fileUploadURL: "/api/cardset/fileUpload",
      //   videoUploadURL: "/api/cardset/videoUpload",
      filesManagerUploadURL: "/api/cardset/fileUpload",
      saveParam: "content",
      width: "auto",
      theme: "gray",
      indentMargin: 10,
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
        "alert",
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
      const num_face1 = this.props.mycontent.face1.length;
      if (this.props.mycontent.selection !== null) {
        var num_selection = this.props.mycontent.selection.length;
      } else {
        var num_selection = null;
      }
      const num_face2 = this.props.mycontent.face2.length;
      const num_annot = this.props.mycontent.annotation.length;

    const face1_array = [];
    const selection_array = [];
    const face2_array = [];
    const annotation_array = [];

    //읽기카드만 있을때
    if (num_face1 > 0 && num_face2 === 0 ) {
      for (var i = 1; i < num_face1 + 1; i++) {
        face1_array.push(this.state["editor" + i]);
        console.log(this.state["editor" + i]);
      }
      if (num_annot > 0) {
        for (i = num_face1 + 1; i < num_face1 + num_annot + 1; i++) {
          annotation_array.push(this.state["editor" + i]);
        }
      }
    }
    if (num_selection) {
      if (num_face1 > 0 && num_face2 > 0  && num_selection > 0) {
        for (i = 1; i < num_face1 + 1; i++) {
          face1_array.push(this.state["editor" + i]);
        }
        if (num_selection > 0) {
          for (i = num_face1 + 1; i < num_face1 + num_selection + 1; i++) {
            selection_array.push(this.state["editor" + i]);
          }
        }
        if (num_face2 > 0) {
          for (i = num_face1 + num_selection + 1; i < num_face1 + num_selection + num_face2 + 1; i++) {
            face2_array.push(this.state["editor" + i]);
          }
        }
        if (num_annot > 0) {
          for (i = num_face1 + num_selection + num_face2 + 1; i < num_face1 + num_selection + num_face2 + num_annot + 1; i++) {
            annotation_array.push(this.state["editor" + i]);
          }
        }
      }
    } else {
      if (num_face1 > 0 && num_face2 > 0 ) {
        for (i = 1; i < num_face1 + 1; i++) {
          face1_array.push(this.state["editor" + i]);
          console.log(this.state["editor" + i]);
        }
        if (num_face2 > 0) {
          for (i = num_face1 + 1; i < num_face1 + num_face2 + 1; i++) {
            face2_array.push(this.state["editor" + i]);
            console.log(this.state["editor" + i]);
          }
        }
        if (num_annot > 0) {
          for (i = num_face1 + num_face2 + 1; i < num_face1 + num_face2 + num_annot + 1; i++) {
            annotation_array.push(this.state["editor" + i]);
            console.log(this.state["editor" + i]);
          }
        }
      }
    }
    //뒤집기카드만 있을때
    if (selection_array.length > 0) {
      var selectionsArray = selection_array;
    } else {
      selectionsArray = null;
    }

    const values = {
      face1: face1_array,
      selection: selectionsArray,
      face2: face2_array,
      annotation: annotation_array,
      flagStar: this.state.flagStar,
      flagComment: this.state.flagComment,
    };
    console.log(values);
    console.log(face1_array);
    console.log(num_face2);
    if (face1_array[0] === undefined || face1_array.length === 0) {
      alert("내용을 입력해 주세요.");
    } else if (num_face2 !== 0 && face1_array.length === 0) {
      alert("내용을 입력해 주세요.");
    } else {
      this.props.onFinishUpdateContents(values, "update", this.props.mycontent._id, this.props.card_info);
      this.props.setEditorOnForUpdate("");
    }
  };

  onChange = (e) => {
    console.log("radio checked", e.target.value);
    console.log("radio checked", e.target.name);
    const keyname = `editor${Number(e.target.name) + 1}`;
    const editorZindex = `editorZindex${Number(e.target.name) + 1}`;
    const answer = e.target.value;
    this.setState({
      answerRadio: e.target.value,
      [keyname]: answer,
      [editorZindex]: 0,
    });
  };
  componentDidMount() {
    const dodo = async () => {
      var text = null;
      var textRange = null;
      if (document.getSelection) {
        text = document.getSelection().toString().trim();
        textRange = document.getSelection();
        sessionStorage.setItem("selectionText", text);
        console.log("case1", text);
      } else if (typeof document.selection != "undefined") {
        text = document.selection.trim();
        console.log("case2", text);
      }
      console.log("try", text);
      await this.props.addPolly(text);
      const pollyLink = sessionStorage.getItem("getLink");
      console.log(pollyLink);
      var matches = document.getElementsByClassName("fr-element fr-view");
      for (var i = 0; i < matches.length; i++) {
        console.log(matches[i].innerText);
        if (matches[i].innerText.includes(text)) {
          var thisis = matches[i].innerHTML;
          var outer = matches[i].outerHTML;
          console.log(thisis);
          console.log(outer)
          const hello = thisis.replace(text, `${text} <p style="display:flex; justify-content: center;align-items: center; width:80%;"><audio controls><source src="${pollyLink}" type="audio/mpeg"></audio></><p></p>`);
          console.log(hello);
          sessionStorage.setItem("includeLink", hello);
          this[`handleModelChangeEditor${i+1}`](hello);
          // this.handleModelChangeEditor1(hello);
        }
      }
    };
    if (this.props.addPolly) {
      console.log(this.props);
      FroalaEditor.RegisterCommand("alert", {
        title: "Hello",
        focus: false,
        undo: false,
        refreshAfterCallback: false,
        callback: async function () {
          dodo();
        },
      });
    }
    
    console.log(this.props.mycontent);
    console.log(this.props.card_info);
    console.log("여기맞냐?")

    if (this.props.card_info.content.makerFlag.value !== null) {
      if(this.props.card_info.content.makerFlag.value === 0){
        this.setState({
          flagStar: null,
        });
      } else {
        this.setState({
          flagStar: String(this.props.card_info.content.makerFlag.value),
        });
      }
      
    }
    if (this.props.card_info.content.makerFlag.comment !== null) {
      this.setState({
        flagComment: this.props.card_info.content.makerFlag.comment,
      });
    }
    const num_face1 = this.props.mycontent.face1.length;
    if (this.props.mycontent.selection !== null) {
      var num_selection = this.props.mycontent.selection.length;
    } else {
      var num_selection = null;
    }
    const num_face2 = this.props.mycontent.face2.length;
    const num_annot = this.props.mycontent.annotation.length;
    if(num_selection){
        console.log(this.props.nicks[num_face1+num_selection-1])
        console.log(this.props.nicks.slice(num_face1, num_selection+1))
        console.log(this.props.nicks[num_face1+num_selection])
        this.setState({
            lastSelectionNick: this.props.nicks[num_face1+num_selection-1]
        })
        this.setState({
            diffValues: this.props.nicks.slice(num_face1, num_selection+1)
        })
        this.setState({
            answerFieldNick : this.props.nicks[num_face1+num_selection]
        })
    }
    
    //읽기카드만 있을때
    if (num_face1 > 0 && num_face2 === 0 ) {
      for (var i = 1; i < num_face1 + 1; i++) {
       
        this.setState({
          ["editor" + i]: this.props.mycontent.face1[i - 1],
        });
      }
      if (num_annot > 0) {
        for (i = num_face1 + 1; i < num_face1 + num_annot + 1; i++) {
          this.setState({
            ["editor" + i]: this.props.mycontent.annotation[i - 1 - num_face1],
          });
          console.log(this.props.mycontent.annotation[i - 1 - num_face1])
        }
      }
    }


    if (num_selection) {
      if (num_face1 > 0 && num_face2 > 0 && num_selection > 0) {
        for (i = 1; i < num_face1 + 1; i++) {
          this.setState({
            ["editor" + i]: this.props.mycontent.face1[i - 1],
          });
        }
        if (num_selection > 0) {
          for (i = num_face1 + 1; i < num_face1 + num_selection + 1; i++) {
            this.setState({
              ["editor" + i]: this.props.mycontent.selection[i - 1 - num_face1],
            });
          }
        }
        if (num_face2 > 0) {
            this.setState({
                answerRadio: this.props.mycontent.face2[0],
            });
          for (i = num_face1 + num_selection + 1; i < num_face1 + num_selection + num_face2 + 1; i++) {
            this.setState({
              ["editor" + i]: this.props.mycontent.face2[i - 1 - num_face1 - num_selection],
            });
          }
        }
        if (num_annot > 0) {
          for (i = num_face1 + num_selection + num_face2 + 1; i < num_face1 + num_selection + num_face2 + num_annot + 1; i++) {
            this.setState({
              ["editor" + i]: this.props.mycontent.annotation[i - 1 - num_face1 - num_selection - num_face2],
            });
          }
        }
      }
    } else {
      if (num_face1 > 0 && num_face2 > 0 ) {
        for (i = 1; i < num_face1 + 1; i++) {
          console.log("==================================")
          console.log(this.props.mycontent.face1[i - 1])
          console.log("==================================")
          this.setState({
            ["editor" + i]: this.props.mycontent.face1[i - 1],
          });
        }
        if (num_face2 > 0) {
          for (i = num_face1 + 1; i < num_face1 + num_face2 + 1; i++) {
            this.setState({
              ["editor" + i]: this.props.mycontent.face2[i - 1 - num_face1],
            });
          }
        }
        if (num_annot > 0) {
          for (i = num_face1 + num_face2 + 1; i < num_face1 + num_face2 + num_annot + 1; i++) {
            this.setState({
              ["editor" + i]: this.props.mycontent.annotation[i - 1 - num_face1 - num_face2 ],
            });
          }
        }
      }
    }
  }
  render() {
    const editorList = this.props.nicks.map((item, index) => {
      if (item == this.state.lastSelectionNick) {
        console.log("editor", item);
        return (
          <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: "1px", marginBottom: "3px" }}>
            {item.slice(0, 2) !== "보기" && (
              <label
                className="editor_label"
                style={{
                  zIndex: this.state["editorZindex" + (index + 1).toString()],
                  position: "absolute",
                  left: "5px",
                  top: "5px",

                  fontSize: "0.5rem",
                  color: "lightgrey",
                }}
              >
                {item}
              </label>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              {item.slice(0, 2) === "보기" && item.slice(2, 3) === "1" && (
                <>
                  <span style={{ marginRight: "5px" }}>➀</span>
                </>
              )}
              {item.slice(0, 2) === "보기" && item.slice(2, 3) === "2" && (
                <>
                  <span style={{ marginRight: "5px" }}>➁</span>
                </>
              )}
              {item.slice(0, 2) === "보기" && item.slice(2, 3) === "3" && (
                <>
                  <span style={{ marginRight: "5px" }}>➂</span>
                </>
              )}
              {item.slice(0, 2) === "보기" && item.slice(2, 3) === "4" && (
                <>
                  <span style={{ marginRight: "5px" }}>➃</span>
                </>
              )}
              {item.slice(0, 2) === "보기" && item.slice(2, 3) === "5" && (
                <>
                  <span style={{ marginRight: "5px" }}>➄</span>
                </>
              )}
              <FroalaEditorComponent
                tag="textarea"
                config={this.config}
                model={this.state["editor" + (index + 1).toString()]}
                onModelChange={this["handleModelChangeEditor" + (index + 1).toString()]}
              />
              {/* <PlusCircleOutlined style={{ fontSize: "1.3rem", marginLeft: "5px", color: "grey" }} onClick={this.props.addSelections} />
              <MinusCircleOutlined style={{ fontSize: "1.3rem", marginLeft: "5px", color: "grey" }} onClick={this.props.removeSelection} /> */}
            </div>
            {this.state.diffValues && (
              <div style={{ display: "flex", marginTop: "3px", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", marginRight: "5px" }}>정답 :</span>
                <Radio.Group buttonStyle="solid" size="small" onChange={this.onChange} name={index + 1} defaultChecked={true} value={this.state.answerRadio}>
                  {this.state.diffValues.map((value, answerindex) => {
                    return (
                      <React.Fragment key={value}>
                        <Radio.Button value={(answerindex + 1).toString()} style={{ fontSize: "1.5rem" }}>
                          {value.slice(0, 2) === "보기" && value.slice(2, 3) === "1" && (
                            <>
                              <span>➀</span>
                            </>
                          )}
                          {value.slice(0, 2) === "보기" && value.slice(2, 3) === "2" && (
                            <>
                              <span>➁</span>
                            </>
                          )}
                          {value.slice(0, 2) === "보기" && value.slice(2, 3) === "3" && (
                            <>
                              <span>➂</span>
                            </>
                          )}
                          {value.slice(0, 2) === "보기" && value.slice(2, 3) === "4" && (
                            <>
                              <span>➃</span>
                            </>
                          )}
                          {value.slice(0, 2) === "보기" && value.slice(2, 3) === "5" && (
                            <>
                              <span>➄</span>
                            </>
                          )}
                        </Radio.Button>
                      </React.Fragment>
                    );
                  })}
                </Radio.Group>
              </div>
            )}
          </div>
        );
      } else if (item == this.state.answerFieldNick) {
        console.log("editor", item);
        return (
          <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: "1px", marginBottom: "3px", display: "none" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input type="text" value={this.state["editor" + (index + 1).toString()]} readOnly />
            </div>
          </div>
        );
      } else {
        return (
          <React.Fragment key={item}>
            <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: "1px", marginBottom: "3px" }}>
              {item.slice(0, 2) !== "보기" && (
                <label
                  className="editor_label"
                  style={{
                    zIndex: this.state["editorZindex" + (index + 1).toString()],
                    position: "absolute",
                    left: "5px",
                    top: "5px",

                    fontSize: "0.5rem",
                    color: "lightgrey",
                  }}
                >
                  {item}
                </label>
              )}
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.slice(0, 2) === "보기" && item.slice(2, 3) === "1" && (
                  <>
                    <span style={{ marginRight: "5px" }}>➀</span>
                  </>
                )}
                {item.slice(0, 2) === "보기" && item.slice(2, 3) === "2" && (
                  <>
                    <span style={{ marginRight: "5px" }}>➁</span>
                  </>
                )}
                {item.slice(0, 2) === "보기" && item.slice(2, 3) === "3" && (
                  <>
                    <span style={{ marginRight: "5px" }}>➂</span>
                  </>
                )}
                {item.slice(0, 2) === "보기" && item.slice(2, 3) === "4" && (
                  <>
                    <span style={{ marginRight: "5px" }}>➃</span>
                  </>
                )}
                {item.slice(0, 2) === "보기" && item.slice(2, 3) === "5" && (
                  <>
                    <span style={{ marginRight: "5px" }}>➄</span>
                  </>
                )}
                <FroalaEditorComponent
                  key={`editor${item}`}
                  tag="textarea"
                  config={this.config}
                  model={this.state["editor" + (index + 1).toString()]}
                  onModelChange={this["handleModelChangeEditor" + (index + 1).toString()]}
                />
              </div>
            </div>
          </React.Fragment>
        );
      }
    });

    return (
      <>
        <div id="editor">
          <div id="toolbarContainer"></div>
          <div style={{ padding: "3px", border: "1px solid lightgrey" }}>
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: "3px" }}>
              <Select
                size="small"
                value={this.state.flagStar}
                style={{ flexBasis: "100px", flexShrink: 0, width: 100, fontSize: "0.8rem", marginRight: "3px" }}
                onChange={this.handleFlagStar}
              >
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
            <div style={{ marginBottom: "5px" }}>{editorList}</div>
            <div style={{ textAlign: "right" }}>
              <Button size="small" onClick={this.handleSubmit} id="saveButton" style={{ fontSize: "0.8rem", marginRight: "5px" }}>
                저장
              </Button>
              <Button
                size="small"
                onClick={() => {
                  this.props.setEditorOnForUpdate("");
                  sessionStorage.removeItem("selections");
                  sessionStorage.removeItem("selections_adding");
                  sessionStorage.removeItem("nicks_with_selections");
                  sessionStorage.removeItem("nicks_without_selections");
                }}
                id="cancelButton"
                style={{ fontSize: "0.8rem" }}
              >
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

export default UpdateEditor;

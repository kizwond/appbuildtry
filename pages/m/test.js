import { AutoComplete } from "antd";
import { Component } from "react";
import React from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getSelectionText = () => {
    var text = {}
    if (window.getSelection) {
      text = window.getSelection().getRangeAt(0)
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };
  hide = () => {
    const textSelected = this.getSelectionText();
    console.log(textSelected);
    console.log(JSON.parse(textSelected));
    // console.log(textSelected.startContainer);
  };
  render() {
    const hello = `<div style={{ width: "300px", margin: "auto", marginTop: "100px" }}>안녕하세요 <span>나는</span> 누구일까요?</div>`;

    return (
      <>
        <div style={{ width: "300px", margin: "auto", marginTop: "100px" }} id={`face2row1`} dangerouslySetInnerHTML={{ __html: hello }}></div>
        <button id="temp" onClick={this.hide}>
          버튼
        </button>
      </>
    );
  }
}

export default Test;

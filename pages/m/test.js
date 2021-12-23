import { AutoComplete } from "antd";
import { Component } from "react";
import React from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getSelectionText = () => {
    var text = {};
    if (window.getSelection) {
      text = window.getSelection().getRangeAt(0);
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };
  getSelectionText2 = () => {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    return text;
  };
  hide = () => {
    const textSelected = this.getSelectionText();
    const element_tmp = this.getSelectionText2();

    console.log(textSelected);
    console.log(textSelected.startContainer);
    console.log(textSelected.startContainer.parentNode.parentNode);
    const parentId_tmp = textSelected.startContainer.parentNode.parentNode.outerHTML;
    console.log(parentId_tmp);
    const parentId = parentId_tmp.match(/(?<=id=\")\w{1,50}/gi); // parentNode에 id값을 찾는 표현식
    console.log(parentId[0]);

    const htmlNode = document.getElementById(parentId[0]).innerHTML;
    console.log(htmlNode);
    console.log(element_tmp);
    const replaced = htmlNode.replace(element_tmp, `<span style="visibility:hidden;">${element_tmp}</span>`);
    console.log(replaced);

    var elem = document.getElementById(parentId[0]);
    console.log(elem);
    elem.innerHTML = replaced;
  };

  show = () => {
    const hello = `<div>안녕하세요 <span>나</span>는 누구일까요?</div>`;
    var elem = document.getElementById("face2row1");
    console.log(elem);
    elem.innerHTML = hello;
  };

  render() {
    const hello = `<div>안녕하세요 <span>나는</span> 누구일까요?</div>`;

    return (
      <>
        <div style={{ width: "300px", margin: "auto", marginTop: "100px", marginBottom: "5px" }} id={`face2row1`} dangerouslySetInnerHTML={{ __html: hello }}></div>
        <div style={{ width: "300px", margin: "auto"}}>
          <button id="temp" onClick={this.hide}>
            가리기
          </button>
          <button id="temp" onClick={this.show}>
            해제
          </button>
        </div>
      </>
    );
  }
}

export default Test;

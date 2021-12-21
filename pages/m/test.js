import { AutoComplete } from "antd";
import { Component } from "react";
import React from "react";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const hello = "abcdefg  : 나는 누구일까요?begeegegg: 그러는 너는 누구냐? 철수              : 영희야 너 내일 뭐하냐? 영희 : 몰라임마";
    const result = hello.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "") 
    console.log(result)
    return <><div style={{ width: "300px", margin: "auto", marginTop: "100px" }}>{hello}</div>
    <div>{result}</div></>;
  }
}

export default Test;

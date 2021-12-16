import React, { Component } from "react";
import { Button } from "antd";
// import ms from "pretty-ms"
const ms = require("pretty-ms");

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.startTimer();
    this.props.startTimerTotal();
  }

  render() {
    let stop_total =
      this.props.time_total === 0 || !this.props.isOn_total ? null : (
        <Button size="small" onClick={this.props.stopTimerTotal} type="primary" danger style={{ fontSize: "0.8rem", width: "53px", borderRadius: "3px" }}>
          일시정지
        </Button>
      );

    let resume_total =
      this.props.time_total === 0 || this.props.isOn_total ? null : (
        <Button
          size="small"
          onClick={this.props.startTimerResume}
          type="primary"
          style={{ fontSize: "0.8rem", width: "53px", borderRadius: "3px", backgroundColor: "#1ce400", border: "none" }}
        >
          재개
        </Button>
      );

    return (
      <>
        <div style={{ display: "flex", flexDirection: "flex", alignItems: "center" }}>
          <div style={{ lineHeight: "1rem", marginBottom: "0px", fontSize: "0.8rem", display: "flex", flexDirection: "column", marginRight: "10px" }}>
            <div>현재카드</div>
            <div>학습시간</div>
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              boxShadow: "inset 2px 2px 3px 0px #cccccc",
              textAlign: "right",
              paddingRight: "5px",
              width: "80px",
              fontFamily: "Mina, sans-serif",
              fontSize: "0.9rem",
              lineHeight: "20px",
              height: "20px",
            }}
          >
            {this.props.time > 1000 && ms(this.props.time, { colonNotation: false, secondsDecimalDigits: 0 })}
            {this.props.time < 1000 && <>0s</>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "flex", alignItems: "center" }}>
          <div style={{ marginBottom: "0px", fontSize: "0.8rem", marginRight: "10px" }}>총 경과시간</div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              boxShadow: "inset 2px 2px 3px 0px #cccccc",
              textAlign: "right",
              paddingRight: "5px",
              width: "80px",
              fontFamily: "Mina, sans-serif",
              fontSize: "0.9rem",
              lineHeight: "20px",
              height: "20px",
            }}
          >
            {this.props.time_total > 1000 && ms(this.props.time_total, { colonNotation: false, secondsDecimalDigits: 0 })}
            {this.props.time_total < 1000 && <>0s</>}
          </div>
        </div>
        {stop_total}
        {resume_total}
      </>
    );
  }
}
export default Timer;

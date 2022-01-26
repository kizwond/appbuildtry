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
        <Button size="small" onClick={this.props.stopTimerTotal} type="primary" danger style={{flexShrink:0, fontSize: "0.8rem", width: "32px", height:"20px", marginLeft:"5px", borderRadius: "3px", border: "none" }}>
          정지
        </Button>
      );

    let resume_total =
      this.props.time_total === 0 || this.props.isOn_total ? null : (
        <Button
          size="small"
          onClick={this.props.startTimerResume}
          type="primary"
          style={{flexShrink:0, fontSize: "0.8rem", width: "32px", height:"20px", marginLeft:"5px", borderRadius: "3px", backgroundColor: "#1ce400", border: "none" }}
        >
          재개
        </Button>
      );

    return (
      <>
        <div style={{ width:"100%", display: "flex", flexDirection: "flex", alignItems: "center", justifyContent:"flex-start" }}>
          <div style={{ marginBottom: "0px", fontSize: "0.8rem", marginRight: "5px" }}>세션전체</div>
          <div
            style={{
              backgroundColor: "#e2e2e2",
              boxShadow: "inset 2px 2px 3px 0px #acacac",
              textAlign: "right",
              paddingRight: "5px",
              width: "50%",
              flexGrow:1,
              fontFamily: "Mina, sans-serif",
              fontSize: "0.9rem",
              lineHeight: "20px",
              height: "20px",
              borderRadius:"3px"
            }}
          >
            {this.props.time_total > 1000 && ms(this.props.time_total, { colonNotation: false, secondsDecimalDigits: 0 })}
            {this.props.time_total < 1000 && <>0s</>}
          </div>
        </div>

        <div style={{ width:"100%", display: "flex", flexDirection: "flex", alignItems: "center", marginLeft:"5px" , justifyContent:"flex-start"}}>
          <div style={{ lineHeight: "1rem", marginBottom: "0px", fontSize: "0.8rem", display: "flex", flexDirection: "column", marginRight: "5px" }}>
            <div>현재카드</div>
          </div>
          <div
            style={{
              backgroundColor: "#e2e2e2",
              boxShadow: "inset 2px 2px 3px 0px #acacac",
              textAlign: "right",
              paddingRight: "5px",
              width: "50%",
              flexGrow:1,
              fontFamily: "Mina, sans-serif",
              fontSize: "0.9rem",
              lineHeight: "20px",
              height: "20px",
              borderRadius:"3px"
            }}
          >
            {this.props.time > 1000 && ms(this.props.time, { colonNotation: false, secondsDecimalDigits: 0 })}
            {this.props.time < 1000 && <>0s</>}
          </div>
        </div>
        {stop_total}
        {resume_total}
      </>
    );
  }
}
export default Timer;

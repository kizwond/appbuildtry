import React from "react";

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;
  // console.log(completed)
  if(completed == 0 || completed== undefined){
    
    var compValue = 0
  } else {
    var compValue = completed.toFixed()
  }
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "#e2e2e2",
    boxShadow: "inset 2px 2px 3px 0px #acacac",
    borderRadius: "3px",
  }
  const fillerStyles = {
    height: '100%',
    width: `${compValue}%`,
    // backgroundColor: bgcolor,
    background:"linear-gradient(0deg, rgb(134 217 131) 0%, rgba(9,255,0,0.8099614845938375) 40%, rgba(50,242,43,1) 60%, rgb(90 232 130 / 80%) 100%)",
    transition: 'width 1s ease-in-out',
    borderRadius: '3px',
    textAlign: 'right',
    lineHeight:"20px",
    boxShadow: "2px 0px 1px 0px #acacac",
  }

  const labelStyles = {
    padding: 0,
    color: 'white',
    fontSize:'0.8rem',
    fontWeight: '400',
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${compValue}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
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
    height: 15,
    width: '100%',
    backgroundColor: "#e2e2e2",
    boxShadow: "inset 2px 2px 3px 0px #acacac",
    borderRadius: 5,
  }
  const fillerStyles = {
    height: '100%',
    width: `${compValue}%`,
    backgroundColor: bgcolor,
    transition: 'width 1s ease-in-out',
    borderRadius: 'inherit',
    textAlign: 'right',
    lineHeight:"1rem",
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
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
    backgroundColor: "#d4d4d4",
    borderRadius: 5,
  }

  const fillerStyles = {
    height: '100%',
    width: `${compValue}%`,
    backgroundColor: bgcolor,
    transition: 'width 1s ease-in-out',
    borderRadius: 'inherit',
    textAlign: 'right',
    lineHeight:"1rem"
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
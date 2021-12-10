import React from "react";

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 15,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 5,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
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
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
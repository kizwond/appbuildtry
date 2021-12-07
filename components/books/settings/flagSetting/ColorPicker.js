import React, { memo, useState } from "react";
import reactCSS from "reactcss";
import { CompactPicker, GithubPicker } from "react-color";
import { Button } from "antd";

const ColorPicker = memo(({ color, onChangeColor, index }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker((prev) => !prev);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (_color) => {
    onChangeColor(_color.hex, index);
    handleClose(false);
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "50px",
        // height: "14px",
        borderRadius: "2px",
        background: color,
      },
      swatch: {
        // padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });
  return (
    <div>
      {/* <div style={styles.swatch} onClick={handleClick}> */}
      <Button style={styles.color} onClick={handleClick}>
        {" "}
      </Button>
      {/* </div> */}
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <CompactPicker
            color={color}
            // 기본색 설정 부분
            // colors={['blue', 'yellow', 'green', 'black', 'pink']}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
});

export default ColorPicker;

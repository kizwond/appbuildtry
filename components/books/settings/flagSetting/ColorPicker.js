import React, { memo, useState } from "react";
import reactCSS from "reactcss";
import { CompactPicker } from "react-color";
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
    // handleClose();
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "50px",
        height: "40px",
        borderRadius: "2px",
        background: color,
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
      <Button
        className="ForSelectColorPicker"
        style={styles.color}
        onClick={handleClick}
      >
        {" "}
      </Button>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <CompactPicker
            styles={{
              default: {
                compact: {
                  right: "-25px",
                  position: "absolute",
                  bottom: "28px",
                  background: "#ffffff",
                  boxShadow:
                    "rgb(0 0 0 / 12%) 0px 2px 10px, rgb(0 0 0 / 16%) 0px 2px 5px",
                  borderRadius: "2px",
                },
              },
            }}
            color={color}
            // 기본색 설정 부분
            // colors={['blue', 'yellow', 'green', 'black', 'pink']}
            // onChange={handleChange}
            onChangeComplete={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
});

export default ColorPicker;

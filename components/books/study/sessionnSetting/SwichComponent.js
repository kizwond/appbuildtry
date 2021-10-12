import React from "react";
import { Switch } from "antd";
import { onChangeArrayValuesForSwitch } from "./functionTool";
const SwichComponent = (props) => {
  let switchCom = null;
  if (Object.keys(props).length == 6) {
    switchCom = (
      <Switch
        size="small"
        checked={props.target?.includes(props.switchArrayValue)}
        onClick={(checked) => {
          onChangeArrayValuesForSwitch(checked, props.funct, props.switchArrayValue, props.bigGrandParent, props.grandParent, props.parent);
        }}
      />
    );
  }

  return <>{switchCom}</>;
};

export default SwichComponent;

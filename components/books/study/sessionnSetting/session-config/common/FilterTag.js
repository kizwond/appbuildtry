import { memo, useCallback, useMemo } from "react";
import ToggleTag from "./ToggleTag";

const FilterTag = ({ name, array, value, setState }) => {
  const onToggleChange = (checked) => {
    if (checked) {
      setState([...array, value]);
    } else {
      setState(array.filter((item) => item !== value));
    }
  };

  const changeChecked = useMemo(() => array.includes(value), [array, value]);

  return (
    <ToggleTag checked={changeChecked} onChange={onToggleChange}>
      {name}
    </ToggleTag>
  );
};

export default memo(FilterTag);

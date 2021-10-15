import { memo } from "react";
import { Tag } from "antd";

const FilterTag = ({ name, array, value, setState }) => {
  const { CheckableTag } = Tag;

  const onToggleChange = (checked) => {
    if (checked) {
      setState([...array, value]);
    } else {
      setState(array.filter((item) => item !== value));
    }
  };

  return (
    <CheckableTag checked={array.includes(value)} onChange={onToggleChange}>
      {name}
    </CheckableTag>
  );
};

export default memo(FilterTag);

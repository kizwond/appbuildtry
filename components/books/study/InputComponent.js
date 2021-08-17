import React from 'react';
import { Input, Tooltip } from 'antd';
import { useState } from 'react';

const InputComponent = ({
  disabled,
  placeholder,
  onChangeNickName,
  recordKey,
}) => {
  const [showLimitText, setShowLitmitText] = useState(false);
  return (
    <>
      <Tooltip
        title="글자수 7자 제한"
        color="red"
        key="overtext"
        visible={showLimitText}
      >
        <Input
          disabled={disabled}
          placeholder={placeholder}
          style={{ minWidth: '65px' }}
          maxLength={7}
          onChange={(e) => {
            onChangeNickName(e, recordKey);
            if (e.target.value.length > 6) {
              setShowLitmitText(true);
            }
            if (e.target.value.length < 7) {
              setShowLitmitText(false);
            }
          }}
        />
      </Tooltip>
    </>
  );
};

export default InputComponent;

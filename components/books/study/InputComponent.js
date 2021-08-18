import React, { useRef } from 'react';
import { Input, Tooltip } from 'antd';
import { useState } from 'react';
import produce from 'immer';

const InputComponent = ({
  disabled,
  placeholder,
  onChangeNickName,
  recordKey,
  restudyOption,
}) => {
  const [showLimitText, setShowLitmitText] = useState(false);
  const inputRef = useRef();
  return (
    <>
      <Tooltip
        title="글자수 8자 제한"
        color="red"
        key="overtext"
        visible={showLimitText}
      >
        <Input
          onBlur={(e) => {
            // 중복된 닉이 있을 때
            const nickArrayExceptMeAndEmptyValue = restudyOption
              .map((item) => item.nick)
              .filter((item, index) => index != recordKey)
              .filter((i) => i != '');
            const isSameKeyInNick = nickArrayExceptMeAndEmptyValue.includes(
              e.target.value
            );
            if (isSameKeyInNick) {
              const diffi_have_same_nick = restudyOption.filter(
                (diffi) => diffi.nick == e.target.value
              )[0];
              alert(`${diffi_have_same_nick}의 별칭과 중복됩니다`);
              setTimeout(() => inputRef.current.focus({ cursor: 'all' }), 0);
            } else {
              const newData = produce(restudyOption, (draft) => {
                draft[recordKey].nick = e.target.value;
              });
              onChangeNickName(newData);
            }
          }}
          // onAfterChange={() => console.log('마우스 떠남')}
          ref={inputRef}
          onClick={() => {
            inputRef.current.focus({ cursor: 'all' });
          }}
          disabled={disabled}
          value={placeholder}
          style={{ minWidth: '65px' }}
          maxLength={8}
          onChange={(e) => {
            const newData = produce(restudyOption, (draft) => {
              draft[recordKey].nick = e.target.value;
            });
            onChangeNickName(newData);
            if (e.target.value.length > 7) {
              setShowLitmitText(true);
              let timer = setTimeout(() => setShowLitmitText(false), 2000);
              // clearTimeout(timer);
            } else {
              setShowLitmitText(false);
            }
          }}
        />
      </Tooltip>
    </>
  );
};

export default InputComponent;

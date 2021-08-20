import React, { memo, useRef } from 'react';
import { Input, Tooltip } from 'antd';
import { useState } from 'react';

const NickInput = ({
  disabled,
  selectedNick,
  onChangeState,
  index,
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
              .filter((item, _index) => _index != index)
              .filter((i) => i != '');
            const isSameKeyInNick = nickArrayExceptMeAndEmptyValue.includes(
              e.target.value
            );
            if (isSameKeyInNick) {
              const diffi_have_same_nick = restudyOption.filter(
                (diffi) => diffi.nick == e.target.value
              )[0];
              alert(`${diffi_have_same_nick.difficulty}의 별칭과 중복됩니다`);
              const timer = setTimeout(
                () => inputRef.current.focus({ cursor: 'all' }),
                0
              );
            }
          }}
          ref={inputRef}
          disabled={disabled}
          value={selectedNick}
          style={{ minWidth: '65px' }}
          maxLength={8}
          onChange={(e) => {
            // const newData = produce(restudyOption, (draft) => {
            //   draft[index].nick = e.target.value;
            // });
            onChangeState('restudyOption', e.target.value, index, 'nick');
            if (e.target.value.length > 7) {
              setShowLitmitText(true);
              const timer = setTimeout(() => setShowLitmitText(false), 2000);
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

export default memo(NickInput);

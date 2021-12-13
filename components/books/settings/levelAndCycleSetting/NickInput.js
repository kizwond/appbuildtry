import React, { useRef, memo } from "react";
import { Input, Tooltip } from "antd";
import { useState } from "react";
import produce from "immer";

const NickInput = ({
  disabled,
  placeholder,
  onChangeRestudyOption,
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
          // key={placeholder}
          defaultValue={placeholder}
          value={placeholder}
          onBlur={(e) => {
            // 중복된 닉이 있을 때
            const nickArrayExceptMeAndEmptyValue = restudyOption
              .map((item) => item.nick)
              .filter((item, index) => index != recordKey)
              .filter((i) => i != "");
            const isSameKeyInNick = nickArrayExceptMeAndEmptyValue.includes(
              e.target.value
            );
            if (isSameKeyInNick) {
              const diffi_have_same_nick = restudyOption.filter(
                (diffi) => diffi.nick == e.target.value
              )[0];
              alert(`${diffi_have_same_nick}의 별칭과 중복됩니다`);
            } else {
              const newData = produce(restudyOption, (draft) => {
                draft[recordKey].nick = e.target.value;
              });
              onChangeRestudyOption(newData);
            }
          }}
          ref={inputRef}
          disabled={disabled}
          style={{ minWidth: "65px" }}
          maxLength={11}
          onChange={(e) => {
            const newData = produce(restudyOption, (draft) => {
              draft[recordKey].nick = e.target.value;
            });
            onChangeRestudyOption(newData);
            if (e.target.value.length > 7) {
              setShowLitmitText(true);
              let timer = setTimeout(() => setShowLitmitText(false), 2000);
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

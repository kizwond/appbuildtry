import React, { useRef } from 'react';
import { Input } from 'antd';

const ShortcutkeyInput = ({
  disabled,
  selectedShortcutkey,
  index,
  restudyOption,
  onChangeRestudyOption,
}) => {
  const inputRef = useRef();
  return (
    <Input
      disabled={disabled}
      value={selectedShortcutkey}
      ref={inputRef}
      allowClear
      maxLength={1}
      style={{ width: 55 }}
      onClick={() => {
        inputRef.current.focus({ cursor: 'all' });
      }}
      onChange={(e) => {
        onChangeRestudyOption(e.target.value, index, 'shortcutkey');

        const shortcutKyesArrayExceptMeAndEmptyValue = restudyOption
          .map((item) => item.shortcutkey)
          .filter((item, _index) => _index != index)
          .filter((i) => i != '');
        const isSameKeyInShortcutKyes =
          shortcutKyesArrayExceptMeAndEmptyValue.includes(e.target.value);

        console.log(shortcutKyesArrayExceptMeAndEmptyValue);
        if (isSameKeyInShortcutKyes) {
          const diffi_have_same_shortcutkey = restudyOption.filter(
            (diffi) => diffi.shortcutkey == e.target.value
          )[0];

          const timer = setTimeout(() => {
            alert(
              `${diffi_have_same_shortcutkey.difficulty}의 단축키 ${diffi_have_same_shortcutkey.shortcutkey}와 중복됩니다.`
            );
          }, 300);
        }
      }}
    />
  );
};

export default ShortcutkeyInput;

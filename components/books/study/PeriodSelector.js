import React, { memo, useCallback } from 'react';
import produce from 'immer';
import { Select } from 'antd';

const PeriodSelector = ({
  period,
  index,
  selectOptionArray,
  onChangeRestudyOption,
  restudyOption,
}) => {
  const onChange = (selected_period) => {
    const tableData = produce(restudyOption, (draft) => {
      const period_before_selected = draft[index].period;
      let previous_diffi_period_option;
      let next_diffi_period_option;
      if (index > 0) {
        if (index != 4) {
          previous_diffi_period_option = draft[index - 1].periodOption;
        }
      }
      if (index < 3) {
        next_diffi_period_option = draft[index + 1].periodOption;
      }
      // 차이 만큼 이전/이후 diffi의 기간 더하고 빼기
      const gap =
        period_before_selected - selected_period > 0
          ? period_before_selected - selected_period
          : selected_period - period_before_selected;

      if (index == 0) {
        //diffi1의 경우 diffi2만 수정
        if (period_before_selected > selected_period) {
          for (let i = 0; i < gap; i++) {
            next_diffi_period_option.splice(0, 0, selected_period + gap - i);
          }
        } else if (period_before_selected < selected_period) {
          next_diffi_period_option.splice(0, gap);
        }
      } else if (index == 3) {
        // diffi5의 경우 이전 diffi4만 수정
        if (period_before_selected > selected_period) {
          previous_diffi_period_option.splice(
            previous_diffi_period_option.length - gap,
            gap
          );
        } else if (period_before_selected < selected_period) {
          for (let i = 0; i < gap; i++) {
            previous_diffi_period_option.push(selected_period - gap + i);
          }
        }
      } else {
        //diffi2,3,4의 경우 이전,다음 diffi수정
        if (period_before_selected > selected_period) {
          previous_diffi_period_option.splice(
            previous_diffi_period_option.length - gap,
            gap
          );
          for (let i = 0; i < gap; i++) {
            next_diffi_period_option.splice(0, 0, selected_period + gap - i);
          }
        } else if (period_before_selected < selected_period) {
          next_diffi_period_option.splice(0, gap);
          for (let i = 0; i < gap; i++) {
            previous_diffi_period_option.push(selected_period - gap + i);
          }
        }
      }

      draft[index].period = selected_period;
    });

    onChangeRestudyOption(tableData);
  };

  return (
    <Select
      // disabled={restudyOption[arrayIndex].on_off === 'on' ? false : true}
      defaultValue={period}
      style={{ width: 75 }}
      onChange={(selected_period) => {
        onChange(selected_period);
      }}
    >
      {selectOptionArray.map((num) => (
        <Select.Option value={num} key={num}>
          {`${num}분`}
        </Select.Option>
      ))}
    </Select>
  );
};

export default memo(PeriodSelector);

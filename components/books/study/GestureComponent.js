import React from 'react';
import { Select, Tooltip } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';

const GestureComponent = ({ gesture, on_off, onChangeGesture }) => {
  return (
    <Select
      defaultValue={gesture}
      style={{ width: 60 }}
      onChange={(_gesture) => {
        onChangeGesture(_gesture);
      }}
      disabled={on_off === 'on' ? false : true}
    >
      <Select.Option value={null} key={null}>
        <Tooltip placement="leftTop" title="제스처 사용안함">
          <div style={{ width: '100%' }}>
            <CloseSquareOutlined />
          </div>
        </Tooltip>
      </Select.Option>
      <Select.Option value="up" key="up">
        <Tooltip placement="leftTop" title="위로" mouseEnterDelay={0.4}>
          <div style={{ width: '100%' }}>
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      </Select.Option>
      <Select.Option value="down" key="down">
        <Tooltip placement="leftBottom" title="아래로" mouseEnterDelay={0.4}>
          <div style={{ width: '100%' }}>
            <ArrowDownOutlined />
          </div>
        </Tooltip>
      </Select.Option>
      <Select.Option value="left" key="left">
        <Tooltip placement="left" title="왼쪽" mouseEnterDelay={0.4}>
          <div style={{ width: '100%' }}>
            <ArrowLeftOutlined />
          </div>
        </Tooltip>
      </Select.Option>
      <Select.Option value="right" key="right">
        <Tooltip placement="right" title="오른쪽" mouseEnterDelay={0.4}>
          <div style={{ width: '100%' }}>
            <ArrowRightOutlined />
          </div>
        </Tooltip>
      </Select.Option>
    </Select>
  );
};

export default GestureComponent;

/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from "react";
import { Select, Table, Button } from "antd";
import ColorPicker from "./ColorPicker";
import FlagIcon from "./FlagIcon";
import produce from "immer";
import { MUTATION_UPDATE_USER_FLAG_CONFIG } from "../../../../graphql/mutation/flagConfig";
import { GET_USER_FLAG_CONFIG } from "../../../../graphql/query/allQuery";
import { useQuery, useMutation } from "@apollo/client";

const FlagSetting = () => {
  const [flag, setFlag] = useState([]);

  const { loading, error, data } = useQuery(GET_USER_FLAG_CONFIG, {
    onCompleted: (data) => {
      console.log("유즈", data.userflagconfig_get.userflagconfigs[0].details);
      const flags_array = ["flag1", "flag2", "flag3", "flag4", "flag5"];
      const server_flags = data.userflagconfig_get.userflagconfigs[0].details;
      const for_flags_data = flags_array.map((flag, index) => ({
        key: index + 1,
        flag_number: flag,
        shape: server_flags[flag].shape,
        color: server_flags[flag].color,
      }));

      setFlag(for_flags_data);
    },
    // notifyOnNetworkStatusChange: true,
  });

  const [userflagconfig_update] = useMutation(MUTATION_UPDATE_USER_FLAG_CONFIG);

  const submitFlag = async () => {
    try {
      await userflagconfig_update({
        variables: {
          forUpdateUserflagconfig: {
            details: {
              flag1: {
                shape: flag[0].shape,
                color: flag[0].color,
              },
              flag2: {
                shape: flag[1].shape,
                color: flag[1].color,
              },
              flag3: {
                shape: flag[2].shape,
                color: flag[2].color,
              },
              flag4: {
                shape: flag[3].shape,
                color: flag[3].color,
              },
              flag5: {
                shape: flag[4].shape,
                color: flag[4].color,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeColor = useCallback(
    (_color, index) => {
      const newData = produce(flag, (draft) => {
        draft[index].color = _color;
      });
      setFlag(newData);
    },
    [flag]
  );
  const onChangeShape = useCallback(
    (_shape, index) => {
      const newData = produce(flag, (draft) => {
        draft[index].shape = _shape;
      });
      setFlag(newData);
    },
    [flag]
  );

  const shape_Option = [
    "heart",
    "HomeFilled",
    "FireFilled",
    "FlagFilled",
    "TagsFilled",
  ];

  const columns = [
    {
      title: "플래그 이름",
      dataIndex: "flag_number",
      key: "flag_number",
    },
    {
      title: "아이콘",
      dataIndex: "shape",
      key: "shape",
      // eslint-disable-next-line react/display-name
      render: (shape, record) => (
        <Select
          defaultValue={shape}
          size="small"
          onChange={(value) => {
            onChangeShape(value, record.key - 1);
          }}
        >
          {shape_Option.map((item) => {
            return (
              <Select.Option value={item} key={item}>
                <FlagIcon icon={item} color={flag[record.key - 1].color} />
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: "색상",
      dataIndex: "color",
      key: "color",
      render: (color, record) => (
        <ColorPicker
          color={color}
          onChangeColor={onChangeColor}
          index={record.key - 1}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={flag}
        pagination={false}
        loading={loading}
      />
      <Button onClick={submitFlag} loading={loading}>
        변경
      </Button>
    </>
  );
};
export default FlagSetting;

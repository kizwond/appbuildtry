/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from "react";
import { Select, Table, Button, message, Space } from "antd";
import ColorPicker from "./ColorPicker";
import FlagIcon from "./FlagIcon";
import produce from "immer";
import { GET_USER_FLAG_CONFIG } from "../../../../graphql/query/allQuery";
import { MUTATION_UPDATE_USER_FLAG_CONFIG } from "../../../../graphql/mutation/flagConfig";
import { useQuery, useMutation } from "@apollo/client";
import { StyledFlexAlignCenter } from "../../../common/styledComponent/page";
import { useRouter } from "next/router";

const M_FlagSetting = () => {
  const router = useRouter();
  const [flag, setFlag] = useState([]);

  const { loading, error, data } = useQuery(GET_USER_FLAG_CONFIG, {
    onCompleted: (data) => {
      if (data.userflagconfig_get.status === "200") {
        console.log(
          "프래그 설정 데이터(useQuery)",
          data.userflagconfig_get.userflagconfigs[0].details
        );
      } else if (data.userflagconfig_get.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  useEffect(() => {
    if (data) {
      console.log(
        "데이터 변경됨",
        data.userflagconfig_get.userflagconfigs[0].details
      );
      const flags_array = ["flag1", "flag2", "flag3", "flag4", "flag5"];
      const server_flags = data.userflagconfig_get.userflagconfigs[0].details;
      const for_flags_data = flags_array.map((flag, index) => ({
        key: index + 1,
        flag_number: flag,
        shape: server_flags[flag].shape,
        color: server_flags[flag].color,
      }));

      setFlag(for_flags_data);
    }
  }, [data]);

  const [userflagconfig_update] = useMutation(UPDATE_USER_FLAG_CONFIG, {
    onCompleted: (data) => {
      if (data.userflagconfig_update.status === "200") {
        console.log("책 플래그 변경 후 받은 데이터", data);
        message.success("색상표가 변경되었습니다.", 0.7);
      } else if (data.userflagconfig_update.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

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
  if (loading) <div>Loading...</div>;
  if (error) <div>Error...</div>;

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
      align: "center",
      className: "TableFirstColumn TextAlignCenterColumn",
      render: (v) => <StyledFlexAlignCenter>{v}</StyledFlexAlignCenter>,
    },
    {
      title: "아이콘",
      dataIndex: "shape",
      key: "shape",
      align: "center",
      className: "TableMiddleColumn TextAlignCenterColumn",
      // eslint-disable-next-line react/display-name
      render: (shape, record) => (
        <div>
          <Select
            defaultValue={shape}
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
        </div>
      ),
    },
    {
      title: "색상",
      dataIndex: "color",
      key: "color",
      align: "center",
      className: "TableLastColumn TextAlignCenterColumn",
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
      {data && (
        <>
          <Table
            columns={columns}
            dataSource={flag}
            pagination={false}
            loading={loading}
            size="small"
            rowClassName={(_, index) =>
              index % 2 === 0 && index === flag.length - 1
                ? "LastOddNumberRow"
                : index % 2 === 1 && index === flag.length - 1
                ? "LastEvenNumberRow"
                : index % 2 === 0
                ? "OddNumberRow"
                : "EvenNumberRow"
            }
          />
          <div style={{ marginTop: "8px", textAlign: "right" }}>
            <Button onClick={submitFlag} loading={loading}>
              변경
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default M_FlagSetting;

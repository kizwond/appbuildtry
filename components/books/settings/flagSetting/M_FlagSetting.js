/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from "react";
import { Select, Table, Button, message } from "antd";
import ColorPicker from "./ColorPicker";
import produce from "immer";
import { GET_USER_FLAG_CONFIG } from "../../../../graphql/query/allQuery";
import { useQuery, useMutation } from "@apollo/client";
import { StyledFlexAlignCenter } from "../../../common/styledComponent/page";
import { useRouter } from "next/router";
import { invertColor } from "../../../common/logic/calculateColor";
import UserFlagIcon from "../../../common/commonComponent/UserFlagIcon";
import { MUTATION_UPDATE_USER_FLAG_CONFIG } from "../../../../graphql/mutation/flagConfig";

const M_FlagSetting = () => {
  const router = useRouter();
  const [flag, setFlag] = useState([]);

  const { loading, error, data } = useQuery(GET_USER_FLAG_CONFIG, {
    onCompleted: (data) => {
      if (data.userflagconfig_get.status === "200") {
        console.log(
          "프래그 설정 데이터(useQuery)",
          data.userflagconfig_get.userflagconfigs[0]
        );
        const flags_array = ["flag1", "flag2", "flag3", "flag4", "flag5"];
        const server_flags = data.userflagconfig_get.userflagconfigs[0].details;
        const for_flags_data = flags_array.map((flag, index) => ({
          key: index + 1,
          flag_number: flag,
          figure: server_flags[flag].figure,
          figureColor: server_flags[flag].figureColor,
          textColor: server_flags[flag].textColor,
        }));

        setFlag(for_flags_data);
      } else if (data.userflagconfig_get.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     console.log(
  //       "데이터 변경됨",
  //       data.userflagconfig_get.userflagconfigs[0].details
  //     );

  //   }
  // }, [data]);

  const [userflagconfig_update] = useMutation(
    MUTATION_UPDATE_USER_FLAG_CONFIG,
    {
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
    }
  );

  const onChangeColor = useCallback(
    async (_figureColor, index) => {
      const newData = await produce(flag, (draft) => {
        draft[index].figureColor = _figureColor;
        draft[index].textColor = invertColor(_figureColor, true);
      });
      setFlag(newData);
    },
    [flag]
  );
  const onChangeFigure = useCallback(
    (_figure, index) => {
      const newData = produce(flag, (draft) => {
        draft[index].figure = _figure;
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
            userflagconfig_id: data.userflagconfig_get.userflagconfigs[0]._id,
            details: {
              flag1: {
                figure: flag[0].figure,
                figureColor: flag[0].figureColor,
                textColor: flag[0].textColor,
              },
              flag2: {
                figure: flag[1].figure,
                figureColor: flag[1].figureColor,
                textColor: flag[1].textColor,
              },
              flag3: {
                figure: flag[2].figure,
                figureColor: flag[2].figureColor,
                textColor: flag[2].textColor,
              },
              flag4: {
                figure: flag[3].figure,
                figureColor: flag[3].figureColor,
                textColor: flag[3].textColor,
              },
              flag5: {
                figure: flag[4].figure,
                figureColor: flag[4].figureColor,
                textColor: flag[4].textColor,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const figure_Option = ["flag", "star", "heart", "tag", "bookmark"];

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
      dataIndex: "figure",
      key: "figure",
      align: "center",
      className: "TableMiddleColumn TextAlignCenterColumn",
      // eslint-disable-next-line react/display-name
      render: (figure, record, rowIndex) => (
        <div>
          <Select
            defaultValue={figure}
            className="FlagSelector"
            onChange={(value) => {
              onChangeFigure(value, record.key - 1);
            }}
            style={{ width: 80 }}
            size="large"
            listHeight={300}
          >
            {figure_Option.map((item) => {
              return (
                <Select.Option value={item} key={item}>
                  <UserFlagIcon
                    figure={item}
                    color={flag[record.key - 1].figureColor}
                    textColor={flag[record.key - 1].textColor}
                    flagNumber={rowIndex}
                    iconRemSize={2}
                  />
                </Select.Option>
              );
            })}
          </Select>
        </div>
      ),
    },
    {
      title: "색상",
      dataIndex: "figureColor",
      key: "figureColor",
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

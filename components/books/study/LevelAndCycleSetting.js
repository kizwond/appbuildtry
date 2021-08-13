/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  Table,
  Tooltip,
} from '../../../node_modules/antd/lib/index';
import { GET_LEVEL_CONFIG } from '../../../graphql/query/levelconfig';
import { useQuery } from '@apollo/client';
import produce from 'immer';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const LevelAndCycleSetting = ({ book_id }) => {
  const [restudyOption, setRestudyOption] = useState([]);
  const [levelchangeSensitivity, setLevelchangeSensitivity] = useState(80);
  const [maxRatio, setMaxRatio] = useState(80);

  const { loading, error, data } = useQuery(GET_LEVEL_CONFIG, {
    variables: { mybook_id: book_id },
    onCompleted: (data) => funcOnCompletedUseQuery(data),
  });

  const funcOnCompletedUseQuery = (data) => {
    console.log(data);
    const restudy = data.levelconfig_get.levelconfigs[0].restudy;
    const restudy_option = restudy.option;
    const tableData = Object.keys(restudy_option)
      .filter((diffi) => diffi != '__typename')
      .map((diffi, index) => ({
        key: index,
        periodOption: [],
        difficulty:
          diffi == 'diffi1'
            ? '모르겠음'
            : diffi == 'diffi2'
            ? '거의 모르겠음'
            : diffi == 'diffi3'
            ? '애매함'
            : diffi == 'diffi4'
            ? '거의 알겠음'
            : diffi == 'diffi5'
            ? '알겠음'
            : 'Error', //구분
        nick: restudy_option[diffi].nick,
        period: restudy_option[diffi].period, // 세션 내 반복 주기
        shortcutkey: restudy_option[diffi].shortcutkey, //단축키
        gesture: restudy_option[diffi].gesture, //제스처
        on_off: restudy_option[diffi].on_off, //사용여부
      }));
    const newTableData = tableData.map((item, index) => {
      if (index == 0) {
        let diffi_preiodOptionArray = [];
        for (let i = 1; i < tableData[index + 1].period; i++) {
          diffi_preiodOptionArray.push(i);
        }
        item.periodOption = diffi_preiodOptionArray;
      }
      if (index == 4) {
        let diffi5_preiodOptionArray = [];
        for (let i = tableData[index - 1].period + 1; i < 61; i++) {
          diffi5_preiodOptionArray.push(i);
        }
        item.periodOption = diffi5_preiodOptionArray;
      }

      if (index < 4 && index > 0) {
        let diffi_preiodOptionArray = [];
        for (
          let i = tableData[index - 1].period + 1;
          i < tableData[index + 1].period;
          i++
        ) {
          diffi_preiodOptionArray.push(i);
        }
        item.periodOption = diffi_preiodOptionArray;
      }
      return item;
    });
    setRestudyOption(newTableData);
    setLevelchangeSensitivity(restudy.levelchangeSensitivity);
    setMaxRatio(restudy.maxRatio);
  };

  const onChangeNickName = (e, index) => {
    const newData = produce(restudyOption, (draft) => {
      draft[index].nick = e.target.value;
    });
    setRestudyOption(newData);
  };

  if (loading) <Table loading={loading} />;
  if (error) <div>Error : {erros}</div>;

  const columns = [
    {
      title: '구분',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },
    {
      title: '별칭',
      dataIndex: 'nick',
      key: 'nick',
      render: (nick, record) => (
        <Input
          placeholder={nick}
          allowClear
          onChange={(e) => {
            onChangeNickName(e, record.key);
          }}
        />
      ),
    },
    {
      title: '섹션 내 반복 주기',
      dataIndex: 'period',
      key: 'period',
      render: (period, record) => {
        return (
          <Select
            defaultValue={period}
            style={{ width: 60 }}
            onChange={(value) => {
              const tableData = produce(restudyOption, (draft) => {
                draft[record.key].period = value;

                draft = draft.map((item, index) => {
                  if (index == 0) {
                    let diffi_preiodOptionArray = [];
                    for (let i = 1; i < draft[index + 1].period; i++) {
                      diffi_preiodOptionArray.push(i);
                    }
                    item.periodOption = diffi_preiodOptionArray;
                  }
                  if (index == 4) {
                    let diffi5_preiodOptionArray = [];
                    for (let i = draft[index - 1].period + 1; i < 61; i++) {
                      diffi5_preiodOptionArray.push(i);
                    }
                    item.periodOption = diffi5_preiodOptionArray;
                  }

                  if (index < 4 && index > 0) {
                    let diffi_preiodOptionArray = [];
                    for (
                      let i = draft[index - 1].period + 1;
                      i < draft[index + 1].period;
                      i++
                    ) {
                      diffi_preiodOptionArray.push(i);
                    }
                    item.periodOption = diffi_preiodOptionArray;
                  }
                  return item;
                });
              });
              setRestudyOption(tableData);
            }}
          >
            {record.periodOption.map((num) => (
              <Select.Option value={num} key={num}>
                {num}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '단축키',
      dataIndex: 'shortcutkey',
      key: 'shortcutkey',
      render: (short, record) => (
        <Input
          placeholder={short}
          maxLength={1}
          style={{ width: 35 }}
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value == '') {
              setRestudyOption(
                produce(restudyOption, (draft) => {
                  draft[record.key].shortcutkey = null;
                })
              );
            }
            setRestudyOption(
              produce(restudyOption, (draft) => {
                draft[record.key].shortcutkey = e.target.value;
              })
            );
          }}
        />
      ),
    },
    {
      title: '제스처',
      dataIndex: 'gesture',
      key: 'gesture',
      render: (ges) => (
        <Select
          defaultValue={ges}
          style={{ width: 60 }}
          onChange={(value) => {}}
        >
          <Select.Option>없음</Select.Option>
          <Select.Option value="up" key="up">
            <Tooltip placement="top" title="위로">
              <div style={{ width: '100%' }}>
                <ArrowUpOutlined />
              </div>
            </Tooltip>
          </Select.Option>
          <Select.Option value="down" key="down">
            <Tooltip placement="bottom" title="아래로">
              <div style={{ width: '100%' }}>
                <ArrowDownOutlined />
              </div>
            </Tooltip>
          </Select.Option>
          <Select.Option value="left" key="left">
            <Tooltip placement="left" title="왼쪽">
              <div style={{ width: '100%' }}>
                <ArrowLeftOutlined />
              </div>
            </Tooltip>
          </Select.Option>
          <Select.Option value="right" key="right">
            <Tooltip placement="right" title="오른쪽">
              <div style={{ width: '100%' }}>
                <ArrowRightOutlined />
              </div>
            </Tooltip>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: '사용 여부',
      dataIndex: 'on_off',
      key: 'on_off',
      render: (on_off, record) => (
        <Checkbox
          defaultChecked={on_off == 'on' ? true : false}
          onChange={(e) => {
            console.log(e.target.checked);
            setRestudyOption(
              produce(restudyOption, (draft) => {
                draft[record.key].on_off = e.target.checked ? 'on' : 'off';
              })
            );
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={restudyOption} columns={columns} pagination={false} />
      <Divider />
      <div>레벨민감도 : {levelchangeSensitivity}</div>

      <div>최대비율: {maxRatio}</div>
      <button onClick={() => console.log(restudyOption)}>
        스테이터스 확인용
      </button>
    </div>
  );
};

export default LevelAndCycleSetting;

/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Input, Select, Table, Tooltip } from 'antd';
import {
  GET_LEVEL_CONFIG,
  UPDATE_LEVEL_CONFIG,
} from '../../../graphql/query/levelconfig';
import { useQuery, useMutation } from '@apollo/client';
import produce from 'immer';
import InputComponent from './InputComponent';
import PeriodComponent from './PeriodComponent';
import GestureComponent from './GestureComponent';
import { InputNumber, PageHeader } from '../../../node_modules/antd/lib/index';
import SliderCompoent from './SliderCompoent';

const LevelAndCycleSetting = ({ book_id }) => {
  const [restudyOption, setRestudyOption] = useState([]);
  const [levelchangeSensitivity, setLevelchangeSensitivity] = useState(80);
  const [maxRatio, setMaxRatio] = useState(80);

  const { loading, error, data, refetch } = useQuery(GET_LEVEL_CONFIG, {
    variables: { mybook_id: book_id },
    onCompleted: (data) => funcOnCompletedUseQuery(data, 'get'),
  });

  const [levelconfig_update] = useMutation(UPDATE_LEVEL_CONFIG);

  const funcOnCompletedUseQuery = (data, method) => {
    const restudy = data[`levelconfig_${method}`].levelconfigs[0].restudy;
    console.log(restudy);
    const restudy_option = restudy.option;
    const tableData = Object.keys(restudy_option)
      .filter((diffi) => diffi != '__typename')
      .map((diffi, index) => ({
        key: index,
        periodOption: [],
        diffi: diffi,
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
  let columns = [];
  if (data) {
    columns = [
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
          <InputComponent
            disabled={restudyOption[record.key].on_off === 'on' ? false : true}
            placeholder={nick}
            onChangeNickName={onChangeNickName}
            recordKey={record.key}
          />
        ),
      },
      {
        title: '섹션 내 반복 주기',
        dataIndex: 'period',
        key: 'period',
        width: 90,
        render: (period, record) => {
          const changePeriodOption = (newArray) => {
            setRestudyOption(newArray);
          };
          return (
            <PeriodComponent
              period={period}
              arrayIndex={record.key}
              selectOptionArray={record.periodOption}
              changePeriodOption={changePeriodOption}
              restudyOption={restudyOption}
            />
          );
        },
      },
      {
        title: '단축키',
        dataIndex: 'shortcutkey',
        key: 'shortcutkey',
        width: 40,
        render: (short, record) => (
          <Input
            disabled={restudyOption[record.key].on_off === 'on' ? false : true}
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
        width: 70,
        render: (gesture, record) => {
          const onChangeGesture = (_gesture) => {
            setRestudyOption(
              produce(restudyOption, (draft) => {
                draft[record.key].gesture = _gesture;
              })
            );
          };
          return (
            <GestureComponent
              gesture={gesture}
              on_off={restudyOption[record.key].on_off}
              onChangeGesture={onChangeGesture}
            />
          );
        },
      },
      {
        title: '사용 여부',
        dataIndex: 'on_off',
        key: 'on_off',
        width: 70,
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
  }

  const onChangeMaxRatio = (value) => {
    setMaxRatio(value);
  };
  const onChangeLevelchangeSensitivity = (value) => {
    setLevelchangeSensitivity(value);
  };

  const submitConfigToServer = async () => {
    let optionObject = {};
    console.log(levelchangeSensitivity);

    restudyOption.map((item) => {
      optionObject = {
        ...optionObject,
        [item.diffi]: {
          on_off: item.on_off,
          nick: item.nick,
          period: item.period,
          shortcutkey: item.shortcutkey,
          gesture: item.gesture,
        },
      };
    });

    try {
      await levelconfig_update({
        variables: {
          forUpdateLevelconfig: {
            mybook_id: book_id,
            restudy: {
              maxRatio: maxRatio,
              levelchangeSensitivity: levelchangeSensitivity,
              option: optionObject,
            },
          },
        },
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}
      >
        섹션 내 반복 주기
      </div>
      <Table
        size="small"
        bordered
        dataSource={restudyOption}
        columns={columns}
        pagination={false}
      />
      <div
        style={{ fontSize: '16px', fontWeight: 'bold', margin: '20px 0 4px 0' }}
      >
        복습 시작 기억량
      </div>
      <div>최대비율: {maxRatio}%</div>
      {data && (
        <>
          <InputNumber
            min={10}
            max={90}
            value={maxRatio}
            onChange={onChangeMaxRatio}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
          <SliderCompoent
            configured={data.levelconfig_get.levelconfigs[0].restudy.maxRatio}
            selected={maxRatio}
            onChange={onChangeMaxRatio}
            min={10}
            max={90}
          />
        </>
      )}
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          margin: '0 0 4px 0',
          paddingTop: '10px',
        }}
      >
        레벨 민감도
      </div>
      <div>레벨민감도 : {levelchangeSensitivity}</div>
      {data && (
        <>
          <InputNumber
            min={50}
            max={90}
            value={levelchangeSensitivity}
            onChange={onChangeLevelchangeSensitivity}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
          <SliderCompoent
            configured={
              data.levelconfig_get.levelconfigs[0].restudy
                .levelchangeSensitivity
            }
            selected={levelchangeSensitivity}
            onChange={onChangeLevelchangeSensitivity}
            min={50}
            max={90}
          />
        </>
      )}
      {/* <Slider
        marks={{
          0: '0',
          50: '50%',
          [data.levelconfig_get.levelconfigs[0].restudy.levelchangeSensitivity]:
            {
              style: {
                color: '#f50',
              },
              label: <strong>현재</strong>,
            },
          90: '90%',
          100: '100%',
        }}
        tipFormatter={formatter}
        tooltipVisible={true}
        defaultValue={levelchangeSensitivity}
        value={
          typeof levelchangeSensitivity === 'number'
            ? levelchangeSensitivity
            : 10
        }
        onChange={(value) => {
          if (value > 90) {
            return;
          }
          if (value < 50) {
            return;
          }
          setLevelchangeSensitivity(value);
        }}
      /> */}
      <Button loading={loading} onClick={submitConfigToServer}>
        제출하기
      </Button>
    </div>
  );
};

export default LevelAndCycleSetting;

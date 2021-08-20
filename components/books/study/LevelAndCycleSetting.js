/* eslint-disable react/display-name */
import React, { useCallback, useState } from 'react';
import { Button, Checkbox, Table, Tooltip } from 'antd';
import {
  GET_LEVEL_CONFIG,
  UPDATE_LEVEL_CONFIG,
} from '../../../graphql/query/levelconfig';
import { useQuery, useMutation } from '@apollo/client';
import produce from 'immer';
import NickInput from './NickInput';
import PeriodComponent from './PeriodComponent';
import GestureComponent from './GestureComponent';
import { InputNumber } from '../../../node_modules/antd/lib/index';
import SliderCompoent from './SliderCompoent';
import ShortcutkeyInput from './ShortcutkeyInput';

const LevelAndCycleSetting = ({ book_id }) => {
  const [restudyOption, setRestudyOption] = useState([]);
  const [levelchangeSensitivity, setLevelchangeSensitivity] = useState(80);
  const [restudyRatio, setRestudyRatio] = useState(80);

  const { loading, error, data, refetch } = useQuery(GET_LEVEL_CONFIG, {
    variables: { mybook_id: book_id },
    onCompleted: (data) => funcOnCompletedUseQuery(data, 'get'),
  });

  const [levelconfig_update] = useMutation(UPDATE_LEVEL_CONFIG);

  const funcOnCompletedUseQuery = (data, method) => {
    const restudy = data[`levelconfig_${method}`].levelconfigs[0].restudy;
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
      if (index == 3) {
        let diffi5_preiodOptionArray = [];
        for (let i = tableData[index - 1].period + 1; i < 61; i++) {
          diffi5_preiodOptionArray.push(i);
        }
        item.periodOption = diffi5_preiodOptionArray;
      }

      if (index < 3 && index > 0) {
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
    setRestudyRatio(restudy.restudyRatio);
  };

  function onChangeRestudyOption(selected_value, index, name) {
    // 함수에 들어가는 인자를 불러오는 arguments를 쓰기 위해서는 const, let 으로 할당하면 안되고
    // 함수 선언을 하여야한다.
    if (arguments.length > 1) {
      const newData = produce(restudyOption, (draft) => {
        draft[index][name] = selected_value;
      });
      setRestudyOption(newData);
    } else {
      setRestudyOption(selected_value);
    }
  }
  const methodsSetStateObject = {
    restudyRatio: (value) => {
      setRestudyRatio(value);
    },
    levelchangeSensitivity: (value) => {
      setLevelchangeSensitivity(value);
    },
    restudyOption: (value, index, property) => {
      const newData = produce(restudyOption, (draft) => {
        draft[index][property] = value;
      });
      setRestudyOption((prev) => newData);
    },
    restudyOptionPeriod: (value) => {
      setRestudyOption(value);
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeState = useCallback((callback, value, index, property) => {
    methodsSetStateObject[callback](value, index, property);
  });

  if (loading) <Table loading={loading} />;
  if (error) <div>Error : {erros}</div>;
  let columns = [];
  if (data) {
    columns = [
      {
        title: '구분',
        dataIndex: 'difficulty',
        // key: 'difficulty',
      },
      {
        title: '별칭',
        dataIndex: 'nick',
        // key: 'nick',
        render: (nick, record, index) => (
          <NickInput
            disabled={restudyOption[index].on_off === 'on' ? false : true}
            restudyOption={restudyOption}
            selectedNick={nick}
            onChangeState={onChangeState}
            index={index}
          />
        ),
      },
      {
        title: '섹션 내 반복 주기',
        dataIndex: 'period',
        key: 'period',
        width: 90,
        render: (period, record, index) => {
          if (index == 4) {
            return <span style={{ color: 'gray' }}>세션 탈출</span>;
          }
          return (
            <PeriodComponent
              period={period}
              index={index}
              selectOptionArray={record.periodOption}
              onChangeState={onChangeState}
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
        render: (short, record, index) => (
          <ShortcutkeyInput
            disabled={restudyOption[index].on_off === 'on' ? false : true}
            selectedShortcutkey={short}
            index={index}
            restudyOption={restudyOption}
            onChangeRestudyOption={onChangeRestudyOption}
          />
        ),
      },
      {
        title: '제스처',
        dataIndex: 'gesture',
        key: 'gesture',
        width: 70,
        render: (gesture, record, index) => {
          return (
            <GestureComponent
              gesture={gesture}
              index={index}
              on_off={restudyOption[index].on_off}
              onChangeRestudyOption={onChangeRestudyOption}
            />
          );
        },
      },
      {
        title: '사용 여부',
        dataIndex: 'on_off',
        key: 'on_off',
        width: 70,
        render: (on_off, record, index) => {
          if (index == 4) {
            return (
              <Tooltip title="변경불가">
                <Checkbox disabled checked />
              </Tooltip>
            );
          }
          return (
            <Checkbox
              defaultChecked={on_off == 'on' ? true : false}
              onChange={(e) => {
                const on_off = e.target.checked ? 'on' : 'off';
                onChangeRestudyOption(on_off, index, 'on_off');
              }}
            />
          );
        },
      },
    ];
  }

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
              restudyRatio: restudyRatio,
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
        loading={loading}
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
      <div>최대비율: {restudyRatio}%</div>
      {data && (
        <>
          <InputNumber
            min={10}
            max={90}
            value={restudyRatio}
            onChange={(_value) => onChangeState('restudyRatio', _value)}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
          <SliderCompoent
            configured={
              data.levelconfig_get.levelconfigs[0].restudy.restudyRatio
            }
            selected={restudyRatio}
            onChange={(_value) => onChangeState('restudyRatio', _value)}
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
            onChange={(_value) =>
              onChangeState('levelchangeSensitivity', _value)
            }
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
          <SliderCompoent
            configured={
              data.levelconfig_get.levelconfigs[0].restudy
                .levelchangeSensitivity
            }
            selected={levelchangeSensitivity}
            onChange={(_value) =>
              onChangeState('levelchangeSensitivity', _value)
            }
            min={50}
            max={90}
          />
        </>
      )}
      <Button loading={loading} onClick={submitConfigToServer}>
        제출하기
      </Button>
    </div>
  );
};

export default LevelAndCycleSetting;

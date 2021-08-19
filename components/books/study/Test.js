import React, { useEffect, useState } from 'react';
import { Input, Table } from '../../../node_modules/antd/lib/index';
import produce from 'immer';

const Test = ({ data }) => {
  const [diffi1_nick, setDiffi1_nick] = useState();
  const [diffi2_nick, setDiffi2_nick] = useState();
  const [diffi3_nick, setDiffi3_nick] = useState();
  const [diffi4_nick, setDiffi4_nick] = useState();
  const [diffi5_nick, setDiffi5_nick] = useState();

  useEffect(() => {
    if (data) {
      const 받은데이터 = produce(
        data.levelconfig_get.levelconfigs[0].restudy.option,
        (draft) => {
          delete draft['__typename'];
          for (let key in draft) {
            delete draft[key]['__typename'];
          }
        }
      );
      console.log(받은데이터);

      // 난이도_안_객체_키_배열 = Object.keys(받은데이터(난이도_배열[0]));
      const obj = {
        diffi1: {
          nick: (v) => {
            setDiffi1_nick(v);
          },
        },
        diffi2: {
          nick: (v) => {
            setDiffi2_nick(v);
          },
        },
        diffi3: {
          nick: (v) => {
            setDiffi3_nick(v);
          },
        },
        diffi4: {
          nick: (v) => {
            setDiffi4_nick(v);
          },
        },
        diffi5: {
          nick: (v) => {
            setDiffi5_nick(v);
          },
        },
      };
      const change = (value, diffi, key) => {
        obj[diffi][key](value);
      };
      for (let key in 받은데이터) {
        for (let k in 받은데이터[key]) {
          if (k == 'nick') {
            console.log(받은데이터[key][k]);
            change(받은데이터[key][k], key, k);
          }
        }
      }
    }
  }, [data]);

  const onChange = (value, index) => {
    if (index == 0) {
      setDiffi1_nick(value);
    }
    if (index == 1) {
      setDiffi2_nick(value);
    }
    if (index == 2) {
      setDiffi3_nick(value);
    }
    if (index == 3) {
      setDiffi4_nick(value);
    }
    if (index == 4) {
      setDiffi5_nick(value);
    }
  };
  const columns = [
    {
      title: '별칭',
      dataIndex: 'nick',
      key: 'nick',
      // eslint-disable-next-line react/display-name
      render: (nick, index) => (
        <Input
          placeholder={nick}
          onChange={(value) => {
            onChange(value, index);
          }}
        />
      ),
    },
  ];

  let dataSource = [
    { nick: diffi1_nick },
    { nick: diffi2_nick },
    { nick: diffi3_nick },
    { nick: diffi4_nick },
    { nick: diffi5_nick },
  ];

  // useEffect(() => {
  //   dataSource[0] = diffi1_nick;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [diffi1_nick]);
  return <Table columns={columns} dataSource={dataSource} />;
};

export default Test;

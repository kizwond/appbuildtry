/* eslint-disable react/display-name */
import React, { useCallback, useState } from "react";
import { Button, Table, InputNumber } from "antd";
import { UPDATE_LEVEL_CONFIG } from "../../../../graphql/query/levelconfig";
import { QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS } from "../../../../graphql/query/allQuery";

import { useQuery, useMutation } from "@apollo/client";
import RateSlider from "./RateSlider";
import SectionWrapper from "../../../common/commonComponent/SectionWrapper";

const M_LevelAndCycleSetting = ({ book_id }) => {
  const [levelchangeSensitivity, setLevelchangeSensitivity] = useState(80);
  const [restudyRatio, setRestudyRatio] = useState(80);
  const [maxRestudyMinuteInsideSession, setMaxRestudyMinuteInsideSession] =
    useState(80);

  const { loading, error, data } = useQuery(
    QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS,
    {
      variables: { mybook_ids: [book_id] },
      onCompleted: (data) => funcOnCompletedUseQuery(data),
    }
  );

  const [levelconfig_update] = useMutation(UPDATE_LEVEL_CONFIG, {
    onCompleted: (data) => console.log("뮤태 후", data),
  });

  const funcOnCompletedUseQuery = (data) => {
    console.log("useQuery데이터", data);
    const {
      levelchangeSensitivity,
      restudyRatio,
      maxRestudyMinuteInsideSession,
    } = data.levelconfig_getLevelconfigs.levelconfigs[0].restudy;

    setLevelchangeSensitivity(levelchangeSensitivity);
    setRestudyRatio(restudyRatio);
    setMaxRestudyMinuteInsideSession(maxRestudyMinuteInsideSession);
  };

  if (loading) <Table loading={loading} />;
  if (error) <div>Error : {error}</div>;

  const onChangeRestudyRatio = useCallback((value) => {
    setRestudyRatio(value);
  }, []);
  const onChangeLevelchangeSensitivity = useCallback((value) => {
    setLevelchangeSensitivity(value);
  }, []);
  const onChangeMaxRestudyMinuteInsideSession = useCallback((value) => {
    setMaxRestudyMinuteInsideSession(value);
  }, []);

  const submitConfigToServer = async () => {
    try {
      await levelconfig_update({
        variables: {
          forUpdateLevelconfig: {
            mybook_id: book_id,
            restudy: {
              restudyRatio,
              levelchangeSensitivity,
              maxRestudyMinuteInsideSession,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {data && (
        <>
          <SectionWrapper
            title="섹션 내 최대 복습 주기"
            content={
              <>
                <div>레벨민감도 : {maxRestudyMinuteInsideSession}</div>
                <InputNumber
                  min={5}
                  max={120}
                  value={maxRestudyMinuteInsideSession}
                  onChange={onChangeMaxRestudyMinuteInsideSession}
                  formatter={(value) => `${value}분`}
                  parser={(value) => value.replace("분", "")}
                />
                <RateSlider
                  configured={
                    data.levelconfig_getLevelconfigs.levelconfigs[0].restudy
                      .maxRestudyMinuteInsideSession
                  }
                  selected={maxRestudyMinuteInsideSession}
                  onChange={onChangeMaxRestudyMinuteInsideSession}
                  min={5}
                  max={120}
                  step={1}
                  format="분"
                />
              </>
            }
          />
          <SectionWrapper
            title="복습 시작 기억률"
            content={
              <>
                <div>최대비율: {restudyRatio}%</div>
                <InputNumber
                  min={0}
                  max={94.9}
                  value={restudyRatio}
                  onChange={onChangeRestudyRatio}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                />
                <RateSlider
                  configured={
                    data.levelconfig_getLevelconfigs.levelconfigs[0].restudy
                      .restudyRatio
                  }
                  selected={restudyRatio}
                  onChange={onChangeRestudyRatio}
                  min={0}
                  max={94.9}
                  step={0.1}
                  format="%"
                />
              </>
            }
          />
          <SectionWrapper
            title="레벨 민감도"
            content={
              <>
                <div>레벨민감도 : {levelchangeSensitivity}</div>
                <InputNumber
                  min={50}
                  max={100}
                  value={levelchangeSensitivity}
                  onChange={onChangeLevelchangeSensitivity}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                />
                <RateSlider
                  configured={
                    data.levelconfig_getLevelconfigs.levelconfigs[0].restudy
                      .levelchangeSensitivity
                  }
                  selected={levelchangeSensitivity}
                  onChange={onChangeLevelchangeSensitivity}
                  min={50}
                  max={100}
                  step={1}
                  format="%"
                />
              </>
            }
          />
        </>
      )}

      <Button loading={loading} onClick={submitConfigToServer}>
        제출하기
      </Button>
    </div>
  );
};

export default M_LevelAndCycleSetting;

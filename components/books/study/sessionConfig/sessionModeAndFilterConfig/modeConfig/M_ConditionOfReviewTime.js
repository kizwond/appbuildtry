import { memo, useCallback } from "react";
import { Radio, Col, Row } from "antd";
import styled from "styled-components";
import moment from "moment";
import StyledAntdDatePicker from "../../../../../common/styledComponent/antd/StyledAntdDatePicker";

const breakPoint = [
  {
    span: 4,
  },
  {
    span: 6,
  },
  {
    span: 8,
  },
];

const M_ConditionOfReviewTime = ({
  needStudyTimeCondition,
  changeNeedStudyTimeCondition,
  needStudyTimeRange,
  changeNeedStudyTimeRange,
}) => {
  const onChange = useCallback(
    (date, dateString) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

      const startYear = date[0]._d.getFullYear();
      const selectedStartDate = moment(
        `${startYear}-${dateString[0]}`,
        "YYYY-MM-DD"
      );
      const differenceFromStart = moment
        .duration(selectedStartDate.diff(today))
        .asDays();
      const endYear = date[1]._d.getFullYear();
      const selectedEndDate = moment(
        `${endYear}-${dateString[1]}`,
        "YYYY-MM-DD"
      );
      const differenceFromEnd = moment
        .duration(selectedEndDate.diff(today))
        .asDays();

      changeNeedStudyTimeRange([differenceFromStart, differenceFromEnd]);
    },
    [changeNeedStudyTimeRange]
  );

  const handlerRadioChange = useCallback((e) => {
    changeNeedStudyTimeCondition(e.target.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Radio.Group
      onChange={handlerRadioChange}
      value={needStudyTimeCondition}
      size="small"
    >
      <StyledRow wrap={false}>
        <Col {...breakPoint[0]}>
          <StyledRadio value="all">전체</StyledRadio>
        </Col>
        <Col {...breakPoint[1]}>
          <StyledRadio value="untilNow">현재 이전</StyledRadio>
        </Col>
        <Col {...breakPoint[1]}>
          <StyledRadio value="untilToday">오늘 이전</StyledRadio>
        </Col>
        <Col {...breakPoint[2]}>
          <Row>
            <StyledRadio value="custom">직접입력</StyledRadio>
          </Row>
        </Col>
      </StyledRow>
      <Row wrap={false} justify="end">
        {needStudyTimeCondition === "custom" && (
          <Col>
            <StyledAntdDatePicker
              allowClear={false}
              placeholder={["시작", "종료"]}
              format="MM-DD"
              value={[
                needStudyTimeRange[0] == 0
                  ? moment()
                  : moment().add(needStudyTimeRange[0], "days"),
                needStudyTimeRange[1] == 0
                  ? moment()
                  : moment().add(needStudyTimeRange[1], "days"),
              ]}
              onChange={onChange}
              size="small"
            />
          </Col>
        )}
      </Row>
    </Radio.Group>
  );
};

export default memo(M_ConditionOfReviewTime);

const StyledRadio = styled(Radio)`
  & span.ant-radio + * {
    padding-right: 0px;
    padding-left: 3px;
    align-self: center;
  }
`;
const StyledRow = styled(Row)`
  & .ant-radio-wrapper {
    margin-right: 2px;
  }
`;

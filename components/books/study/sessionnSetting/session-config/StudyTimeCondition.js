import { memo } from "react";
import { Radio, DatePicker, Col, Row } from "antd";
import styled from "styled-components";
import moment from "moment";
import StyledDatePicker from "./StyledDatePicker";

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

const StudyTimeCondition = ({ mode, selected, changeNeedStudyTimeCondition, changeNeedStudyTimeRange, selectedRange }) => {
  const [read, flip, exam] = selected;
  const [readRange, flipRange, examRange] = selectedRange;

  const selectedSTC = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : "오류";
  const selectedRg = mode === "read" ? readRange : mode === "flip" ? flipRange : mode === "exam" ? examRange : "오류";
  return (
    <Radio.Group onChange={(e) => changeNeedStudyTimeCondition(mode, e.target.value)} value={selectedSTC} size="small">
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
          <Row wrap={false}>
            {selectedSTC === "custom" && (
              <>
                <StyledDatePicker
                  placeholder={["시작", "종료"]}
                  format="MM-DD"
                  value={[selectedRg[0] == 0 ? moment() : moment().add(selectedRg[0], "days"), selectedRg[1] == 0 ? moment() : moment().add(selectedRg[1], "days")]}
                  onChange={(date, dateString) => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth() + 1;
                    const day = now.getDate();
                    const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

                    const startYear = date[0]._d.getFullYear();
                    const selectedStartDate = moment(`${startYear}-${dateString[0]}`, "YYYY-MM-DD");
                    const differenceFromStart = moment.duration(selectedStartDate.diff(today)).asDays();
                    const endYear = date[1]._d.getFullYear();
                    const selectedEndDate = moment(`${endYear}-${dateString[1]}`, "YYYY-MM-DD");
                    const differenceFromEnd = moment.duration(selectedEndDate.diff(today)).asDays();

                    changeNeedStudyTimeRange(mode, [differenceFromStart, differenceFromEnd]);
                  }}
                  size="small"
                />
              </>
            )}
          </Row>
        </Col>
      </StyledRow>
    </Radio.Group>
  );
};

export default memo(StudyTimeCondition);

const StyledRadio = styled(Radio)`
  & span.ant-radio + * {
    padding-right: 0px;
    padding-left: 3px;
  }
`;
const StyledRow = styled(Row)`
  & .ant-radio-wrapper {
    margin-right: 2px;
  }
  & .ant-picker-input > input {
    font-size: 10px;
  }
  & .anticon-swap-right > svg {
    font-size: 14px;
  }
  & .ant-picker.ant-picker-range.ant-picker-small {
    max-width: 140px;
  }
`;

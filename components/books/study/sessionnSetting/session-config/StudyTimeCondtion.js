import { Radio, DatePicker, Col, Row } from "antd";
import styled from "styled-components";
import moment from "moment";
import StyledDatePicker from "./StyledDatePicker";

const StudyTimeCondtion = ({ mode, selected, changeNeedStudyTimeCondition, changeNeedStudyTimeRange, selectedRange }) => {
  const [read, flip, exam] = selected;
  const [readRange, flipRange, examRange] = selectedRange;

  const selectedSTC = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : "오류";
  const selectedRg = mode === "read" ? readRange : mode === "flip" ? flipRange : mode === "exam" ? examRange : "오류";
  return (
    <Radio.Group onChange={(e) => changeNeedStudyTimeCondition(mode, e.target.value)} value={selectedSTC} size="small">
      <StyledRow gutter={1} wrap={false}>
        <Col span={4}>
          <StyledRadio value="all">전체</StyledRadio>
        </Col>
        <Col span={5}>
          <StyledRadio value="untilNow">현재 이전</StyledRadio>
        </Col>
        <Col span={5}>
          <StyledRadio value="untilToday">오늘 이전</StyledRadio>
        </Col>
        <Col span={10}>
          <Row>
            <StyledRadio value="custom">직접입력</StyledRadio>
          </Row>
          <Row wrap={false}>
            {selectedSTC === "custom" && (
              <>
                <StyledDatePicker
                  // value={selectedRg[0] == 0 ? moment() : moment().add(selectedRg[0], "days")}
                  // dateRender={(current) => {
                  //   console.log(current);
                  //   const style = {};
                  //   if (current.format("YYYY-MM-DD") === moment().add(selectedRg[0], "days").format("YYYY-MM-DD") || current.format("YYYY-MM-DD") === moment().add(selectedRg[1], "days").format("YYYY-MM-DD")) {
                  //     style.color = "#fff";
                  //     style.background = "#1890ff";
                  //   }
                  //   if (current.format("YYYY-MM-DD") > moment().add(selectedRg[0], "days").format("YYYY-MM-DD") && current.format("YYYY-MM-DD") < moment().add(selectedRg[1], "days").format("YYYY-MM-DD")) {
                  //     style.background = "#e6f7ff";
                  //   }
                  //   return (
                  //     <div className="ant-picker-cell-inner" style={style}>
                  //       {current.date()}
                  //     </div>
                  //   );
                  // }}
                  // format="MM-DD"
                  // placeholder={["시작"]}
                  // showToday={false}
                  // onChange={(date, dateString) => {
                  //   console.log({ date, dateString });
                  //   const now = new Date();
                  //   const year = now.getFullYear();
                  //   const month = now.getMonth() + 1;
                  //   const day = now.getDate();
                  //   const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

                  //   const startYear = date._d.getFullYear();
                  //   const selectedDate = moment(`${startYear}-${dateString}`, "YYYY-MM-DD");

                  //   const difference = moment.duration(selectedDate.diff(today)).asDays();

                  //   if (difference <= selectedRg[1]) {
                  //     changeNeedStudyTimeRange(mode, [difference, selectedRg[1]]);
                  //   } else if (difference > selectedRg[1]) {
                  //     changeNeedStudyTimeRange(mode, [difference, difference]);
                  //   }
                  // }}
                  size="small"
                />
                ~
                <DatePicker
                  value={selectedRg[1] == 0 ? moment() : moment().add(selectedRg[1], "days")}
                  dateRender={(current) => {
                    console.log(current);
                    const style = {};
                    if (current.format("YYYY-MM-DD") === moment().add(selectedRg[0], "days").format("YYYY-MM-DD") || current.format("YYYY-MM-DD") === moment().add(selectedRg[1], "days").format("YYYY-MM-DD")) {
                      style.color = "#fff";
                      style.background = "#1890ff";
                    }
                    if (current.format("YYYY-MM-DD") > moment().add(selectedRg[0], "days").format("YYYY-MM-DD") && current.format("YYYY-MM-DD") < moment().add(selectedRg[1], "days").format("YYYY-MM-DD")) {
                      style.background = "#e6f7ff";
                    }
                    return (
                      <div className="ant-picker-cell-inner" style={style}>
                        {current.date()}
                      </div>
                    );
                  }}
                  format="MM-DD"
                  placeholder={["시작"]}
                  showToday={false}
                  onChange={(date, dateString) => {
                    console.log({ date, dateString });
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth() + 1;
                    const day = now.getDate();
                    const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

                    const startYear = date._d.getFullYear();
                    const selectedDate = moment(`${startYear}-${dateString}`, "YYYY-MM-DD");

                    const difference = moment.duration(selectedDate.diff(today)).asDays();

                    if (difference >= selectedRg[0]) {
                      changeNeedStudyTimeRange(mode, [selectedRg[0], difference]);
                    } else if (difference < selectedRg[0]) {
                      changeNeedStudyTimeRange(mode, [difference, difference]);
                    }
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

export default StudyTimeCondtion;

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
    font-size: 0.7rem;
  }
`;

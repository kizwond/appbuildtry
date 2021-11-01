import { GET_MENTORING, REQUEST_MENTORING, SEARCH_USER_INFO, GET_BOOKS_INFO } from "../../../graphql/query/mentoring";
import _ from "lodash";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

import { Badge, Button, Card, Col, Drawer, Table, Tabs, Row, Space } from "antd";

const MentoringHome = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [getBooksInfo, { data: menteeBooks, error, loading }] = useLazyQuery(GET_BOOKS_INFO, {
    onCompleted: (data) => console.log({ 책정보: data }),
  });

  const [getMentoring, { data: mentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING, {
    onCompleted: (data) => {
      const mentoInfo = data.mentoring_getMentoring.mentorings[0];
      // const receivedReqsBooksIds = _(mentoInfo.receivedReqs)
      //   .filter((req) => req.reqStatus === "waiting")
      //   .map((req) => req.mybook_id)
      //   .value();

      const myMenteeBooksIds = _(mentoInfo.myMentees)
        .map((mentee) => mentee.mybook_id)
        .value();
      // const myMentorBooksIds = _(mentoInfo.myMentors)
      //   .map((mentor) => mentor.mybook_id)
      //   .value();

      getBooksInfo({
        variables: {
          mybook_ids: myMenteeBooksIds,
        },
      });
    },
  });

  useEffect(() => {
    getMentoring();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error || error1) <div>error</div>;
  if (loading || loading1) <div>loading</div>;

  if (menteeBooks) {
    console.log({ menteeBooks });
  }
  if (mentoringData) {
    console.log({ mentoringData });
  }

  if (menteeBooks && mentoringData) {
    console.log(_.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: "617f6ac3631f4b26a044b856" }));
  }

  return (
    <div>
      {menteeBooks && mentoringData && (
        <>
          <Card size="small">
            <Tabs size="small">
              <Tabs.TabPane tab="멘티" key="멘티">
                <Badge size="small" count={3}>
                  <Button size="small" onClick={() => setDrawerVisible((prev) => !prev)}>
                    멘토링 요청 수락
                  </Button>
                </Badge>
                <Table
                  size="small"
                  dataSource={_(mentoringData.mentoring_getMentoring.mentorings[0].myMentees)
                    .map(({ mybookTitle, menteeGroup_id, mybook_id, menteeUsername, menteeName }) => ({
                      key: mybook_id,
                      mybookTitle,
                      mybook_id,
                      menteeUsername,
                      menteeName,
                      menteeGroup_id,
                      menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: menteeGroup_id }).name,
                      studyHistory: _(_.find(menteeBooks.mybook_getManyMybookInfo.mybooks, (book) => book._id === mybook_id).stats.studyHistory)
                        .map((history) => history.studyHour)
                        .take(5)
                        .value(),
                    }))
                    .value()}
                  columns={[
                    {
                      title: "그룹",
                      dataIndex: "menteeGroupName",
                      key: "menteeGroupName",
                    },
                    {
                      title: "책",
                      dataIndex: "mybookTitle",
                      key: "myBookTitle",
                    },
                    {
                      title: "멘티",
                      dataIndex: "menteeName",
                      key: "menteeName",
                    },
                    {
                      title: "학습이력",
                      dataIndex: "studyHistory",
                      key: "studyHistory",
                    },
                  ]}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="멘토" key="멘토"></Tabs.TabPane>
            </Tabs>
          </Card>
          <Drawer title="멘토링 요청 수락" placement="right" width={"100%"} visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
            <Row>
              <Col span={4}>책</Col>
              <Col span={4}>멘티이름</Col>
              <Col span={3}>요청 날짜</Col>
              <Col span={6}>커멘트</Col>
              <Col span={5}>수락여부</Col>
            </Row>
            {_(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
              .map(
                ({ comment, menteeName, menteeOrganization, menteeUser_id, menteeUsername, mentorName, mentorOrganization, mentorUser_id, mentorUsername, mybookTitle, mybook_id, processedDate, reqDate, reqStatus }) => (
                  <Row key={`${menteeUser_id}${mybook_id}`} wrap={false}>
                    <Col span={4}>{mybookTitle}</Col>
                    <Col span={4}>{menteeUsername}</Col>
                    <Col span={3}>{reqDate}</Col>
                    <Col span={6}>{comment}</Col>
                    <Col span={5}>
                      <Space>
                        <Button size="small">수락</Button>
                        <Button size="small">거절</Button>
                      </Space>
                    </Col>
                  </Row>
                )
              )
              .value()}
          </Drawer>
        </>
      )}
    </div>
  );
};

export default MentoringHome;

import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import _, { divide } from "lodash";

import { GET_MENTORING, REQUEST_MENTORING, SEARCH_USER_INFO, GET_BOOKS_INFO, ACCEPT_MENTORING_REQUEST } from "../../../graphql/query/mentoring";

import { Badge, Button, Card, Col, Drawer, Table, Tabs, Row, Avatar, Select, Space } from "antd";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";

const MentoringHome = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const selectorRef = useRef();

  const [getBooksInfo, { data: menteeBooks, error, loading }] = useLazyQuery(GET_BOOKS_INFO, {
    fetchPolicy: "network-only",
    onCompleted: (data) => console.log({ 책정보: data }),
  });

  const [getMentoring, { data: mentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const mentoInfo = data.mentoring_getMentoring.mentorings[0];

      const myMenteeBooksIds = _(mentoInfo.myMentees)
        .map((mentee) => mentee.mybook_id)
        .value();

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

  const [acceptMentroingRequest] = useMutation(ACCEPT_MENTORING_REQUEST, {
    onCompleted: (d) => getMentoring(),
  });

  const newData = useMemo(() => {
    return (
      menteeBooks &&
      mentoringData &&
      _(mentoringData.mentoring_getMentoring.mentorings[0].myMentees)
        .map(({ mybookTitle, menteeGroup_id, mybook_id, menteeUsername, menteeName }) => ({
          key: mybook_id,
          mybookTitle,
          mybook_id,
          menteeUsername,
          menteeName,
          menteeGroup_id,
          menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: menteeGroup_id }).name,
          studyHistory:
            _(_.find(menteeBooks.mybook_getManyMybookInfo.mybooks, (book) => book._id === mybook_id).stats?.studyHistory)
              .map((history) => history.studyHour)
              .take(5)
              .value() === []
              ? _(_.find(menteeBooks.mybook_getManyMybookInfo.mybooks, (book) => book._id === mybook_id).stats.studyHistory)
                  .map((history) => history.studyHour)
                  .take(5)
                  .value()
              : ["0.5", "2", "0", "1", "2"],
        }))
        .value()
    );
  }, [menteeBooks, mentoringData]);

  const menteeGroupSelector = useMemo(() => {
    return (
      mentoringData && (
        <>
          <Select defaultValue={mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup[0]._id} size="small" onChange={(v) => (selectorRef.current = v)}>
            {mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup.map((group: any) => (
              <Select.Option key={group._id} value={group._id}>
                {group.name}
              </Select.Option>
            ))}
            {/* <Select.Option value="미지정">dk </Select.Option>
            <Select.Option value="그룹1">그룹1 </Select.Option>
            <Select.Option value="그룹2">그룹2 </Select.Option> */}
          </Select>
        </>
      )
    );
  }, [mentoringData]);

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
        <MentoringWrapper>
          <Card size="small" bordered={false}>
            <Tabs size="small">
              <Tabs.TabPane tab="멘티" key="멘티">
                <Badge
                  size="small"
                  count={
                    _(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
                      .filter(({ reqStatus }) => reqStatus !== "accepted")
                      .value().length
                  }
                >
                  <Button
                    size="small"
                    onClick={() => setDrawerVisible((prev) => !prev)}
                    disabled={
                      _(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
                        .filter(({ reqStatus }) => reqStatus !== "accepted")
                        .value().length === 0
                    }
                  >
                    받은 요청
                  </Button>
                </Badge>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={newData}
                  columns={[
                    {
                      title: "그룹",
                      dataIndex: "menteeGroupName",
                      width: "15%",
                    },
                    {
                      title: "책",
                      dataIndex: "mybookTitle",
                      width: "25%",
                    },
                    {
                      title: "멘티",
                      dataIndex: "menteeName",
                      width: "15%",
                    },
                    {
                      title: "학습이력",
                      dataIndex: "studyHistory",
                      width: "35%",
                      // eslint-disable-next-line react/display-name
                      render: (v) => (
                        <>
                          {v.map((item: any, index: number) => (
                            <span key={index}>{`${index === 4 ? item : `${item}, `}`} </span>
                          ))}
                        </>
                      ),
                    },
                  ]}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="멘토" key="멘토">
                <Space>
                  <Button size="small" onClick={() => setDrawerVisible((prev) => !prev)}>
                    보낸 요청
                  </Button>
                  <Button size="small" shape="circle" type="primary">
                    <PlusOutlined style={{ fontSize: "14px" }} />
                  </Button>
                </Space>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={newData}
                  columns={[
                    {
                      title: "그룹",
                      dataIndex: "menteeGroupName",
                      width: "15%",
                    },
                    {
                      title: "책",
                      dataIndex: "mybookTitle",
                      width: "25%",
                    },
                    {
                      title: "멘티",
                      dataIndex: "menteeName",
                      width: "15%",
                    },
                    {
                      title: "학습이력",
                      dataIndex: "studyHistory",
                      width: "35%",
                      // eslint-disable-next-line react/display-name
                      render: (v) => (
                        <>
                          {v.map((item: any, index: number) => (
                            <span key={index}>{`${index === 4 ? item : `${item}, `}`} </span>
                          ))}
                        </>
                      ),
                    },
                  ]}
                />
              </Tabs.TabPane>
            </Tabs>
          </Card>
          <DrawerWrapper
            title="멘토링 요청 수락"
            placement="right"
            width={"100%"}
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            headerStyle={{ padding: "12px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9" }}
          >
            {_(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
              .filter(({ reqStatus }) => reqStatus === "waiting")
              .map(
                ({ comment, menteeName, menteeOrganization, menteeUser_id, menteeUsername, mentorName, mentorOrganization, mentorUser_id, mentorUsername, mybookTitle, mybook_id, processedDate, reqDate, reqStatus }) => (
                  <Card
                    size="small"
                    key={`${menteeUser_id}${mybook_id}`}
                    actions={[
                      menteeGroupSelector,
                      <div
                        key="accept"
                        onClick={() => {
                          acceptMentroingRequest({
                            variables: {
                              forAcceptMentoringReq: {
                                menteeGroup_id: selectorRef.current,
                                menteeUser_id,
                                mentorUser_id,
                                mybook_id,
                              },
                            },
                          });
                        }}
                      >
                        수락
                      </div>,
                      <div key="decline">거절</div>,
                    ]}
                    style={{ margin: "10px", borderRadius: "10px" }}
                    bordered={false}
                    hoverable
                  >
                    <Card.Meta
                      avatar={
                        <div style={{ width: "70px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <Avatar src="/image/bookcover/bookcover2.png" />
                          <div>책: {mybookTitle}</div>
                          <div>아이디: {menteeName}</div>
                        </div>
                      }
                      title={<div style={{ fontSize: "1rem" }}>요청받은 날짜: {moment(new Date(Number(reqDate))).format("YY-MM-DD")}</div>}
                      description={comment}
                    />
                  </Card>

                  // <Row key={`${menteeUser_id}${mybook_id}`} wrap={false}>
                  //   <Col span={4}>{mybookTitle}</Col>
                  //   <Col span={4}>{menteeUsername}</Col>
                  //   <Col span={3}>{reqDate}</Col>
                  //   <Col span={6}>{comment}</Col>
                  //   <Col span={5}>
                  //     <Space>
                  //       <Button size="small">수락</Button>
                  //       <Button size="small">거절</Button>
                  //     </Space>
                  //   </Col>
                  // </Row>
                )
              )
              .value()}
          </DrawerWrapper>
        </MentoringWrapper>
      )}
    </div>
  );
};

export default MentoringHome;

const MentoringWrapper = styled.div`
  & div,
  & button,
  & span,
  & object,
  & iframe,
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6,
  & p,
  & blockquote,
  & pre,
  & abbr,
  & address,
  & cite,
  & code,
  & del,
  & dfn,
  & em,
  & img,
  & ins,
  & kbd,
  & q,
  & samp,
  & small,
  & strong,
  & sub,
  & sup,
  & var,
  & b,
  & i,
  & dl,
  & dt,
  & dd,
  & ol,
  & ul,
  & li,
  & fieldset,
  & form,
  & label,
  & legend,
  & table,
  & caption,
  & tbody,
  & tfoot,
  & thead,
  & tr,
  & th,
  & td,
  & article,
  & aside,
  & canvas,
  & details,
  & figcaption,
  & figure,
  & footer,
  & header,
  & hgroup,
  & menu,
  & nav,
  & section,
  & summary,
  & time,
  & mark,
  & audio,
  & video {
    font-size: 0.8rem;
  }
  & button {
    line-height: 1rem;
  }
`;

const DrawerWrapper = styled(Drawer)`
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 4px 0;
    }
  }
  & .ant-card-actions > li > span {
    font-size: 0.8rem;
    line-height: 1.5715;
  }

  & div,
  & button,
  & span,
  & object,
  & iframe,
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6,
  & p,
  & blockquote,
  & pre,
  & abbr,
  & address,
  & cite,
  & code,
  & del,
  & dfn,
  & em,
  & img,
  & ins,
  & kbd,
  & q,
  & samp,
  & small,
  & strong,
  & sub,
  & sup,
  & var,
  & b,
  & i,
  & dl,
  & dt,
  & dd,
  & ol,
  & ul,
  & li,
  & fieldset,
  & form,
  & label,
  & legend,
  & table,
  & caption,
  & tbody,
  & tfoot,
  & thead,
  & tr,
  & th,
  & td,
  & article,
  & aside,
  & canvas,
  & details,
  & figcaption,
  & figure,
  & footer,
  & header,
  & hgroup,
  & menu,
  & nav,
  & section,
  & summary,
  & time,
  & mark,
  & audio,
  & video {
    font-size: 0.8rem;
  }
  & button {
    line-height: 1rem;
  }
`;

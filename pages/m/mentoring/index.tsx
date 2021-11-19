import { useEffect, useMemo, useRef, useState } from "react";
import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import _, { divide } from "lodash";
import produce from "immer";
import Image from "next/image";
import Layout from "../../../components/layout/M_Layout";

import { GET_MENTORING, REQUEST_MENTORING, SEARCH_USER_INFO, GET_BOOKS_INFO, ACCEPT_MENTORING_REQUEST } from "../../../graphql/query/mentoring";

import { Badge, Button, Card, Col, Drawer, Table, Tabs, Row, Avatar, Select, Space } from "antd";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from "moment";
import useGetMentoringAndMenteeBooks from "../../../components/mentoring/useHooks/useGetMentoringAndMenteeBooks";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";
import M_MentoringBooksTable from "../../../components/mentoring/M_MentoringBooksTable.js";
import { useRouter } from "next/router";

const MentoringHome = () => {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerRequestMentoringVisible, setDrawerRequestMentoringVisible] = useState(false);
  const selectorRef = useRef();

  const [acceptMentroingRequest] = useMutation(ACCEPT_MENTORING_REQUEST, {});

  const { newData, mentoringData } = useGetMentoringAndMenteeBooks();
  const [getAllBooksInfo, { data, error, loading }] = useLazyQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (data) => {
      if (data.mybookcateset_getMybookcatesetByUserID.status === "200") {
        console.log({ receivedBookDataMentoring: data });
      } else if (data.mybookcateset_getMybookcatesetByUserID.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const getAllBooks = async () => {
    try {
      await getAllBooksInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const client = useApolloClient();

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
          </Select>
        </>
      )
    );
  }, [mentoringData]);

  return (
    <Layout>
      {newData && (
        <MentoringWrapper>
          <button onClick={() => console.log(client)}>아폴로</button>
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
                  <Button
                    size="small"
                    onClick={() => {
                      setDrawerRequestMentoringVisible((prev) => !prev);
                    }}
                  >
                    보낸 요청
                  </Button>
                  <button
                    className="customButtonForMainPage"
                    type="button"
                    style={{
                      width: "34px",
                      height: "16px",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onClick={() => {
                      setDrawerRequestMentoringVisible((prev) => !prev);
                      if (!data) {
                        getAllBooks();
                      }
                    }}
                  >
                    <PlusOutlined className="writeUnliked" style={{ color: "#DEE2E6" }} />
                  </button>
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

          <DrawerWrapper
            title="멘토링 요청하기"
            placement="right"
            width={"100%"}
            visible={drawerRequestMentoringVisible}
            onClose={() => setDrawerRequestMentoringVisible(false)}
            headerStyle={{ padding: "12px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9" }}
          >
            {drawerRequestMentoringVisible && <M_MentoringBooksTable bookData={data} loading={loading} error={error} />}
          </DrawerWrapper>
        </MentoringWrapper>
      )}
    </Layout>
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
  & video,
  & input {
    font-size: 0.8rem;
  }
`;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
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
`;

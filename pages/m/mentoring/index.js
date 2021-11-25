import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import _, { divide } from "lodash";

import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";
import { MUTATION_CANCEL_MENTORING_REQUEST } from "../../../graphql/mutation/mentoring";
import useGetMentoringAndMenteeBooks from "../../../components/mentoring/useHooks/useGetMentoringAndMenteeBooks";

import styled from "styled-components";
import { Badge, Button, Card, Drawer, Table, Tabs, Space, Tag } from "antd";
import { GroupOutlined, PlusOutlined } from "@ant-design/icons";

import Layout from "../../../components/layout/M_Layout";
import M_MentoringBooksTable from "../../../components/mentoring/M_MentoringBooksTable.js";
import M_MentosTable from "../../../components/mentoring/M_MentorsTable";
import M_SentMentoringRequestCard from "../../../components/mentoring/M_SentMentoringRequestCard";
import M_ReceivedMentoringRequestCard from "../../../components/mentoring/M_ReceivedMentoringRequestCard";
import M_MenteeGroupTable from "../../../components/mentoring/M_MenteeGroupTable";
import M_MentorGroupTable from "../../../components/mentoring/M_MentorGroupTable";

const MentoringHome = () => {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerRequestMentoringVisible, setDrawerRequestMentoringVisible] = useState(false);
  const [drawerSentMentoringRequestVisible, setDrawerSentMentoringRequestVisible] = useState(false);
  const [drawerMenteeGroupVisible, setDrawerMenteeGroupVisible] = useState(false);
  const [drawerMentorGroupVisible, setDrawerMentorGroupVisible] = useState(false);

  const [declineMentorRequest] = useMutation(MUTATION_CANCEL_MENTORING_REQUEST, { onCompleted: (data) => console.log("멘토요청 취소 후 받은 데이터", data) });
  const declineMentoring = useCallback(async ({ menteeUser_id, mentorUser_id, mybook_id, response }) => {
    try {
      await declineMentorRequest({
        variables: {
          forCancelMentoringReq: {
            response,
            menteeUser_id,
            mentorUser_id,
            mybook_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Layout>
      {newData && (
        <MentoringWrapper>
          <Card size="small" bordered={false}>
            <Tabs size="small">
              <Tabs.TabPane tab="멘티" key="멘티">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Badge
                    size="small"
                    count={
                      _(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
                        .filter(({ reqStatus }) => reqStatus === "waiting")
                        .value().length
                    }
                  >
                    <Button
                      size="small"
                      onClick={() => setDrawerVisible((prev) => !prev)}
                      disabled={
                        _(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
                          .filter(({ reqStatus }) => reqStatus === "waiting")
                          .value().length === 0
                      }
                    >
                      받은 요청
                    </Button>
                  </Badge>
                  <Button
                    icon={<GroupOutlined />}
                    size="small"
                    onClick={() => {
                      setDrawerMenteeGroupVisible(true);
                    }}
                  >
                    멘티그룹관리
                  </Button>
                </div>
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
                      ellipsis: true,
                      dataIndex: "menteeNameAndId",
                      width: "15%",
                    },
                    {
                      title: "최근 학습시간",
                      dataIndex: "studyHistory",
                      width: "35%",
                      // eslint-disable-next-line react/display-name
                      render: (v) => (
                        <>
                          {v.map((item, index) => (
                            <span key={index}>{`${index === 2 ? item : `${item}, `}`} </span>
                          ))}
                          <Tag style={{ marginLeft: "5px" }}>상세보기</Tag>
                        </>
                      ),
                    },
                  ]}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="멘토" key="멘토">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {" "}
                  <Space>
                    <Badge
                      size="small"
                      count={
                        _(mentoringData.mentoring_getMentoring.mentorings[0].sentReqs)
                          .filter(({ reqStatus }) => reqStatus === "waiting")
                          .value().length
                      }
                    >
                      <Button
                        size="small"
                        disabled={
                          _(mentoringData.mentoring_getMentoring.mentorings[0].sentReqs)
                            .filter(({ reqStatus }) => reqStatus === "waiting")
                            .value().length === 0
                        }
                        onClick={() => {
                          setDrawerSentMentoringRequestVisible((prev) => !prev);
                        }}
                      >
                        보낸 요청
                      </Button>
                    </Badge>
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
                  <Button
                    icon={<GroupOutlined />}
                    size="small"
                    onClick={() => {
                      setDrawerMentorGroupVisible(true);
                    }}
                  >
                    멘토그룹관리
                  </Button>
                </div>
                {mentoringData && <M_MentosTable mentoringData={mentoringData} />}
              </Tabs.TabPane>
            </Tabs>
          </Card>
          <DrawerWrapper
            title="멘토링 요청 수락"
            placement="right"
            width={"100%"}
            visible={
              drawerVisible &&
              _(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
                .filter(({ reqStatus }) => reqStatus === "waiting")
                .value().length > 0
            }
            onClose={() => setDrawerVisible(false)}
            headerStyle={{ padding: "12px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9" }}
          >
            {_(mentoringData.mentoring_getMentoring.mentorings[0].receivedReqs)
              .filter(({ reqStatus }) => reqStatus === "waiting")
              .map((mentee) => (
                <M_ReceivedMentoringRequestCard
                  key={`${mentee.menteeUser_id}${mentee.mybook_id}`}
                  mentee={mentee}
                  declineMentoring={declineMentoring}
                  menteeGroup={mentoringData && mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup}
                />
              ))
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
          <DrawerWrapper
            title="보낸 요청"
            placement="right"
            width={"100%"}
            visible={
              drawerSentMentoringRequestVisible &&
              _(mentoringData.mentoring_getMentoring.mentorings[0].sentReqs)
                .filter(({ reqStatus }) => reqStatus === "waiting")
                .value().length > 0
            }
            onClose={() => setDrawerSentMentoringRequestVisible(false)}
            headerStyle={{ padding: "12px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9" }}
          >
            {_(mentoringData.mentoring_getMentoring.mentorings[0].sentReqs)
              .filter(({ reqStatus }) => reqStatus === "waiting")
              .map((mentor) => <M_SentMentoringRequestCard mentor={mentor} key={`${mentor.mentorUser_id}${mentor.mybook_id}`} declineMentoring={declineMentoring} />)
              .value()}
          </DrawerWrapper>

          <M_MenteeGroupTable
            menteeGroup={mentoringData && mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup}
            drawerMenteeGroupVisible={drawerMenteeGroupVisible}
            changevisible={(_boolean) => {
              setDrawerMenteeGroupVisible(_boolean);
            }}
          />
          <M_MentorGroupTable
            mentorGroup={mentoringData && mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup}
            drawerMentorGroupVisible={drawerMentorGroupVisible}
            changevisible={(_boolean) => {
              setDrawerMentorGroupVisible(_boolean);
            }}
          />
        </MentoringWrapper>
      )}
    </Layout>
  );
};

export default MentoringHome;

const MentoringWrapper = styled.div`
  position: absolute;
  top: 40px;

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
      margin: 0;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
  & video,
  & input {
    font-size: 0.8rem;
  }
`;

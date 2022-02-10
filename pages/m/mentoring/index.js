import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import _, { divide } from "lodash";

import { QUERY_USER_CATEGORIES_AND_USER_BOOKS } from "../../../graphql/query/allQuery";
import { MUTATION_CANCEL_MENTORING_REQUEST } from "../../../graphql/mutation/mentoring";

import useWindowDimensions from "../../../hooks/useWindowDimensions";
import useGetMentoringAndMenteeBooks from "../../../components/mentoring/useHooks/useGetMentoringAndMenteeBooks";

import styled from "styled-components";
import { Badge, Button, Card, Drawer, Table, Tabs, Space, Tag } from "antd";
import { GroupOutlined, PlusOutlined } from "@ant-design/icons";

import Layout from "../../../components/layout/M_Layout";
import M_MentoringBooksTable from "../../../components/mentoring/M_MentoringBooksTable.js";
import M_MentosTable from "../../../components/mentoring/M_MentorsTable";
import M_MenteesTable from "../../../components/mentoring/M_MenteesTable";
import M_SentMentoringRequestCard from "../../../components/mentoring/M_SentMentoringRequestCard";
import M_ReceivedMentoringRequestCard from "../../../components/mentoring/M_ReceivedMentoringRequestCard";
import M_MenteeGroupTable from "../../../components/mentoring/M_MenteeGroupTable";
import M_MentorGroupTable from "../../../components/mentoring/M_MentorGroupTable";
import { StyledFlexSpaceBetween } from "../../../components/common/styledComponent/page";
import { StyledButtonForMainPage } from "../../../components/common/styledComponent/buttons";

const MentoringHome = () => {
  const router = useRouter();

  const deviceDimensions = useWindowDimensions();

  const [isMenteeEditMode, setIsMenteeEditMode] = useState(false);
  const [isMentorEditMode, setIsMentorEditMode] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerRequestMentoringVisible, setDrawerRequestMentoringVisible] =
    useState(false);
  const [
    drawerSentMentoringRequestVisible,
    setDrawerSentMentoringRequestVisible,
  ] = useState(false);
  const [drawerMenteeGroupVisible, setDrawerMenteeGroupVisible] =
    useState(false);
  const [drawerMentorGroupVisible, setDrawerMentorGroupVisible] =
    useState(false);

  const [declineMentorRequest] = useMutation(
    MUTATION_CANCEL_MENTORING_REQUEST,
    { onCompleted: (data) => console.log("멘토요청 취소 후 받은 데이터", data) }
  );
  const declineMentoring = useCallback(
    async ({ menteeUser_id, mentorUser_id, mybook_id, response }) => {
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
    },
    [declineMentorRequest]
  );

  const { newData, mentoringData, previousMentoringData } =
    useGetMentoringAndMenteeBooks();
  const [getAllBooksInfo, { data, error, loading }] = useLazyQuery(
    QUERY_USER_CATEGORIES_AND_USER_BOOKS,
    {
      onCompleted: (data) => {
        if (data.mybookcateset_getMybookcatesetByUserID.status === "200") {
          console.log({ receivedBookDataMentoring: data });
        } else if (
          data.mybookcateset_getMybookcatesetByUserID.status === "401"
        ) {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
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
            <Tabs
              size="small"
              onChange={() => {
                setIsMenteeEditMode(false);
                setIsMentorEditMode(false);
              }}
            >
              <Tabs.TabPane
                tab={<div className="ForMobilePageMainTitle">멘티</div>}
                key="멘티"
              >
                <StyledFlexSpaceBetween>
                  <Badge
                    size="small"
                    count={
                      _(
                        mentoringData.mentoring_getMentoring.mentorings[0]
                          .receivedReqs
                      )
                        .filter(({ reqStatus }) => reqStatus === "waiting")
                        .value().length
                    }
                  >
                    <Button
                      size="small"
                      onClick={() => setDrawerVisible((prev) => !prev)}
                      disabled={
                        _(
                          mentoringData.mentoring_getMentoring.mentorings[0]
                            .receivedReqs
                        )
                          .filter(({ reqStatus }) => reqStatus === "waiting")
                          .value().length === 0
                      }
                    >
                      받은 요청
                    </Button>
                  </Badge>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => setIsMenteeEditMode((prev) => !prev)}
                    >
                      {isMenteeEditMode ? "멘티 관리 중" : "멘티 관리"}
                    </Button>
                    <Button
                      icon={<GroupOutlined />}
                      size="small"
                      onClick={() => {
                        setDrawerMenteeGroupVisible(true);
                      }}
                    >
                      멘티그룹관리
                    </Button>
                  </Space>
                </StyledFlexSpaceBetween>
                <M_MenteesTable
                  newData={newData}
                  isMenteeEditMode={isMenteeEditMode}
                  menteeGroup={
                    mentoringData.mentoring_getMentoring.mentorings[0]
                      .mentoring_info.menteeGroup
                  }
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<div className="ForMobilePageMainTitle">멘토</div>}
                key="멘토"
              >
                <StyledFlexSpaceBetween>
                  {" "}
                  <Space>
                    <Badge
                      size="small"
                      count={
                        _(
                          mentoringData.mentoring_getMentoring.mentorings[0]
                            .sentReqs
                        )
                          .filter(({ reqStatus }) => reqStatus === "waiting")
                          .value().length
                      }
                    >
                      <Button
                        size="small"
                        disabled={
                          _(
                            mentoringData.mentoring_getMentoring.mentorings[0]
                              .sentReqs
                          )
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
                    <StyledButtonForMainPage
                      onClick={() => {
                        setDrawerRequestMentoringVisible((prev) => !prev);
                        if (!data) {
                          getAllBooks();
                        }
                      }}
                    >
                      <PlusOutlined className="IconForButton" />
                    </StyledButtonForMainPage>
                  </Space>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => setIsMentorEditMode((prev) => !prev)}
                    >
                      {isMentorEditMode ? "멘토 관리 중" : "멘토 관리"}
                    </Button>
                    <Button
                      icon={<GroupOutlined />}
                      size="small"
                      onClick={() => {
                        setDrawerMentorGroupVisible(true);
                      }}
                    >
                      멘토그룹관리
                    </Button>
                  </Space>
                </StyledFlexSpaceBetween>
                {mentoringData && (
                  <M_MentosTable
                    mentoringData={mentoringData}
                    isMentorEditMode={isMentorEditMode}
                    previousMentoringData={previousMentoringData}
                    mentorGroup={
                      mentoringData.mentoring_getMentoring.mentorings[0]
                        .mentoring_info.mentorGroup
                    }
                  />
                )}
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
                  menteeGroup={
                    mentoringData &&
                    mentoringData.mentoring_getMentoring.mentorings[0]
                      .mentoring_info.menteeGroup
                  }
                />
              ))
              .value()}
          </DrawerWrapper>

          <DrawerWrapper
            title={
              <div className="ForMobilePageMainTitle">멘토링 요청하기</div>
            }
            placement="right"
            width={"100%"}
            visible={drawerRequestMentoringVisible}
            onClose={() => setDrawerRequestMentoringVisible(false)}
            headerStyle={{ padding: "12px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9", padding: "0" }}
            setheight={deviceDimensions.height - 40}
          >
            {drawerRequestMentoringVisible && (
              <M_MentoringBooksTable
                bookData={data}
                loading={loading}
                error={error}
                deviceDimensions={deviceDimensions}
              />
            )}
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
              .map((mentor, i) => (
                <M_SentMentoringRequestCard
                  mentor={mentor}
                  key={`${mentor.mentorUser_id}${mentor.mybook_id}`}
                  forId={`sentReq:${i}`}
                  declineMentoring={declineMentoring}
                />
              ))
              .value()}
          </DrawerWrapper>

          <M_MenteeGroupTable
            menteeGroup={
              mentoringData &&
              mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info
                .menteeGroup
            }
            drawerMenteeGroupVisible={drawerMenteeGroupVisible}
            changevisible={(_boolean) => {
              setDrawerMenteeGroupVisible(_boolean);
            }}
          />
          <M_MentorGroupTable
            mentorGroup={
              mentoringData &&
              mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info
                .mentorGroup
            }
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
  position: relative;
  top: 40px;
  & .ant-tabs-content-holder * {
    font-size: 1rem;
  }
`;

const DrawerWrapper = styled(Drawer)`
  top: 40px;

  & .ant-drawer-body * {
    font-size: 1rem;
  }
  & .ant-drawer-wrapper-body {
    height: ${({ setheight }) => setheight || "auto"}px;
  }
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 0;
      height: 3.5rem;
      & > span {
        width: 100%;
        height: 100%;
        & > div {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
`;

/* eslint-disable react/no-unescaped-entities */
import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import M_Layout from "../../../components/layout/M_Layout";
import M_Footer from "../../../components/index/M_Footer";
import { Comment, Tooltip, Space, Input, Button, Popover } from "antd";
import moment from "moment";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from "@ant-design/icons";
import { GET_Feedback, CreateFeedBack, UpdateFeedBack, DeleteFeedBack } from "../../../graphql/query/feedback";
import { bool } from "prop-types";
const { TextArea } = Input;

const FeedBack = () => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var username = localStorage.getItem("username");
  }
  const [feedBacks, setFeedBacks] = useState([]);
  const [feedBackInput, setFeedBackInput] = useState();
  const [updateInput, setUpdateInput] = useState();
  const [updateInputShow, setUpdateInputShow] = useState();

  const hide = () => {
    setVisible(false);
  };

  const handleUpdateChange = (content, id) => {
    setUpdateInputShow(id);
    setUpdateInput(content);
  };
  const { loading, error, data } = useQuery(GET_Feedback);

  useEffect(() => {
    if (data) {
      console.log(data);
      setFeedBacks(data.revisePost_getAllPost.simplePosts);
    } else {
      console.log("no data?");
    }
  }, [data]);

  function handleFeedBackInput(e) {
    setFeedBackInput(e.target.value);
  }
  function handleFeedBackUpdateInput(e) {
    setUpdateInput(e.target.value);
  }
  function resetUpdateInput() {
    setUpdateInput("");
    setUpdateInputShow()
  }

  const [revisePost_createPost] = useMutation(CreateFeedBack, { onCompleted: aftercreatefeedback });
  function aftercreatefeedback(data) {
    console.log("data", data);
    setFeedBacks(data.revisePost_createPost.simplePosts);
    setFeedBackInput("");
  }

  const feedbackcreate = useCallback(async () => {
    try {
      await revisePost_createPost({
        variables: {
          content: feedBackInput,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [revisePost_createPost, feedBackInput]);

  const [revisePost_updatePost] = useMutation(UpdateFeedBack, { onCompleted: afterupdatefeedback });
  function afterupdatefeedback(data) {
    console.log("data", data);
    setFeedBacks(data.revisePost_updatePost.simplePosts);
    setFeedBackInput("");
    setUpdateInputShow()
  }

  const feedbackupdate = useCallback(
    async (revisePost_id) => {
      try {
        await revisePost_updatePost({
          variables: {
            revisePost_id: revisePost_id,
            content: updateInput,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [revisePost_updatePost, updateInput]
  );

  const [revisePost_deletePost] = useMutation(DeleteFeedBack, { onCompleted: afterdeletefeedback });
  function afterdeletefeedback(data) {
    console.log("data", data);
    setFeedBacks(data.revisePost_deletePost.simplePosts);
    setFeedBackInput("");
  }

  const feedbackdelete = useCallback(
    async (revisePost_id) => {
      try {
        await revisePost_deletePost({
          variables: {
            revisePost_id: revisePost_id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [revisePost_deletePost]
  );

  const feedBackData = [{ name: "tester1", data: "이거 정말 짱좋은듯?" }];
  const feeds = feedBacks.map((item) => (
    <>
      <Comment
        author={<a>{item.username}</a>}
        avatar={<UserOutlined />}
        content={
          <>
            <p>{item.content}</p>
            {item.username === username && (
              <>
                <Space>
                  <Button onClick={() => handleUpdateChange(item.content, item._id)} size="small" type="primary">
                    수정
                  </Button>

                  <Button onClick={() => feedbackdelete(item._id)} size="small" type="primary">
                    삭제
                  </Button>
                </Space>
                {updateInputShow === item._id && (
                  <>
                    <TextArea rows={4} onChange={handleFeedBackUpdateInput} value={updateInput} />
                    <Space>
                      <Button onClick={() => feedbackupdate(item._id)} size="small" type="primary">
                        저장
                      </Button>
                      <Button onClick={resetUpdateInput} size="small" type="primary">
                        취소
                      </Button>
                    </Space>
                  </>
                )}
              </>
            )}
          </>
        }
        datetime={
          <Tooltip title={moment(item.timeCreated).format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment(item.timeCreated).fromNow()}</span>
          </Tooltip>
        }
      />
    </>
  ));

  return (
    <>
      <Head>
        <title>Comment - Cogbook</title>
      </Head>
      <M_Layout>

        <div style={{ marginTop: "50px", textAlign:"center", marginBottom:"10px" }}>불편사항이나 운영자에게 전하고 싶은 말씀을 입력해 주세요^^</div>
        
        <div style={{ display: "flex", flexDirection: "column", marginTop: "5px",  width:"95%" , margin:"auto",marginBottom: "20px"}}>
        {feeds}
          <TextArea rows={4} placeholder="의견을 작성해 주세요" onChange={handleFeedBackInput} value={feedBackInput} />
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Space>
              <Button onClick={feedbackcreate} size="medium" type="primary">
                저장
              </Button>
              <Button onClick={hide} size="medium" type="primary">
                취소
              </Button>
            </Space>
          </div>
        </div>
        <div style={{height:"20px", marginBottom:"20px"}}></div>
      </M_Layout>
      <M_Footer />
    </>
  );
};

export default FeedBack;

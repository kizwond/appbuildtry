/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { Card, Popover, Button, Avatar, List, Comment, Rate } from "antd";
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import styled from "styled-components";

const PostCard = () => {
  const [liked, setLiked] = useState(false);
  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  // const { me } = useSelector((state) => state.user);
  // const id = me && me.id
  // 를 아래와 같이 옵셔널 체이닝 연산자(optional chaining) 변경 가능하다
  // const id = me?.id;
  // const id = useSelector((state) => state.user.me && state.user.me.id);
  // const id = useSelector((state) => state.user.me?.id);
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        actions={[
          liked ? (
            <Button size="small" icon={<HeartOutlined />} style={{ border: "none", color: "red" }} key="heart" onClick={onToggleLike}>
              Useful +2
            </Button>
          ) : (
            <Button size="small" icon={<HeartOutlined />} style={{ border: "none" }} key="heart" onClick={onToggleLike}>
              Useful +2
            </Button>
          ),
          <Button key="comment" onClick={onToggleComment} style={{ border: "none" }} icon={<MessageOutlined />} size="small">
            댓글 +2
          </Button>,
          <Popover
            key="more"
            trigger="click"
            // onVisibleChange={handleVisibleChange}
            // visible={popoverOpened}
            content={
              <Button.Group>
                {/* {id && post.User.id === id ? ( */}
                <>
                  <Button>수정</Button>
                  <Button danger>삭제</Button>
                  <Button>신고</Button>
                </>
                {/* ) : ( */}
                {/* )} */}
              </Button.Group>
            }
          >
            <Button size="small" style={{ border: "none" }} icon={<EllipsisOutlined />}>
              더보기
            </Button>
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={
            <ReviewHead>
              <ReviewerID>jooka</ReviewerID>
              <StarScoreWrapper>
                <StarScore>
                  <Rate disabled allowHalf defaultValue={2.5} />
                </StarScore>
              </StarScoreWrapper>
            </ReviewHead>
          }
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <div style={{ margin: "5px 10px 0 10px" }}>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment author={item.User.nickname} avatar={<Avatar>{item.User.nickname[0]}</Avatar>} content={item.content} />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    UserId: PropTypes.number,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.any),
    Images: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;

const post = {
  id: 1,
  User: {
    id: "jooka",
    nickname: "주까",
  },
  content: "첫 번째 게시글 #해쉬태그 #익스프레스",
  Images: [
    {
      src: "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
    },
    {
      src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
    },
    {
      src: "https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg",
    },
  ],
  Comments: [
    {
      User: {
        nickname: "nero",
      },
      content: "우와 개정판이 나왔군요~",
    },
    {
      User: {
        nickname: "hero",
      },
      content: "얼른 사고싶어요~",
    },
  ],
};

const ReviewHead = styled.div`
  display: flex;
`;

const ReviewerID = styled.h4`
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
`;
const StarScoreWrapper = styled.div`
  margin-left: 10px;
  display: inline-block;
  width: 70px;
`;
const StarScore = styled.div`
  & .ant-rate {
    font-size: 14px;
  }

  & .ant-rate-star {
    margin-right: 0;
  }
`;

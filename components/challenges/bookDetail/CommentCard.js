/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import { Card, Popover, Button, Avatar, List, Comment, Rate } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  MessageOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import styled from "styled-components";

const CommentCard = () => {
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
      {/* <Card
        size="small"
        actions={[
          <Button
            key="comment"
            onClick={onToggleComment}
            style={{ border: "none" }}
            icon={<MessageOutlined />}
            size="small"
          >
            댓글 +2
          </Button>,
          <Popover
            key="more"
            trigger="click"
            content={
              <Button.Group>
                <Button>수정</Button>
                <Button danger>삭제</Button>
                <Button>신고</Button>
              </Button.Group>
            }
          >
            <Button
              size="small"
              style={{ border: "none" }}
              icon={<EllipsisOutlined />}
            >
              더보기
            </Button>
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={
            <div className="flex items-center">
              <div className="text-[13px] font-semibold">jooka</div>
              <StarScoreWrapper>
                <StarScore>
                  <Rate disabled allowHalf defaultValue={2.5} />
                </StarScore>
              </StarScoreWrapper>
            </div>
          }
          description={<PostCardContent postData={"가나다라나마 안녕하세요"} />}
        />
      </Card> */}
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center gap-2">
          <div className="w-[20px]">
            <Avatar className="!w-[16px] !h-[16px] !leading-[16px] !text-[10px]">
              J
            </Avatar>
          </div>
          <div className="flex items-center gap2">
            <div className="w-[60px] truncate">jooka</div>
            <div className="w-[100px]">
              <StarScoreWrapper>
                <StarScore>
                  <Rate disabled allowHalf defaultValue={2.5} />
                </StarScore>
              </StarScoreWrapper>
            </div>
          </div>
        </div>
        <div className="px-2 text-base text-gray-800">
          가나다라 마바사 아자차타 카파파
          <br />
          가나다라 마바사 아자차타 카파파
          <br />
          가나다라 마바사 아자차타 카파파
          <br />
          가나다라 마바사 아자차타 카파파
          <br />
        </div>
        <div>
          <div
            className="flex items-center justify-end gap-3 pl-2 text-base font-semibold"
            onClick={onToggleComment}
          >
            <div>댓글달기</div>
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center text-lg">
                <MessageOutlined />
              </div>
              댓글 +2
            </div>
          </div>

          {commentFormOpened && (
            <div className="pl-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-[20px]">
                    <Avatar className="!w-[16px] !h-[16px] !leading-[16px] !text-[10px]">
                      J
                    </Avatar>
                  </div>
                  <div>jooka</div>
                </div>
                <div className="px-2 text-base text-gray-800">
                  가나다라 마바사 아자차타 카파파dddsssssa
                  <br />
                  가나다라 마바사 아자차타 카파파afffffffff ssaaa
                  <br />
                  가나다라 마바사 아자차타 카파파
                  <br />
                  가나다라 마바사 아자차타 카파파
                  <br />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;

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

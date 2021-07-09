import styled from "styled-components";
import { useState } from "react";
import DetailIntroContentBookIntro from "./DetailIntroContentBookIntro";
import DetailIntroContentIndex from "./DetailIntroContentIndex";
import DetailIntroContentAuthorIntro from "./DetailIntroContentAuthorIntro";
import details from "./dataDetail";

const DetailIntro = () => {
  const [active, setActive] = useState(1);

  const NodeFromIntroBook = details.book_info.intro_book.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });
  const NodeFromIndex = details.book_info.indexes.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });
  const NodeFromIntroAuthor = details.book_info.intro_author.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });

  let visible_content = null;
  if (active == 1) {
    visible_content = <DetailIntroContentBookIntro active={active} content_item={NodeFromIntroBook} />;
  }
  if (active == 2) {
    visible_content = <DetailIntroContentIndex active={active} content_item={NodeFromIndex} />;
  }
  if (active == 3) {
    visible_content = <DetailIntroContentAuthorIntro active={active} content_item={NodeFromIntroAuthor} />;
  }

  return (
    <DetailIntroWrap>
      <TabBar>
        <ul>
          <li>
            <a
              className={active == 1 ? "active" : "inactive"}
              onClick={() => {
                setActive(1);
              }}
            >
              책 소개
            </a>
          </li>
          <li>
            <a
              className={active == 2 ? "active" : "inactive"}
              onClick={() => {
                setActive(2);
              }}
            >
              목차
            </a>
          </li>
          <li>
            <a
              className={active == 3 ? "active" : "inactive"}
              onClick={() => {
                setActive(3);
              }}
            >
              출판사 서평
            </a>
          </li>
        </ul>
      </TabBar>
      {visible_content}
    </DetailIntroWrap>
  );
};

export default DetailIntro;

const DetailIntroWrap = styled.div`
  border-top: 1px solid #e6e8eb;
`;

const TabBar = styled.div`
  font-size: 14px;

  & ul {
    padding: 0;
    margin: 0;
    display: table;
    width: 100%;
  }
  & ul li {
    display: table-cell;
    width: 25%;
    vertical-align: top;
  }
  & ul li a {
    display: block;
    height: 40px;
    line-height: 40px;
    background: #f7fafc;
    border-left: 1px solid #e6e8eb;
    border-bottom: 1px solid #e6e8eb;
    text-align: center;
    color: #303538;
    font-size: 15px;
  }
  & ul li:first-child a {
    border-left: none;
  }

  & ul li .active {
    border-bottom: none;
    background: white;
    font-weight: 700;
  }
`;

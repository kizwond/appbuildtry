import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Col, Button } from "antd";
import M_Layout from "../../../components/layout/M_Layout";
import M_StudyFavoriteBooksTable from "../../../components/books/studypage/booksTable/M_StudyFavoriteBooksTable";
import M_StudyBooksTable from "../../../components/books/studypage/booksTable/M_StudyBooksTable";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

const Writeanother = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [activedTable, setActivedTable] = useState();

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const [selectedBooks, setSelectedBooks] = useState([]);

  const { loading, error, data } = useQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybookcateset_getMybookcatesetByUserID.status === "200") {
      } else if (received_data.mybookcateset_getMybookcatesetByUserID.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  useEffect(() => {
    sessionStorage.removeItem("books_selected");
  }, []);

  const sesstionStart = () => {
    router.push("/m/study/sessionSetting");
  };

  const chagePopup = useCallback((_boolean) => {
    setisPopupSomething(_boolean);
  }, []);
  const changeActivedTable = useCallback((_table) => {
    setActivedTable(_table);
  }, []);

  const changeSelectedBooks = useCallback((_booksArray) => {
    setSelectedBooks(_booksArray);
    sessionStorage.setItem("books_selected", JSON.stringify(_booksArray));
  }, []);

  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }

  const myBook2 = data && data.mybook_getMybookByUserID.mybooks;
  const category2 = myBook2 && data && data.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0];
  return (
    <>
      <Head>
        <title>Write - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {myBook2 && category2 && (
        <M_Layout>
          <StyledRowMaxWidth height={height}>
            <Col span={24}>
              <M_StudyFavoriteBooksTable
                ref={(ref) => (newCateRef.current = ref)}
                category={category2}
                myBook={myBook2}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                activedTable={activedTable}
                changeActivedTable={changeActivedTable}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
              />
            </Col>

            <Col span={24}>
              <M_StudyBooksTable
                category={category2}
                myBook={myBook2}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                activedTable={activedTable}
                changeActivedTable={changeActivedTable}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
              />
            </Col>
          </StyledRowMaxWidth>
          <StyledBottomBar>
            <div>바로 보기</div>
            <div onClick={sesstionStart}>세션 시작</div>
          </StyledBottomBar>
        </M_Layout>
      )}
    </>
  );
};

export default Writeanother;

const StyledRowMaxWidth = styled.div`
  margin: 0 auto;
  position: absolute;
  top: 40px;
  height: ${(props) => props.height - 76}px;
  overflow: scroll;

  & .ant-card-head {
    border-bottom: none;
    /* border-top: 1px solid #f0f0f0; */
  }

  & .ant-card-small > .ant-card-body {
    padding: 0px 12px 12px 12px;
  }

  & .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }
  & .ant-checkbox-inner::after {
    width: 4px;
    height: 7px;
  }

  /* 아이콘 크기 및 색상 - 부모 div Hover시 동작 포함 */

  & .PullCustomCircleButton > .anticon-double-left > svg {
    font-size: 14px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-double-left > svg {
    color: #fff;
  }
  & .PullCustomCircleButton > .anticon-setting > svg {
    font-size: 14px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-setting > svg {
    color: #fff;
  }
`;

const StyledBottomBar = styled.div`
  overflow: hidden;
  /* border: 1px solid #d1d1d1; */
  border-top: 1px solid #e1e1e1;
  background-color: #f5f5f5;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* padding: 8px 0; */
  z-index: 9999;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & > div:first-child {
    border-right: 1px solid #e1e1e1;
  }
`;

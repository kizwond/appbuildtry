import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Space, Col, Button } from "antd";
import M_Layout from "../../../components/layout/M_Layout";
import CategorySettingButton from "../../../components/books/writepage/categorySetting/CategorySettingButton";
import M_StudyFavoriteBooksTable from "../../../components/books/studypage/booksTable/M_StudyFavoriteBooksTable";
import M_StudyBooksTable from "../../../components/books/studypage/booksTable/M_StudyBooksTable";

const Writeanother = () => {
  const router = useRouter();

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

  const myBook2 = useMemo(() => data && data.mybook_getMybookByUserID.mybooks, [data]);
  const category2 = useMemo(() => data && data.mybookcateset_getMybookcatesetByUserID?.mybookcatesets[0], [data]);

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
  return (
    <>
      <Head>
        <title>Write - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <StyledRowMaxWidth topcompo="true">
          <StyledSpace>
            <CategorySettingButton category={category2} />
            <Button onClick={sesstionStart} size="small">
              세션 시작
            </Button>
          </StyledSpace>
        </StyledRowMaxWidth>

        <StyledRowMaxWidth>
          {myBook2.filter((_book) => _book.mybook_info.isStudyLike).length > 0 && (
            <Col span={24}>
              <M_StudyFavoriteBooksTable
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
          )}

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
      </M_Layout>
    </>
  );
};

export default Writeanother;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
  padding: 12px 12px 0 12px;
`;

const StyledRowMaxWidth = styled.div`
  margin: 0 auto;
  margin-top: 40px;

  & .ant-table.ant-table-small .ant-table-thead > tr > th {
    padding: 8px 0px;
  }

  & .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }

  & .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }
  & .ant-checkbox-inner::after {
    width: 4px;
    height: 7px;
  }
`;

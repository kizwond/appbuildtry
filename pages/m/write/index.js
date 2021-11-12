import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Space, Col } from "antd";
import M_Layout from "../../../components/layout/M_Layout";
import CreateBookButton from "../../../components/books/writepage/createBook/CreateBookButton";
import CategorySettingButton from "../../../components/books/writepage/categorySetting/CategorySettingButton";
import M_BooksTable from "../../../components/books/writepage/booksTable/M_BooksTable";
import M_FavoriteBooksTable from "../../../components/books/writepage/booksTable/M_FavoriteBooksTable";
import { StyledRowMaxWidth } from "../../../components/common/styledComponent/page";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";

const Writeanother = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);
  const newCateRef = useRef();

  const [activedTable, setActivedTable] = useState();

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const { loading, error, data } = useQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybookcateset_getMybookcatesetByUserID.status === "200") {
        setMyBook(received_data.mybook_getMybookByUserID.mybooks);
        setCategory(received_data.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0].mybookcates);
        setIsReceivedData(true);
      } else if (received_data.mybookcateset_getMybookcatesetByUserID.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const myBook2 = useMemo(() => data?.mybook_getMybookByUserID.mybooks, [data]);
  const category2 = useMemo(() => data?.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0], [data]);

  const handleToGetMyBook = useCallback((books) => {
    setMyBook(books);
  }, []);

  const chagePopup = useCallback((_boolean) => {
    setisPopupSomething(_boolean);
  }, []);
  const changeActivedTable = useCallback((_table) => {
    setActivedTable(_table);
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
      {data && (
        <M_Layout>
          {category2.mybookcates.length >= 1 && (
            <StyledRowMaxWidth topcompo="true">
              <StyledSpace>
                <CreateBookButton category={category2} />
                <CategorySettingButton ref={(ref) => (newCateRef.current = ref)} category={category2} />
              </StyledSpace>
            </StyledRowMaxWidth>
          )}

          <StyledRowMaxWidth>
            <Col span={24}>
              <M_FavoriteBooksTable
                category={category2}
                myBook={myBook2}
                handleToGetMyBook={handleToGetMyBook}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                activedTable={activedTable}
                changeActivedTable={changeActivedTable}
              />
            </Col>
            <Col span={24}>
              <M_BooksTable
                category={category2}
                myBook={myBook2}
                handleToGetMyBook={handleToGetMyBook}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                activedTable={activedTable}
                changeActivedTable={changeActivedTable}
                newCateId={newCateRef.current}
              />
            </Col>
          </StyledRowMaxWidth>
        </M_Layout>
      )}
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

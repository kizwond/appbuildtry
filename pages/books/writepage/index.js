import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_AND_BOOKS_INFO } from '../../../graphql/query/writePage';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { Row, Space, Col, Divider } from '../../../node_modules/antd/lib/index';
import Layout from '../../../components/layout/Layout';
import CreateBookButton from '../../../components/books/writepage/createBook/CreateBookButton';
import CategorySettingButton from '../../../components/books/writepage/categorySetting/CategorySettingButton';
import BooksTable from '../../../components/books/writepage/booksTable/BooksTable';
import BooksTablePagination from '../../../components/books/writepage/booksTable/BooksTablePagination';

const Writeanother = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const { loading, error, data } = useQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_get.status === '200') {
        setMyBook(received_data.mybook_getAllMybook.mybooks);
        setCategory(received_data.mybookcate_get.mybookcates);
        setIsReceivedData(true);
      } else if (received_data.mybookcate_get.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });

  const handleToGetMyBook = useCallback((books) => {
    setMyBook(books);
  }, []);

  const chagePopup = useCallback((_boolean) => {
    setisPopupSomething(_boolean);
  }, []);

  if (!isReceivedData) {
    return null;
  }
  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }
  return (
    <Layout>
      {category.length >= 1 && (
        <StyledSpace>
          <CreateBookButton category={category} handleToGetMyBook={handleToGetMyBook} />
          <CategorySettingButton category={category} />
        </StyledSpace>
      )}

      <Row>
        <StyledCol>
          <BooksTable category={category} myBook={myBook} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
        </StyledCol>
      </Row>
    </Layout>
  );
};

export default Writeanother;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
`;
const StyledCol = styled(Col)`
  & .categoryCol {
    /* border: none; */
    border-bottom: none;
    /* border-right: 1px solid #f0f0f0; */
  }

  & .foldedCategory > .categoryCol,
  & .NoBooksCategory > .categoryCol,
  & .LastHiddenBar > .categoryCol,
  & .lastBook {
    border-bottom: 2px solid #7609f1 !important;
  }

  & .NoBooksCategory > .categoryCol,
  & .NoBooksCategory > .categoryCol {
    /* border-bottom: 1px solid #f0f0f0; */
  }
  & .MiddleHiddenBar > .normal,
  & .LastHiddenBar > .normal,
  & .NoBooksCategory > .normal,
  & .foldedCategory > .normal {
    background-color: #bfbfbf;
    border: 2px solid white;
  }
  & .LastHiddenBar > .normal,
  & .NoBooksCategory > .normal,
  & .foldedCategory > .normal {
    background-color: #bfbfbf;
    border: 2px solid white;
    border-bottom: 2px solid #7609f1 !important;
  }
  & .EvenNumberRow > .normal {
    background-color: #f5f5f5;
  }

  & .LastHiddenBar > .categoryCol {
    /* border-bottom: 1px solid #f0f0f0; */
  }
  & .ant-table-thead .categoryCol::before {
    display: none;
  }
  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
  }
`;

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_AND_BOOKS_INFO } from '../../../graphql/query/writePage';
import styled from 'styled-components';

import { Row, Space, Col, Divider } from '../../../node_modules/antd/lib/index';
import Layout from '../../../components/layout/Layout';
import CreateBookButton from '../../../components/books/writepage/createBook/CreateBookButton';
import CategorySettingButton from '../../../components/books/writepage/categorySetting/CategorySettingButton';
import BooksTable from '../../../components/books/writepage/BooksTable';
import BooksTablePagination from '../../../components/books/writepage/BooksTablePagination';

const Writeanother = () => {
  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const { loading, error, data } = useQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      setCategory(received_data.mybookcate_get.mybookcates);
      setMyBook(received_data.mybook_getAllMybook.mybooks);
      setIsReceivedData(true);
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
          <BooksTablePagination
            category={category}
            myBook={myBook}
            handleToGetMyBook={handleToGetMyBook}
            isPopupSomething={isPopupSomething}
            chagePopup={chagePopup}
          />
        </StyledCol>
      </Row>
      <Divider />
      <Row>
        <Col>
          <BooksTable category={category} myBook={myBook} handleToGetMyBook={handleToGetMyBook} />
        </Col>
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
  & .ant-table.ant-table-small .ant-table-title,
  .ant-table.ant-table-small .ant-table-footer,
  .ant-table.ant-table-small .ant-table-thead > tr > th,
  .ant-table.ant-table-small .ant-table-tbody > tr > td,
  .ant-table.ant-table-small tfoot > tr > th,
  .ant-table.ant-table-small tfoot > tr > td {
    vertical-align: top;
  }
`;

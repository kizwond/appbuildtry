import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_AND_BOOKS_INFO } from '../../../graphql/query/writePage';
import styled from 'styled-components';

import { Row, Space, Col } from '../../../node_modules/antd/lib/index';
import Layout from '../../../components/layout/Layout';
import CreateBookButton from '../../../components/books/writepage/createBook/CreateBookButton';
import CategorySettingButton from '../../../components/books/writepage/categorySetting/CategorySettingButton';
import BooksTable from '../../../components/books/writepage/BooksTable';

const Writeanother = () => {
  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

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

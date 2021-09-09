// 할 수 있는 한 graphQL에서 받은 data로만 코드를 짜보자!!!!
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_AND_BOOKS_INFO } from '../../../graphql/query/writePage';
import styled from 'styled-components';

import { Space } from '../../../node_modules/antd/lib/index';
import Layout from '../../../components/layout/Layout';
import CreateBookButton from '../../../components/books/writepage/createBook/CreateBookButton';
import CategorySettingButton from '../../../components/books/writepage/categorySetting/CategorySettingButton';

const Writeanother = () => {
  const { loading, error, data } = useQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
    },
  });

  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }

  return (
    <Layout>
      {data && (
        <StyledSpace>
          <CreateBookButton category={data.mybookcate_get.mybookcates} />
          <CategorySettingButton category={data.mybookcate_get.mybookcates} />
        </StyledSpace>
      )}
    </Layout>
  );
};

export default Writeanother;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
`;

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GetCategory } from '../../../graphql/query/writemain';
import CreateBookComponent from '../../../components/books/writepage/CreateBookComponent';

const Writeanother = () => {
  const [category, setCategory] = useState();

  const { loading, error, data } = useQuery(GetCategory, {
    onCompleted: (received_data) => {
      console.log(received_data);
      setCategory(received_data.mybookcate_get.mybookcates);
    },
  });
  if (loading) <div>loading..</div>;
  if (error) <div>loading..</div>;
  return (
    <>
      {data && (
        <CreateBookComponent category={data?.mybookcate_get?.mybookcates} />
      )}
    </>
  );
};

export default Writeanother;

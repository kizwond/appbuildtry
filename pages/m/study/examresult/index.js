import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import { useState } from 'react';
import { useEffect } from 'react';
import M_Layout from '../../../../components/layout/M_Layout';

import { QUERY_MY_CARD_CONTENTS } from '../../../../graphql/query/allQuery';
const ExamResult = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <>로딩 중..</>;
  }
  const cards = typeof window === 'undefined' ? [] : JSON.parse(sessionStorage.getItem('examLog'));
  console.log({ cards });
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          {isMounted && <CardResultWrapper cards={cards} />}
        </div>
      </M_Layout>
    </>
  );
};

export default ExamResult;

const CardResult = ({ seq, face1, answer, face2, cardId }) => {
  const result = face2.indexOf(answer) > -1;
  return (
    <div
      className={`flex border border-gray-300 border-solid rounded  ${result && 'bg-gray-100 text-gray-700'}`}
      onClick={() => {
        console.log('카드 더보기 // 팝업으로 카드 시험 관련 내용 전달');
      }}
    >
      <div className="flex items-center justify-center border-r grow-0 shrink-0 basis-14 border-r-gray-300">{seq}</div>

      <div className="flex-auto min-w-0 p-2 border-r border-r-gray-300">
        <div className="flex text-base">
          <div className="flex-none w-12">앞면 :</div>
          <div className="truncate">{face1}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">입력 :</div>
          <div className="truncate">{answer}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">정답 :</div>
          <div className="truncate">{face2}</div>
        </div>
      </div>

      <div className="flex items-center justify-center grow-0 shrink-0 basis-16">
        {result ? <CheckOutlined className="text-[2.5rem]" /> : <CloseOutlined className="text-[2.5rem]" />}
      </div>
    </div>
  );
};

const CardResultWrapper = ({ cards }) => {
  const { data, loading, error } = useQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: {
      mycontent_ids: cards.filter((card) => card.card_info.content.location === 'my').map((card) => card.card_info.content.mycontent_id),
      buycontent_ids: cards.filter((card) => card.card_info.content.location === 'buy').map((card) => card.card_info.content.buycontent_id),
    },
  });

  return (
    <div className="flex flex-col gap-[8px]">
      {data &&
        cards.map((card, index) => {
          const frontOfCard = new String(card.content).replace(/(<([^>]+)>)/gi, '');
          const face2 = new String(
            [...data.mycontent_getMycontentByMycontentIDs.mycontents, ...data.buycontent_getBuycontentByBuycontentIDs.buycontents].find((content) => {
              return content._id === card.card_info.content.mycontent_id || content._id === card.card_info.content.buycontent_id;
            }).face2
          ).replace(/(<([^>]+)>)/gi, '');
          return <CardResult key={card.cardId} face1={frontOfCard} answer={card.answer} face2={face2} seq={index + 1} />;
        })}
    </div>
  );
};

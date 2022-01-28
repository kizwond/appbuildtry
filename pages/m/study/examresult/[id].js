import Head from "next/head";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import CardResultWrapper from "../../../../components/books/study/examResult/CardResultWrapper";

import SectionForResult from "../../../../components/books/study/result/SectionForResult";
import SummaryOfExamResult from "../../../../components/books/study/examResult/SummaryOfExamResult";

const ExamResult = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const isServer = typeof window === "undefined";
  const cards = useMemo(
    () =>
      isServer
        ? []
        : JSON.parse(sessionStorage.getItem("cardListWithExamResult")),
    [isServer]
  );

  if (!isMounted) {
    return <>로딩 중..</>;
  }
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        {isMounted && (
          <div className="w-full relative top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px] flex flex-col gap-3">
            <SectionForResult
              title="시험 요약"
              content={<SummaryOfExamResult cards={cards} from="home" />}
            />
            <SectionForResult
              title="결과"
              content={<CardResultWrapper cards={cards} />}
            />
          </div>
        )}
      </M_Layout>
    </>
  );
};

export default ExamResult;

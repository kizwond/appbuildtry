import Head from "next/head";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import CardResultWrapper from "../../../../components/books/study/examResult/CardResultWrapper";

import SectionForResult from "../../../../components/books/study/result/SectionForResult";
import SummaryOfExamResult from "../../../../components/books/study/examResult/SummaryOfExamResult";

const ReadResult = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const isServer = typeof window === "undefined";
  const cards = useMemo(
    () =>
      isServer ? [] : JSON.parse(sessionStorage.getItem("cardListStudying")),
    [isServer]
  );

  if (!isMounted) {
    return <>로딩 중..</>;
  }
  return (
    <>
      <Head>
        <title>읽기결과 - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        {isMounted && (
          <div className="w-full relative top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px] flex flex-col gap-3">
            <span>읽기결과 페이지</span>
          </div>
        )}
      </M_Layout>
    </>
  );
};

export default ReadResult;

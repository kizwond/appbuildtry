import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import CardResultWrapper from "../../../../components/books/study/examResult/CardResultWrapper";
const ExamResult = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return <>로딩 중..</>;
  }
  const cards =
    typeof window === "undefined"
      ? []
      : JSON.parse(sessionStorage.getItem("examLog"));
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

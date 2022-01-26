import Head from "next/head";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import CardResultWrapper from "../../../../components/books/study/examResult/CardResultWrapper";
import moment from "moment";
import { useCallback } from "react";
import prettyMilliseconds from "pretty-ms";
import BoxForSummaryOfMainPage from "../../../../components/common/commonComponent/BoxForSummaryOfMainPage";
import SectionForResult from "../../../../components/books/study/result/SectionForResult";
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
        {isMounted && (
          <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px] flex flex-col gap-3">
            <SectionForResult
              title="시험 요약"
              content={<SummaryOfExamResult />}
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

const SummaryOfExamResult = () => {
  const startedTime = useMemo(
    () =>
      moment(new Date(sessionStorage.getItem("started"))).format("M.D hh:mm"),
    []
  );
  const endedTime = useMemo(
    () =>
      moment(new Date(sessionStorage.getItem("endTimeOfSession"))).format(
        "M.D hh:mm"
      ),
    []
  );

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <BoxForSummaryOfMainPage title="시험 시작" content={startedTime} />
      <BoxForSummaryOfMainPage title="시험 종료" content={endedTime} />
      <BoxForSummaryOfMainPage title="정답율" content={"33/66 (50%)"} />
    </div>
  );
};

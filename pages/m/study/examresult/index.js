import Head from "next/head";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import CardResultWrapper from "../../../../components/books/study/examResult/CardResultWrapper";
import moment from "moment";
import { useCallback } from "react";
import prettyMilliseconds from "pretty-ms";
import BoxForSummaryOfMainPage from "../../../../components/common/commonComponent/BoxForSummaryOfMainPage";
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
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px] flex flex-col gap-3">
          {isMounted && <SummaryOfExamResult />}
          {isMounted && <CardResultWrapper cards={cards} />}
        </div>
      </M_Layout>
    </>
  );
};

export default ExamResult;

const SummaryOfExamResult = () => {
  const startedTime = useMemo(() => moment(new Date()).format("M.D hh:mm"), []);
  const endedTime = useMemo(() => moment(new Date()).format("M.D hh:mm"), []);
  const time = useMemo(
    () =>
      prettyMilliseconds(23456, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      }),
    []
  );

  const displayTime = useCallback((time) => {
    switch (time.length) {
      case 4:
        return "00:0" + time;
      case 5:
        return "00:" + time;
      case 6:
        return "00" + time;
      case 7:
        return "0" + time;
      case 8:
        return time;

      default:
        break;
    }
  }, []);

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <BoxForSummaryOfMainPage title="시험 시작" content={startedTime} />
      <BoxForSummaryOfMainPage title="시험 종료" content={endedTime} />
      <BoxForSummaryOfMainPage
        title="실제 학습 시간"
        content={displayTime(time)}
      />
    </div>
  );
};

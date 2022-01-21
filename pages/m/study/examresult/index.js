import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import M_Layout from "../../../../components/layout/M_Layout";

const ExamResult = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ExamResult - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div style={{marginTop:"50px"}}>시험결과화면</div>
      </M_Layout>
    </>
  );
};

export default ExamResult;

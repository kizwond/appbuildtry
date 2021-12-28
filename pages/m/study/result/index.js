import Head from "next/head";
import { useRouter } from "next/router";
import M_Layout from "../../../../components/layout/M_Layout";

const StudyResult = () => {
  const router = useRouter();

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var cardlist_to_send_tmp = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    var cardlist_to_send = JSON.stringify(cardlist_to_send_tmp, null, 2)
  }
  
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <M_Layout>
        <div style={{marginTop:"50px"}}>
            학습결과 화면
            <pre>{cardlist_to_send}</pre>
        </div>
      </M_Layout>
    </>
  );
};

export default StudyResult;

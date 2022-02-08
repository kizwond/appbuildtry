import ExamNav from "../nav/ExamNav";
import StudyNav from "../nav/StudyNav";
import Head from "next/head";
const Layout = (value) => {
  console.log(value.mode);
  console.log(value.children);
  return (
    <>
      <Head>
        <title>I am theBook</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      {value.mode === "학습" && (
        <StudyNav
          mode={value.mode}
          finishStudy={value.finishStudy}
          ttsOn={value.ttsOn}
          setTtsOn={value.setTtsOn}
          ttsNextState={value.ttsNextState}
          setTTSNextState={value.setTTSNextState}
        />
      )}
      {value.mode === "시험" && (
        <ExamNav
          mode={value.mode}
          finishStudy={value.finishStudy}
          ttsOn={value.ttsOn}
          setTtsOn={value.setTtsOn}
          ttsNextState={value.ttsNextState}
          setTTSNextState={value.setTTSNextState}
        />
      )}

      {value.children}
    </>
  );
};

export default Layout;

import StudyNav from "../nav/StudyNav";
import Head from "next/head";
const Layout = (value) => {
  console.log(value.mode)
  console.log(value.children)
  return (
    <>
      <Head>
        <title>I am theBook</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <StudyNav mode={value.mode} />
      {value.children}
    </>
  );
};

export default Layout;

import DirectReadNav from "../nav/DirectReadNav";
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
      <DirectReadNav mode={value.mode}  indexChanged={value.indexChanged} index_changed={value.index_changed} indexSets={value.indexSets} ttsOn={value.ttsOn} setTtsOn={value.setTtsOn}/>
      {value.children}
    </>
  );
};

export default Layout;

import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Layout from "../components/layout/Layout";
import RecentStudyList from "../components/index/RecentStudyList";
import Hero from "../components/index/Hero";
import NewBooks from "../components/index/NewBooks";
import Footer from "../components/index/Footer";
import { useWindowSize } from "react-use";
const Home = () => {
  const { width } = useWindowSize();

  if (width < 769 && width > 426) {
    var tablet = true;
  } else {
    tablet = false;
  }

  if (width < 1025 && width > 769) {
    var laptop = true;
  } else {
    laptop = false;
  }

  if (width > 1024) {
    var desktop = true;
  } else {
    desktop = false;
  }

  return (
    <Layout>
      <Hero />
      <RecentStudyList />
      <NewBooks />
      <Footer />
    </Layout>
  );
};

export default Home;

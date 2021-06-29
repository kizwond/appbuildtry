import BookstoreBody from "../../components/bookstore/BookstoreBody";
import BookstoreHeader from "../../components/bookstore/BookstoreHeader";
import Layout from "../../components/layout/Layout";

const Bookstore = () => {
  return (
    <Layout>
      <BookstoreHeader />
      <BookstoreBody />
    </Layout>
  );
};

export default Bookstore;

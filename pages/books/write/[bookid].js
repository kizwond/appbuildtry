import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";

import LeftDrawer from "../../../components/books/write/editpage/LeftDrawer"
import RightDrawer from "../../../components/books/write/editpage/RightDrawer"

const Book = () => {
  const { query } = useRouter();
  console.log(query);
  return (
    <Layout>
      <div style={{display:"flex", justifyContent:"space-between"}}>
      <LeftDrawer book_id={query.bookid}/>
      <h1>hello {query.bookid}</h1>
      <RightDrawer/>
      </div>
    </Layout>
  );
};
export default Book;

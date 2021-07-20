/* eslint-disable @next/next/link-passhref */
import { useRouter } from "next/router";
import BookstoreHeader from "../../../components/bookstore/BookstoreHeader";
import Layout from "../../../components/layout/Layout";
import styled from "styled-components";
import { ReadOutlined } from "@ant-design/icons";
import { Breadcrumb, Rate } from "antd";
import { useState } from "react";
import Link from "next/link";
import DetailHeader from "../../../components/bookstore/book-detail/DetailHeader";
import DetailPrice from "../../../components/bookstore/book-detail/DetailPrice";
import DetailOtherInfo from "../../../components/bookstore/book-detail/DetailOtherInfo";
import DetailIntro from "../../../components/bookstore/book-detail/DetailIntro";
import DetailReview from "../../../components/bookstore/book-detail/DetailReview";
import RatingArea from "../../../components/bookstore/book-detail/RatingArea";
import ReviewListComponent from "../../../components/bookstore/book-detail/ReviewListComponent";

const BookDetail = () => {
  const router = useRouter();
  const { book_id } = router.query;

  return (
    <Layout>
      <BookstoreHeader />
      <BooksDetailArticle>
        <div>
          <section>
            <DetailHeader />
            <DetailPrice />
            <DetailOtherInfo />
            <DetailIntro />
            <DetailReview />
            <RatingArea />
            <ReviewListComponent />
          </section>
        </div>
      </BooksDetailArticle>
      post: {book_id}
    </Layout>
  );
};

export default BookDetail;

const BooksDetailArticle = styled.div`
  width: 100%;
  overflow: hidden;
`;

import AdCarousel from "./body/AdCarousel";
import BookListCarousel from "./body/BookListCarousel";
import BookListContainer from "./body/BookListContainer";
import BookListTable from "./body/BookListTable";
import Timer from "./body/Timer";
import QuickMenu from "./body/QuickMenu";
import styles from "./BookstoreBody.module.css";

const BookstoreBody = () => {
  return (
    <main className={styles.Body}>
      <AdCarousel />
      <QuickMenu />
      <BookListContainer bg_color="#5d4040" ft_color="white" title="새로 나온 책">
        <BookListCarousel />
      </BookListContainer>
      <BookListContainer clock={<Timer />} title="잘 팔리는 책들" type="table">
        <BookListTable />
      </BookListContainer>
      bookstorebody
    </main>
  );
};

export default BookstoreBody;

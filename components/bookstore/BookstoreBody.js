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
      <BookListContainer bg_color ft_color type="carousel">
        <BookListCarousel />
      </BookListContainer>
      <BookListContainer clock={<Timer />} type="table">
        <BookListTable />
      </BookListContainer>
      bookstorebody
    </main>
  );
};

export default BookstoreBody;

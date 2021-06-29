import AdCarousel from "./body/AdCarousel";
import BookCarouselContainer from "./body/BookCarouselContainer";
import QuickMenu from "./body/QuickMenu";
import styles from "./BookstoreBody.module.css";

const BookstoreBody = () => {
  return (
    <main className={styles.Body}>
      <AdCarousel />
      <QuickMenu />
      <BookCarouselContainer />
      bookstorebody
    </main>
  );
};

export default BookstoreBody;

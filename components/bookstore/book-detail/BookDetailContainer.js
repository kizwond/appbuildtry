import styles from "./BookDetailContainer.module.css";

const BookDetailContainer = ({ children }) => {
  return (
    <div className={styles.BookDetailContainer}>
      <div>
        <div className={styles.BookDetail}>
          <div className={styles.BookDetailWrapper}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailContainer;

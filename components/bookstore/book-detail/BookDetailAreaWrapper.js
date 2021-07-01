import React from "react";
import styles from "./BookDetailAreaWrapper.module.css";

const BookDetailAreaWrapper = ({ children }) => {
  return (
    <div className={styles.BookDetailAreaWrapper}>
      <section className={styles.DetailBody}>
        <h2 className={styles.HiddenBookTitle}>{"책제목"}</h2>
        {children}
      </section>
    </div>
  );
};

export default BookDetailAreaWrapper;

import styles from "./BookListContainer.module.css";

const BookListContainer = ({ children, bg_color, ft_color, clock, type }) => {
  return (
    <section className={styles.BookListContainer} style={{ background: bg_color ? "rgb(228, 61, 105)" : "white" }}>
      <h2 className={styles.BookSectionTitle} style={{ color: ft_color ? "rgb(248, 238, 241)" : "black" }}>
        {clock}집 앞 서점에 방금 나온 신간
      </h2>
      {type === "carousel" ? (
        <div className={styles.BookListWraper}>
          <div className={styles.BookListCarouselWrapper}>
            <ul className={styles.BookListCarousel}>{children}</ul>
          </div>
        </div>
      ) : (
        <div className={styles.BookListTableWrapper}>
          <div className={styles.SlidingContainer}>
            <div className={styles.BookListTable}>
              <ul className={styles.BookListGrid}>{children}</ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookListContainer;

import styles from "./BookDetailBoxModule.module.css";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";

const BookDetailBoxModule = () => {
  return (
    <article className={styles.Wrapper}>
      <div className={styles.BookInfoWrapper}>
        {/* 카테고리------------------------------------------------------------------------------- */}
        <p className={styles.BookCategoryWrapper}>
          <Link href="/category/abced">
            <a className={styles.BookCategoryWrapper}>영어</a>
          </Link>
          <RightOutlined style={{ paddingLeft: "2px", paddingRight: "5px" }} />
          <Link href="/category/defe">
            <a className={styles.BookCategoryWrapper}>수능독해</a>
          </Link>
        </p>
        {/* 타이틀--------------------------------------------------------------------------------- */}
        <div className={styles.BookTitleWrapper}>
          <h3>EBS 수능 독해</h3>
        </div>
        {/* 평점----------------------------------------------------------------------------------- */}
        <div className={styles.MetaInfo}>
          <p className={styles.RatingIfo}>
            <span className={styles.StarRate}>
              <span className={styles.StarRateIconBox}>
                {/* TODO 아래에서 rating 입력하면 됨 */}
                <span className={styles.StarRateIconFill} style={{ width: "70%" }}></span>
              </span>
              {/* TODO 아래 스코어도 점수가 0이면 안보이게 */}
              <span className={styles.StarRateScore}>3.3점</span>
              <span className={styles.StarRateCounter}>{"23"}명</span>
            </span>
          </p>
        </div>
        {/* 저자/멘토링---------------------------------------------------------------------------- */}
        <div className={styles.MetaInfo}>
          <p className={styles.MetaWriter}>
            <span className={styles.Writer}>
              <Link href="/저자 프로필페이지">
                <a className={styles.LinkToWriterProfile}>주까</a>
              </Link>
              지음
            </span>
          </p>
          <p className={styles.MetaWriter}>
            <span className={styles.Writer}>
              <Link href="/멘토링 온">
                <a className={styles.LinkToWriterProfile}>23명의 멘토링</a>
              </Link>
              서비스 중
            </span>
          </p>
        </div>
        {/* 금액----------------------------------------------------------------------------------- */}
      </div>
    </article>
  );
};

export default BookDetailBoxModule;

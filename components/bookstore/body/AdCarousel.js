import styles from "./AdCarousel.module.css";
import Link from "next/link";
import Image from "next/image";

const AdCarousel = () => {
  const numbers = [1, 2, 3];
  return (
    <div className={styles.CarouselWrapper}>
      <div className={styles.CarouselView}>
        <ul className={styles.CarouselList}>
          {numbers.map((number) => (
            <li className={styles.CarouselItem} key={number}>
              <Link href="/">
                <a className={styles.BannerIamgeLink}>
                  <Image src={`/image/event/event${number}.jpg`} className={styles.BannerImage} alt="가나다" layout="fill" />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.CarouselControllerWrapper}>
        <div className={styles.CarouselController}>
          <div className={styles.SlideBadge}>
            <strong>17</strong> / 20
          </div>
        </div>
      </div>
      <div className={styles.CarouselControllerWrapper} style={{ zIndex: 1 }}>
        <div className={styles.ArrowWrapper}>
          <button className={styles.ArrowButton}>
            <svg width="11" height="14" className={styles.ArrowLeft}>
              <path d="M1.78 13.013L7.68 7 1.78.987 2.75 0l6.875 7-6.875 7z"></path>
            </svg>
            <span className={styles.HiddenBannerText}>이전 배너 보기</span>
          </button>
        </div>
        <div className={styles.CarouselController}></div>
        <div className={styles.ArrowWrapper}>
          <button className={styles.ArrowButton}>
            <svg width="11" height="14" className={styles.ArrowRight}>
              <path d="M1.78 13.013L7.68 7 1.78.987 2.75 0l6.875 7-6.875 7z"></path>
            </svg>
            <span className={styles.HiddenBannerText}>다음 배너 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCarousel;

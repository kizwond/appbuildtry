import React from "react";
import styles from "./FavoriteCategory.module.css";
import Link from "next/link";

const FavoriteCategory = () => {
  const favorite_categories = ["영단어", "과학", "인문", "회화", "취미", "전문가"];

  return (
    <div className={styles.BoxWrapper}>
      <div className={styles.Top}>
        <ul className={styles.TopWrapper}>
          {favorite_categories.map((item, index) => (
            <li className={styles.TopItemWrapper} key={index}>
              {/* TODO 카테고리 페이지는 만들면 <Link href="작성해야함" */}
              <Link href="/">
                <a className={styles.TopItemLink}>{item}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoriteCategory;

import React, { useState } from "react";
import styles from "./FavoriteCategory.module.css";
import Link from "next/link";
import { Menu } from "antd";
import { useRouter } from "next/router";

const { Item } = Menu;
const favorite_categories = ["영단어", "과학", "인문", "회화", "취미", "전문가"];

const FavoriteCategory = () => {
  const [current, setCurrent] = useState("");
  const router = useRouter();

  const handleClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);

    // TODO 아래는 나중에 누르면 페이지 이동하는 것으로 작업 해야함
    // router.push(`/category/${e.key}`);
  };

  return (
    <div className={styles.BoxWrapper}>
      <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
        <Item key="english">영단어</Item>
        <Item key="math">수학</Item>
        <Item key="test">시험</Item>
      </Menu>
      {/* <div className={styles.Top}>
        <ul className={styles.TopWrapper}>
          {favorite_categories.map((item, index) => (
            <li className={styles.TopItemWrapper} key={index}>
              TODO 카테고리 페이지는 만들면 <Link href="작성해야함"
              <Link href="/">
                <a className={styles.TopItemLink}>{item}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default FavoriteCategory;

import React, { useState } from "react";
import styles from "./FavoriteCategory.module.css";
import Link from "next/link";
import { Menu } from "antd";
import { useRouter } from "next/router";

const { Item } = Menu;
const favorite_categories = [
  "영단어",
  "과학",
  "인문",
  "회화",
  "취미",
  "전문가",
];

const FavoriteCategory = () => {
  const [current, setCurrent] = useState("");
  const router = useRouter();

  const handleClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);
  };

  return (
    <div className={styles.BoxWrapper}>
      <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
        <Item key="english">영단어</Item>
        <Item key="math">수학</Item>
        <Item key="test">시험</Item>
      </Menu>
    </div>
  );
};

export default FavoriteCategory;

import styles from "./SearchBar.module.css";
// import Image from "next/image";
import { Input } from "antd";

const { Search } = Input;

const SearchBar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.gnbContainer}>
        <div className={styles.navigationWrapper}>
          <Search placeholder="제목, 저자, 카테고리 검색" allowClear enterButton />
          {/* <div className={styles.logoSearchArea}>
            <formcss className={styles.searchWrapper}>
              <label className={styles.searchBoxWrapper}>
                <Image src="/image/round_search_black_18dp.png" alt="검색" width={24} height={24} className={styles.searchImage} />
                <input type="search" placeholder="제목, 저자, 출판사 검색" className={styles.searchBox} />
              </label>
            </formcss>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default SearchBar;

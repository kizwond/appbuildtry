import styles from "./QuickMenu.module.css";
import Link from "next/link";
import Image from "next/image";

const QuickMenu = () => {
  return (
    <section className={styles.QuickMenu}>
      <ul className={styles.QuickMenuWrapper}>
        {QuickMenuItem.map((menu, index) => (
          <li className={styles.QuickMenuItem} key={index}>
            <Link href="/">
              <a className={styles.QuickMenuItemAnchor}>
                <svg className={styles.QuickMenuItemBg}>
                  <rect rx="8" ry="8" width="44" height="44" className={styles.QuickMenuItemBgRect} />
                </svg>
                <span className={styles.QuickMenuItemInnerText}>{menu.title}</span>
                <span className={styles.QuickMenuItemText}>{menu.category}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QuickMenu;

const QuickMenuItem = [
  { category: "신간", title: "new" },
  { category: "이벤트", title: "event" },
  { category: "베스트셀러", title: "best" },
  { category: "대연관", title: "대여" },
  { category: "신간", title: "new" },
  { category: "신간", title: "new" },
  { category: "신간", title: "new" },
  { category: "신간", title: "new" },
  { category: "신간", title: "new" },
  { category: "신간", title: "new" },
];

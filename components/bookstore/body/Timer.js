import styles from "./Timer.module.css";
import Image from "next/image";

const Timer = () => {
  let nowHours = new Date().getHours();
  let nowMinutes = new Date().getMinutes();
  return (
    <div className={styles.TimerWrapper}>
      <Image className={styles.TimerImage} src="/image/watch_later_white_24dp.svg" width={12} height={12} alt="시계아이콘" />
      <span style={{ flex: "none" }}>
        {nowHours}시 {nowMinutes}분
      </span>
    </div>
  );
};

export default Timer;

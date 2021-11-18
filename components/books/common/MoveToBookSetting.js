import React, { memo } from "react";
import { useRouter } from "next/router";

import { SettingOutlined } from "@ant-design/icons";

const MoveToBookSetting = ({ mybook_id }) => {
  const router = useRouter();

  return (
    <div
      className="PullCustomCircleButton"
      style={{
        width: "44px",
        height: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SettingOutlined
        shape="circle"
        icon={<SettingOutlined />}
        onClick={() => {
          router.push(`/books/study/setting/${mybook_id}`);
        }}
      />
    </div>
  );
};

export default memo(MoveToBookSetting);

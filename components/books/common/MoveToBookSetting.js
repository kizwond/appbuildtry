import React, { memo } from "react";
import { useRouter } from "next/router";

import { SettingOutlined } from "@ant-design/icons";

const MoveToBookSetting = ({ mybook_id }) => {
  const router = useRouter();

  return (
    <div
      className="customCircleButton"
      onClick={() => {
        router.push(`/books/study/setting/${mybook_id}`);
      }}
    >
      <SettingOutlined />
    </div>
  );
};

export default memo(MoveToBookSetting);

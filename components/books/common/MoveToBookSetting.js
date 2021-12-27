import React, { memo } from "react";
import { useRouter } from "next/router";

import { SettingOutlined } from "@ant-design/icons";

const MoveToBookSetting = ({ mybook_id, isPc }) => {
  const router = useRouter();

  return (
    <div
      className="customCircleButton"
      onClick={() => {
        router.push(
          isPc
            ? `/mybooks/settings/${mybook_id}`
            : `/m/mybooks/settings/${mybook_id}`
        );
      }}
    >
      <SettingOutlined />
    </div>
  );
};

export default memo(MoveToBookSetting);

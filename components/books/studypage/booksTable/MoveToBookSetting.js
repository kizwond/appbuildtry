import React, { memo } from "react";
import { useRouter } from "next/router";

import { Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const MoveToBookSetting = ({ mybook_id }) => {
  const router = useRouter();

  return (
    <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0} title="책 상세설정" color="rgba(242, 7, 7, 0.645)" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
      <MoreOutlined
        shape="circle"
        onClick={() => {
          router.push(`/books/study/setting/${mybook_id}`);
        }}
      />
    </Tooltip>
  );
};

export default memo(MoveToBookSetting);

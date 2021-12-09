import React from "react";
import UserFlagIcon from "../components/common/commonComponent/UserFlagIcon";
import { Space } from "antd";

const Test = () => {
  return (
    <Space direction="vertical">
      <UserFlagIcon
        figure="bookmark"
        color="orange"
        textColor="blue"
        flagNumber="3"
        iconRemSize="1"
      />
      <UserFlagIcon
        figure="star"
        color="orange"
        textColor="blue"
        flagNumber="5"
        iconRemSize="1"
      />
      <UserFlagIcon
        figure="heart"
        color="orange"
        textColor="blue"
        flagNumber="6"
        iconRemSize="1"
      />
      <UserFlagIcon
        figure="tag"
        color="orange"
        textColor="blue"
        flagNumber="2"
        iconRemSize="1"
      />
      <UserFlagIcon
        figure="flag"
        color="orange"
        textColor="blue"
        flagNumber="2"
        iconRemSize="1"
      />
    </Space>
  );
};

export default Test;

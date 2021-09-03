import React, { memo } from 'react';
import { Row, Col } from 'antd';

const ColFormItem = ({ menuColDivider, children, title, style }) => {
  return (
    <Col
      xs={8}
      sm={menuColDivider}
      md={menuColDivider}
      lg={12}
      xl={12}
      xxl={12}
      style={style ? style : {}}
    >
      <Row align="top" gutter={8}>
        {title && <Col span={13}>{title}</Col>}
        <Col>{children}</Col>
      </Row>
    </Col>
  );
};

export default memo(ColFormItem);

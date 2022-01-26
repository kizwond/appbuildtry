import TableForStudiedCards from './TableForStudiedCards';
import styled from 'styled-components';
import { Drawer } from 'antd';
import { memo } from 'react';

const SlidingDrawerForAllCards = ({ visible, closeDrawer, cards, contentType, myContents, buyContents }) => {
  return (
    <DrawerWrapper
      title={
        contentType === 'clickedCard'
          ? '클릭한 카드'
          : contentType === 'changedLevel'
          ? '레벨 변동'
          : contentType === 'clickedTimes'
          ? '학습 횟수 많은 카드'
          : '학습 시간 많은 카드'
      }
      placement="right"
      width={'100%'}
      height={'calc(100vh - 39px)'}
      mask={false}
      visible={visible}
      onClose={closeDrawer}
      zIndex={10}
    >
      {contentType === 'clickedCard' && <div className="text-[0.9rem] text-gray-500">※ 선택 열의 숫자는 클릭한 카드의 난이도입니다.</div>}
      {[...myContents, ...buyContents].length > 0 && (
        <TableForStudiedCards cards={cards} myContents={myContents} contentType={contentType} buyContents={buyContents} />
      )}
    </DrawerWrapper>
  );
};

export default memo(SlidingDrawerForAllCards);

const DrawerWrapper = styled(Drawer)`
  top: 39px;
  /* height: calc(100vh - 40px); */
  .ant-drawer-header {
    padding: 8px 12px 4px 8px;
  }

  .ant-drawer-close {
    font-size: 1.166667rem;
  }
  & .ant-drawer-title {
    font-size: 1.166667rem;
  }
  & .ant-drawer-body {
    padding: 10px 12px;
    background: #ffffff;
  }
  .ant-drawer-content-wrapper {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

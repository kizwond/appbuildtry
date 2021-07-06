import { ArrowDownOutlined, DollarCircleFilled } from "@ant-design/icons";
import styled from "styled-components";

const DetailPrice = () => {
  return (
    <DetailPriceWrapper>
      <InfoPriceTable>
        <PriceTable>
          <tbody>
            <tr>
              <PriceTitle rowSpan="3">금액</PriceTitle>
              <PriceType>전자책 정가</PriceType>
              <Price>15,000원</Price>
            </tr>
            <tr>
              <PriceType>판매가</PriceType>
              <PriceWithBlue>
                <DiscountRate>
                  {"10%"}
                  <ArrowDownOutlined />
                </DiscountRate>
                {"13,500원"}
              </PriceWithBlue>
            </tr>
          </tbody>
        </PriceTable>
      </InfoPriceTable>
      <InfoDiscountPeriodWrap>
        <PeriodHead>혜택 기간: </PeriodHead>
        <PeriodDate>21.07.14~21.08.12</PeriodDate>
      </InfoDiscountPeriodWrap>
    </DetailPriceWrapper>
  );
};

export default DetailPrice;

const DetailPriceWrapper = styled.div`
  margin-top: 12px;
  padding: 10px 15px 15px 15px;
`;

const InfoPriceTable = styled.div`
  font-size: 14px;
`;

const PriceTable = styled.table`
  border-spacing: 0;
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid #e6e8eb;
  border-bottom: 1px solid #e6e8eb;
`;

const PriceTitle = styled.th`
  margin: 0;
  padding: 0;
  min-height: 36px;
  padding: 7px 0;
  vertical-align: middle;
  font-size: 13px;
  box-sizing: border-box;
  color: #40474d;
  border-right: 1px solid #e6e8eb;
  background: #f7fafc;
  width: 23%;
`;

const PriceType = styled.td`
  padding: 0;
  margin: 0;
  min-height: 36px;
  vertical-align: middle;
  font-size: 13px;
  box-sizing: border-box;
  white-space: nowrap;
  color: #808991;
  padding: 7px 10px;
  width: 31%;
`;

const Price = styled.td`
  padding: 0;
  margin: 0;
  min-height: 36px;
  vertical-align: middle;
  font-size: 13px;
  box-sizing: border-box;
  white-space: nowrap;
  color: #808991;
  padding: 7px 10px;
  text-align: right;
  font-weight: 700;
  width: 31%;
`;

const PriceWithBlue = styled(Price)`
  color: #1f8ce6;
`;

const DiscountRate = styled.span`
  margin-right: 5px;
  color: #eb372d;
`;

const InfoDiscountPeriodWrap = styled.div`
  padding-top: 10px;
  width: 100%;
  box-sizing: border-box !important;
  font-size: 13px;
  color: #808991;
`;

const PeriodHead = styled.span`
  font-size: 13px;
  color: #808991;
  position: relative;
  padding-left: 9px;

  &::before {
    position: absolute;
    content: '';
    width: 4px;
    height: 4px;
    top: 5px;
    left: 1px;
    background: #808991;
`;

const PeriodDate = styled.span`
  font-size: 13px;
  color: #808991;
`;

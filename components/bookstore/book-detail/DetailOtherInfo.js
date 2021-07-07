import { AndroidOutlined, AppleOutlined, WindowsOutlined } from "@ant-design/icons";
import styled from "styled-components";

const DetailOtherInfo = () => {
  return (
    <DetailOtherInfoWrapper>
      <DetailOtherInfoItem>
        <InfoTitle>출간 정보</InfoTitle>
        <InfoListWrapper>
          <TextStyled>2021.02.15 종이책 출간, 2021.06.15 콕북 출간</TextStyled>
        </InfoListWrapper>
      </DetailOtherInfoItem>
      <DetailOtherInfoItem>
        <InfoTitle>카드 수량</InfoTitle>
        <InfoListWrapper>
          <TextStyled>231 장</TextStyled>
        </InfoListWrapper>
      </DetailOtherInfoItem>
      <DetailOtherInfoItem>
        <InfoTitle> 지원 기기</InfoTitle>
        <InfoListWrapper>
          <TextStyled>
            <AndroidOutlined />
            {"Android  "}
            <AppleOutlined />
            {"IOS  "}
            <WindowsOutlined />
            {"PC  "}
          </TextStyled>
        </InfoListWrapper>
      </DetailOtherInfoItem>
    </DetailOtherInfoWrapper>
  );
};

export default DetailOtherInfo;

const DetailOtherInfoWrapper = styled.div`
  background: #f7fafc;
  border-top: 1px solid #d1d5d9;
  padding: 8px 0;
`;

const DetailOtherInfoItem = styled.div`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

const InfoTitle = styled.span`
  display: table-cell;
  padding: 5px 0;
  font-size: 13px;
  color: #636c73;
  font-weight: 700;
  width: 76px;
  padding-left: 15px;
  vertical-align: top;
`;

const InfoListWrapper = styled.div`
  display: table-cell;
  padding: 5px 0;
  font-size: 13px;
  color: #636c73;
`;

const TextStyled = styled.p`
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: #636c73;
  vertical-align: top;
`;

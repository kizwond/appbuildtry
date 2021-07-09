import styled from "styled-components";
import { ReadOutlined } from "@ant-design/icons";
import { Breadcrumb, Rate } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import details from "./dataDetail";

const DetailHeader = () => {
  const router = useRouter();

  return (
    <DetailHeaderWrapper>
      <HeaderThumbnailWrap>
        <HeaderThumbnail>
          <BookThumbnailWrapper>
            <BookThumbnail>
              <ThumbnailImage>
                <StyledImageTag src="/image/bookcover/bookcover5.png" alt={details.book_info.title} />
              </ThumbnailImage>
            </BookThumbnail>
          </BookThumbnailWrapper>
        </HeaderThumbnail>
        <HeaderPreReading>
          <ButtonStyled>
            <span>
              <ReadOutlined style={{ marginRight: "3px" }} />
              <span>미리보기</span>
            </span>
          </ButtonStyled>
        </HeaderPreReading>
      </HeaderThumbnailWrap>
      <HeaderInfoWrap>
        <InfoCategoryWrap>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => router.push("/category")}>영어</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => router.push("/category")}>영어단어</Breadcrumb.Item>
          </Breadcrumb>
        </InfoCategoryWrap>
        <InfoTitleWrap>{details.book_info.title}</InfoTitleWrap>
        <InfoSubTitleWrap>{details.book_info.title}</InfoSubTitleWrap>
        <MetaDataRating>
          <Rate disabled allowHalf defaultValue={2.5} />
          <RatingScore>2.5점</RatingScore>
          <RatingCounter>(12명)</RatingCounter>
        </MetaDataRating>
        <MetaDataWriter>
          <AuthorItemWrapper>
            <Link href="/author/" passHref>
              <DetailLink>{details.book_info.author}</DetailLink>
            </Link>
            {" 저"}
          </AuthorItemWrapper>
        </MetaDataWriter>
        <MetaDataPublisher>
          <Link href="/publisher" passHref>
            <DetailLink>{details.book_info.publisher}</DetailLink>
          </Link>
          {" 출판 "}
        </MetaDataPublisher>
      </HeaderInfoWrap>
    </DetailHeaderWrapper>
  );
};

export default DetailHeader;

const DetailHeaderWrapper = styled.article`
  display: table;
  width: 100%;
  padding: 20px 15px 5px 15px;
  box-sizing: border-box !important;
`;

const HeaderThumbnailWrap = styled.div`
  display: table-cell;
  width: 110px;
  padding-right: 15px;
`;

const HeaderThumbnail = styled.div`
  font-size: 14px;
`;

const BookThumbnailWrapper = styled.div`
  width: 110px;
`;

const BookThumbnail = styled.div`
  display: inline-block;
  position: relative;
  height: auto;
`;

const ThumbnailImage = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  background: #d9d9d9;

  &:before {
    content: "";
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0, rgba(0, 0, 0, 0.2)),
      color-stop(5%, rgba(0, 0, 0, 0)),
      color-stop(95%, rgba(0, 0, 0, 0)),
      color-stop(100%, rgba(0, 0, 0, 0.2))
    );
    background: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background: -o-linear-gradient(left, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background: -ms-linear-gradient(left, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    background: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
  }
`;

const StyledImageTag = styled.img`
  width: 110px;
  max-width: 167px;
`;

const HeaderPreReading = styled.div`
  padding-top: 10px;
  text-align: center;
`;

const RuiButtonBlueLine40 = styled.div`
  font-family: ridi-roboto, Helvetica Neue, Apple SD Gothic Neo, "나눔고딕", Nanum Gothic, "돋움", arial, Dotum, Tahoma, Geneva, sans-serif;
  letter-spacing: -0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 0;
  box-shadow: none;
  outline: 0;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 4px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  line-height: 1em;
  vertical-align: baseline;
  transition: background 0.2s, color 0.2s;
  color: #1f8ce6;
  background: #fff;
  border: 1px solid #1f8ce6;
  box-shadow: 0 1px 1px 0 rgb(31 140 230 / 30%);
  font-size: 13px;
  padding: 12px 26px;

  &:focus,
  &:hover,
  &:link,
  &:visited {
    color: #1f8ce6;
  }
`;

const ButtonStyled = styled(RuiButtonBlueLine40)`
  width: 110px;
  padding: 12px 0;
`;

const HeaderInfoWrap = styled.div`
  display: table-cell;
  width: auto;
  vertical-align: top;
`;

const InfoCategoryWrap = styled.p`
  margin: 0;
  padding: 0;
`;

const InfoTitleWrap = styled.h3`
  padding: 5px 0 6px 0;
  line-height: 1.2em;
  font-size: 23px;
  color: #000;
  font-weight: 700;
  margin: 0;
`;

const InfoSubTitleWrap = styled.h4`
  padding: 0;
  margin: 0;
  padding-bottom: 2px;
  font-size: 14px;
  color: #636c73;
  font-weight: 400;
`;

const MetaDataRating = styled.p`
  margin: 0;
  padding: 0;
  & .ant-rate {
    font-size: 16px;
  }

  & .ant-rate-star {
    margin-right: 0px;
  }
`;
const RatingScore = styled.span`
  display: inline-block;
  font-size: 14px;
  color: #fa722e;
  margin-left: 5px;
  font-weight: bold;
`;
const RatingCounter = styled.span`
  margin-left: 2px;
  font-size: 12px;
`;

const MetaDataWriter = styled.p`
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: #636c73;
  line-height: 1.4em;
  margin-top: 8px;
`;
const AuthorItemWrapper = styled.span`
  position: relative;
  margin-left: 5px;
  padding-left: 6px;
  &:first-child {
    padding-left: 0;
    margin-left: 0;
  }
  &:first-child:before {
    display: none;
  }
  &:before {
    content: "";
    display: block;
    background: #d1d5d9;
    position: absolute;
    top: 2px;
    left: 0;
    width: 1px;
    height: 12px;
  }
`;
const DetailLink = styled.a`
  font-size: 14px;
  color: #636c73;
  line-height: 1.4em;
  font-weight: 700;
`;

const MetaDataPublisher = styled.p`
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #636c73;
  line-height: 1.4em;
  margin-top: 4px;
`;

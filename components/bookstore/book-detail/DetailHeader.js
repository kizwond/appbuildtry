import styled from "styled-components";
import { ReadOutlined } from "@ant-design/icons";
import { Breadcrumb, Rate } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

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
  padding: 10px 0;
  line-height: 1.2em;
  font-size: 23px;
  color: #000;
  font-weight: 700;
  margin: 0;
`;

const InfoSubTitleWrap = styled.h4`
  padding: 0;
  margin: 0;
  padding-bottom: 7px;
  font-size: 14px;
  color: #636c73;
  line-height: 1.4em;
  font-weight: 400;
`;

const MetaDataRating = styled.p`
  margin: 0;
  padding: 0;
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

const details = {
  _id: "6073c62ce46f627b2516ebfa",
  book_info: {
    title: "하룻밤에 읽는 한국사",
    category: ["elementaryschool", "middleschool", "highschool", "worker"],
    bookcover: {
      url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
      url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
      url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
      url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
    },
    hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
    author: "최용범",
    publisher: "콕북출판",
    intro_book:
      "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
    intro_author:
      "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
    indexes:
      "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
    price: 11760,
    promotion: {
      name: "",
      gap: "undefined",
      period: {
        from: "1970-01-01T00:00:00.000Z",
        to: "1970-01-01T00:00:00.000Z",
      },
    },
    original_book_id: "",
  },
  index_set: [],
  cardtype_set: [],
  cardinfo_set: [],
  time_created: "2021-04-12T04:01:48.604Z",
  __v: 0,
};

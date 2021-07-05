// import styles from "./BookListCarousel.module.css";
import Link from "next/link";
import styled from "styled-components";

const BookListCarousel = () => {
  return (
    <BookList>
      {sellbooklist.map((book, index) => (
        <>
          <BookWrapper key={index}>
            <Link href={`/bookstore/book-detail/${book._id}`}>
              <StyledAnchor>
                <ThumbnailWrapper>
                  <StyledThumbnailWrapper>
                    <ImageWrapper src={`/image/bookcover/bookcover${index + 1}.png`} alt={book.book_info.title} />
                    <BadgeContainer>
                      <DiscountBadge role="img" aria-label="10% 할인">
                        <DiscountNumber>10</DiscountNumber>
                        <DiscountPercentage>%</DiscountPercentage>
                      </DiscountBadge>
                    </BadgeContainer>
                  </StyledThumbnailWrapper>
                </ThumbnailWrapper>
              </StyledAnchor>
            </Link>
            <MetaInfoContainer>
              <Link href="/">
                <a>
                  <MetaInfoBookTitle>{book.book_info.title}</MetaInfoBookTitle>
                </a>
              </Link>
              <MetaInfoAuthorsWrapper>
                <a href="/author/3065">{book.book_info.author}</a>
              </MetaInfoAuthorsWrapper>
            </MetaInfoContainer>
          </BookWrapper>
        </>
      ))}
    </BookList>

    // <>
    //   {sellbooklist.map((book, index) => (
    //     <li className={styles.BookItemWrapper} key={index}>
    //       <Link href={`/bookstore/book-detail/${book._id}`}>
    //         <a className={styles.BookItemLink}>
    //           <div className={styles.ThumbnailContainer}>
    //             <div className={styles.ThumbnailWrapper}>
    //               <Image
    //                 src={`/image/bookcover/bookcover${index + 1}.png`}
    //                 alt={book.book_info.title}
    //                 width={100}
    //                 height={160}
    //                 // layout="fill"
    //                 // sizes="(max-width: 999px) 100px, 140px"
    //               />

    //               <div className={styles.DiscountWrapper}>
    //                 <div className={styles.DiscountSticker}>
    //                   <span className={styles.DiscountNumber}>10</span>
    //                   <span className={styles.DiscountPercent}>%</span>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </a>
    //       </Link>
    //       <div className={styles.BookInfoContainer}>
    //         <Link href="/bookstore">
    //           <a>
    //             <div className={styles.BookTitleBelowThumbnail}>{book.book_info.title}</div>
    //           </a>
    //         </Link>

    //         <Link href="/bookstore">
    //           <a>
    //             <span className={styles.BookAuthorBelowThumbnail}>{book.book_info.author}</span>
    //           </a>
    //         </Link>
    //       </div>
    //     </li>
    //   ))}
    // </>
  );
};

export default BookListCarousel;

const BookList = styled.ul`
  flex: none;
  margin-left: 10px;
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;

  @media (min-width: 1000px) {
    margin-left: 0;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
`;

const BookWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;
  margin-right: 12px;

  @media (max-width: 999px) {
    min-width: 100px;
    width: 100px;
  }
  @media (min-width: 834px) {
    margin-right: 20px;
  }
  @media (min-width: 1000px) {
    margin-right: 22px;
  }
`;

const StyledAnchor = styled.a`
  display: inline-block;
  &:link {
    text-decoration: none;
  }
`;

const ThumbnailWrapper = styled.div`
  width: 140px;
  height: 216px;
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
  transition: opacity 0.2s;
  max-height: calc(140px * 1.618 - 10px);

  @media (max-width: 999px) {
    width: 100px;
    height: 153px;
    max-height: calc(100px * 1.618 - 10px);
  }

  & img {
    max-height: calc(140px * 1.618 - 10px);
    @media (max-width: 999px) {
      max-height: calc(100px * 1.618 - 10px);
    }
  }
`;

const StyledThumbnailWrapper = styled.div`
  position: relative;
  line-height: 0;
  max-height: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.15);
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);

  &::after {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.2) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.2) 100%);
    border: solid 1px rgba(0, 0, 0, 0.1);
    content: "";
  }

  &:hover::after,
  &active::after {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0, rgba(0, 0, 0, 0) 5%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0.15) 100%);
  }
`;

const ImageWrapper = styled.img`
  @media (max-width: 999px) {
    width: 100px;
  }
  @media (min-width: 1000px) {
    width: 140px;
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  display: block;
  top: -7px;
  left: -7px;
  z-index: 2;
`;

const DiscountBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: #59667a;
  position: relative;
  color: white;
`;

const DiscountNumber = styled.span`
  font-size: 16px;
  mix-blend-mode: normal;
  font-weight: bold;
  line-height: 14px;
  opacity: 0.99;
`;

const DiscountPercentage = styled.span`
  top: 1.6px;
  transform: scale(0.92);
  font-weight: bold;
  margin-left: 0.7px;
  font-size: 11px;
  position: relative;
  line-height: 9px;
`;

const MetaInfoContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s ease-in-out;
`;

const MetaInfoBookTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.33em;
  color: #000000;
  max-height: 2.7em;
  margin-bottom: 4.5px;
  font-size: 14px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;

  @media (max-width: 999px) {
    font-size: 14px;
  }
  @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
    white-space: nowrap;
  }
`;

const MetaInfoAuthorsWrapper = styled.span`
  height: 19px;
  font-size: 14px;
  line-height: 1.36;
  color: #9ea7ad;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;

  @media (-ms-high-contrast: none), (-ms-high-contrast: active) {
    white-space: nowrap;
  }
`;

const sellbooklist = [
  {
    book_info: {
      author: "최용범",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
      intro_author:
        "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
      intro_book:
        "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "콕북출판",
      title: "하룻밤에 읽는 한국사",
    },
    _id: "6073c62ce46f627b2516ebfa",
  },
  {
    book_info: {
      author: "이규현",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/16181893713344.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/16181893713344.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "프롤로그-즐거운 미술경매 미술경매 기초지식 미술경매의 현장들 역사에 남은, 역사에 남을 컬렉터들 역사에 남은, 역사에 남을 딜러들 경매의 스타 작가들에게는 다 이유가 있다 컬렉터 되어 보기",
      intro_author:
        "저자 - 이규현 전 조선일보 문화부 미술담당 기자로 서울디지털대학교 초빙교수(아트비즈니스 전공), 연세대, 중앙대 교양미술 강사활동을 했다. 연세대 국문학과 졸업했고, 중앙대 예술대학원 박물관미술관학과에서 미술이론 전공으로 석사학위 받았다. 그는 뉴욕 크리스티 경매회사에 있는 대학원 과정인 크리스티 에듀케이션(Christie’s Education)에서 Advanced Certificate 과정을 졸업했다. 미술경매의 전문가인 그는 자신이 정말 좋아하는 작품을 손에 넣게 된 미술애호가들의 그 행복한 순간들을 목격하고 기록한 것이다. 미술경매 취재를 시작하면서, 아니, 일간지 기자가 경매장까지 취재를 오다니...라는 말을 듣곤 했다고 한다.  그의 저서로는 『그림쇼핑』이 있고, 논문으로는 「신문 미술기사의 특성과 시대별 기능변화 연구-해방 이후 한국종합일간지를 중심으로」가 있다.",
      intro_book:
        "미술품 경매가 투자수단으로 각광 받고 있는 현 시점에서, 조선일보 미술담당 기자이자 세계 2대 경매회사 중 하나인 크리스티에서 대학원 과정을 졸업하기도 한 저자가 이 책을 통해 미술경매에 필요한 필수지식을 전한다. 하지만 저자는 여기서 그치지 않고, 역사에 기록될 유명 아트딜러들과 컬렉터들의 이야기를 함께 소개함으로써 단지 재테크에만 목적을 두는 것이 아닌 미술을 즐길 줄 아는 진정한 컬렉터가 되는 길로 독자들을 안내하고 있다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "살림 출판",
      title: "미술이야기",
    },
    _id: "60739c45ad7ba776d9cd73d1",
  },

  {
    book_info: {
      author: "최용범",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
      intro_author:
        "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
      intro_book:
        "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "콕북출판",
      title: "하룻밤에 읽는 한국사",
    },
    _id: "6073c62ce46f627b2516ebfa",
  },
  {
    book_info: {
      author: "이규현",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/16181893713344.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/16181893713344.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "프롤로그-즐거운 미술경매 미술경매 기초지식 미술경매의 현장들 역사에 남은, 역사에 남을 컬렉터들 역사에 남은, 역사에 남을 딜러들 경매의 스타 작가들에게는 다 이유가 있다 컬렉터 되어 보기",
      intro_author:
        "저자 - 이규현 전 조선일보 문화부 미술담당 기자로 서울디지털대학교 초빙교수(아트비즈니스 전공), 연세대, 중앙대 교양미술 강사활동을 했다. 연세대 국문학과 졸업했고, 중앙대 예술대학원 박물관미술관학과에서 미술이론 전공으로 석사학위 받았다. 그는 뉴욕 크리스티 경매회사에 있는 대학원 과정인 크리스티 에듀케이션(Christie’s Education)에서 Advanced Certificate 과정을 졸업했다. 미술경매의 전문가인 그는 자신이 정말 좋아하는 작품을 손에 넣게 된 미술애호가들의 그 행복한 순간들을 목격하고 기록한 것이다. 미술경매 취재를 시작하면서, 아니, 일간지 기자가 경매장까지 취재를 오다니...라는 말을 듣곤 했다고 한다.  그의 저서로는 『그림쇼핑』이 있고, 논문으로는 「신문 미술기사의 특성과 시대별 기능변화 연구-해방 이후 한국종합일간지를 중심으로」가 있다.",
      intro_book:
        "미술품 경매가 투자수단으로 각광 받고 있는 현 시점에서, 조선일보 미술담당 기자이자 세계 2대 경매회사 중 하나인 크리스티에서 대학원 과정을 졸업하기도 한 저자가 이 책을 통해 미술경매에 필요한 필수지식을 전한다. 하지만 저자는 여기서 그치지 않고, 역사에 기록될 유명 아트딜러들과 컬렉터들의 이야기를 함께 소개함으로써 단지 재테크에만 목적을 두는 것이 아닌 미술을 즐길 줄 아는 진정한 컬렉터가 되는 길로 독자들을 안내하고 있다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "살림 출판",
      title: "미술이야기",
    },
    _id: "60739c45ad7ba776d9cd73d1",
  },

  {
    book_info: {
      author: "최용범",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
      intro_author:
        "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
      intro_book:
        "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "콕북출판",
      title: "하룻밤에 읽는 한국사",
    },
    _id: "6073c62ce46f627b2516ebfa",
  },
  {
    book_info: {
      author: "이규현",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/16181893713344.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/16181893713344.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "프롤로그-즐거운 미술경매 미술경매 기초지식 미술경매의 현장들 역사에 남은, 역사에 남을 컬렉터들 역사에 남은, 역사에 남을 딜러들 경매의 스타 작가들에게는 다 이유가 있다 컬렉터 되어 보기",
      intro_author:
        "저자 - 이규현 전 조선일보 문화부 미술담당 기자로 서울디지털대학교 초빙교수(아트비즈니스 전공), 연세대, 중앙대 교양미술 강사활동을 했다. 연세대 국문학과 졸업했고, 중앙대 예술대학원 박물관미술관학과에서 미술이론 전공으로 석사학위 받았다. 그는 뉴욕 크리스티 경매회사에 있는 대학원 과정인 크리스티 에듀케이션(Christie’s Education)에서 Advanced Certificate 과정을 졸업했다. 미술경매의 전문가인 그는 자신이 정말 좋아하는 작품을 손에 넣게 된 미술애호가들의 그 행복한 순간들을 목격하고 기록한 것이다. 미술경매 취재를 시작하면서, 아니, 일간지 기자가 경매장까지 취재를 오다니...라는 말을 듣곤 했다고 한다.  그의 저서로는 『그림쇼핑』이 있고, 논문으로는 「신문 미술기사의 특성과 시대별 기능변화 연구-해방 이후 한국종합일간지를 중심으로」가 있다.",
      intro_book:
        "미술품 경매가 투자수단으로 각광 받고 있는 현 시점에서, 조선일보 미술담당 기자이자 세계 2대 경매회사 중 하나인 크리스티에서 대학원 과정을 졸업하기도 한 저자가 이 책을 통해 미술경매에 필요한 필수지식을 전한다. 하지만 저자는 여기서 그치지 않고, 역사에 기록될 유명 아트딜러들과 컬렉터들의 이야기를 함께 소개함으로써 단지 재테크에만 목적을 두는 것이 아닌 미술을 즐길 줄 아는 진정한 컬렉터가 되는 길로 독자들을 안내하고 있다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "살림 출판",
      title: "미술이야기",
    },
    _id: "60739c45ad7ba776d9cd73d1",
  },

  {
    book_info: {
      author: "최용범",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
      intro_author:
        "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
      intro_book:
        "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "콕북출판",
      title: "하룻밤에 읽는 한국사",
    },
    _id: "6073c62ce46f627b2516ebfa",
  },
  {
    book_info: {
      author: "이규현",
      bookcover: {
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/16181893713344.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/16181893713344.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      indexes:
        "프롤로그-즐거운 미술경매 미술경매 기초지식 미술경매의 현장들 역사에 남은, 역사에 남을 컬렉터들 역사에 남은, 역사에 남을 딜러들 경매의 스타 작가들에게는 다 이유가 있다 컬렉터 되어 보기",
      intro_author:
        "저자 - 이규현 전 조선일보 문화부 미술담당 기자로 서울디지털대학교 초빙교수(아트비즈니스 전공), 연세대, 중앙대 교양미술 강사활동을 했다. 연세대 국문학과 졸업했고, 중앙대 예술대학원 박물관미술관학과에서 미술이론 전공으로 석사학위 받았다. 그는 뉴욕 크리스티 경매회사에 있는 대학원 과정인 크리스티 에듀케이션(Christie’s Education)에서 Advanced Certificate 과정을 졸업했다. 미술경매의 전문가인 그는 자신이 정말 좋아하는 작품을 손에 넣게 된 미술애호가들의 그 행복한 순간들을 목격하고 기록한 것이다. 미술경매 취재를 시작하면서, 아니, 일간지 기자가 경매장까지 취재를 오다니...라는 말을 듣곤 했다고 한다.  그의 저서로는 『그림쇼핑』이 있고, 논문으로는 「신문 미술기사의 특성과 시대별 기능변화 연구-해방 이후 한국종합일간지를 중심으로」가 있다.",
      intro_book:
        "미술품 경매가 투자수단으로 각광 받고 있는 현 시점에서, 조선일보 미술담당 기자이자 세계 2대 경매회사 중 하나인 크리스티에서 대학원 과정을 졸업하기도 한 저자가 이 책을 통해 미술경매에 필요한 필수지식을 전한다. 하지만 저자는 여기서 그치지 않고, 역사에 기록될 유명 아트딜러들과 컬렉터들의 이야기를 함께 소개함으로써 단지 재테크에만 목적을 두는 것이 아닌 미술을 즐길 줄 아는 진정한 컬렉터가 되는 길로 독자들을 안내하고 있다.",
      original_book_id: "",
      price: 11760,
      promotion: {
        gap: "undefined",
        name: "",
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
      },
      publisher: "살림 출판",
      title: "미술이야기",
    },
    _id: "60739c45ad7ba776d9cd73d1",
  },
];

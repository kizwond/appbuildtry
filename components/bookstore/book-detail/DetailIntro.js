import styled from "styled-components";
import { useState } from "react";
import DetailIntroContentBookIntro from "./DetailIntroContentBookIntro";
import DetailIntroContentIndex from "./DetailIntroContentIndex";
import DetailIntroContentAuthorIntro from "./DetailIntroContentAuthorIntro";

const DetailIntro = () => {
  const [active, setActive] = useState(1);

  const NodeFromIntroBook = details.book_info.intro_book.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });
  const NodeFromIndex = details.book_info.indexes.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });
  const NodeFromIntroAuthor = details.book_info.intro_author.split("\n").map((line, i) => {
    return (
      <span key={i}>
        {line} <br />
      </span>
    );
  });

  let visible_content = null;
  if (active == 1) {
    visible_content = <DetailIntroContentBookIntro active={active} content_item={NodeFromIntroBook} />;
  }
  if (active == 2) {
    visible_content = <DetailIntroContentIndex active={active} content_item={NodeFromIndex} />;
  }
  if (active == 3) {
    visible_content = <DetailIntroContentAuthorIntro active={active} content_item={NodeFromIntroAuthor} />;
  }

  return (
    <DetailIntroWrap>
      <TabBar>
        <ul>
          <li>
            <a
              className={active == 1 ? "active" : "inactive"}
              onClick={() => {
                setActive(1);
              }}
            >
              책 소개
            </a>
          </li>
          <li>
            <a
              className={active == 2 ? "active" : "inactive"}
              onClick={() => {
                setActive(2);
              }}
            >
              목차
            </a>
          </li>
          <li>
            <a
              className={active == 3 ? "active" : "inactive"}
              onClick={() => {
                setActive(3);
              }}
            >
              출판사 서평
            </a>
          </li>
        </ul>
      </TabBar>
      {visible_content}
    </DetailIntroWrap>
  );
};

export default DetailIntro;

const DetailIntroWrap = styled.div`
  border-top: 1px solid #e6e8eb;
`;

const TabBar = styled.div`
  font-size: 14px;

  & ul {
    padding: 0;
    margin: 0;
    display: table;
    width: 100%;
  }
  & ul li {
    display: table-cell;
    width: 25%;
    vertical-align: top;
  }
  & ul li a {
    display: block;
    height: 40px;
    line-height: 40px;
    background: #f7fafc;
    border-left: 1px solid #e6e8eb;
    border-bottom: 1px solid #e6e8eb;
    text-align: center;
    color: #303538;
    font-size: 15px;
  }
  & ul li:first-child a {
    border-left: none;
  }

  & ul li .active {
    border-bottom: none;
    background: white;
    font-weight: 700;
  }
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
      "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”\n 방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서.\n 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다.\n 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다.\n 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
    intro_author:
      "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다.\n 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
    indexes:
      "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9\n 1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? \n 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? \n 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 ",
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

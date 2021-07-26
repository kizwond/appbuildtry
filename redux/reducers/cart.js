export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "cart/ADD_ITEM_IN_CART":
      return [...state, action.data];
    case "cart/DELETE_ITEM_IN_CART":
      return state.filter((item) => action._id !== item._id);

    default:
      return state;
  }
}

const initialState = [
  {
    book_info: {
      bookcover: {
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/16181893713344.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/16181893713344.png",
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/16181893713344.png",
      },
      promotion: {
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
        name: "",
        gap: "1000",
      },
      category: ["middleschool", "highschool", "worker"],
      hashtag: [],
      title: "미술이야기",
      author: "이규현",
      publisher: "살림 출판",
      intro_book:
        "미술품 경매가 투자수단으로 각광 받고 있는 현 시점에서, 조선일보 미술담당 기자이자 세계 2대 경매회사 중 하나인 크리스티에서 대학원 과정을 졸업하기도 한 저자가 이 책을 통해 미술경매에 필요한 필수지식을 전한다. 하지만 저자는 여기서 그치지 않고, 역사에 기록될 유명 아트딜러들과 컬렉터들의 이야기를 함께 소개함으로써 단지 재테크에만 목적을 두는 것이 아닌 미술을 즐길 줄 아는 진정한 컬렉터가 되는 길로 독자들을 안내하고 있다.",
      intro_author:
        '저자 - 이규현 전 조선일보 문화부 미술담당 기자로 서울디지털대학교 초빙교수(아트비즈니스 전공), 연세대, 중앙대 교양미술 강사활동을 했다. 연세대 국문학과 졸업했고, 중앙대 예술대학원 박물관미술관학과에서 미술이론 전공으로 석사학위 받았다. 그는 뉴욕 크리스티 경매회사에 있는 대학원 과정인 크리스티 에듀케이션(Christie’s Education)에서 Advanced Certificate 과정을 졸업했다. 미술경매의 전문가인 그는 자신이 정말 좋아하는 작품을 손에 넣게 된 미술애호가들의 그 행복한 순간들을 목격하고 기록한 것이다. 미술경매 취재를 시작하면서, "아니, 일간지 기자가 경매장까지 취재를 오다니..."라는 말을 듣곤 했다고 한다.  그의 저서로는 『그림쇼핑』이 있고, 논문으로는 「신문 미술기사의 특성과 시대별 기능변화 연구-해방 이후 한국종합일간지를 중심으로」가 있다.',
      indexes:
        "프롤로그-즐거운 미술경매 미술경매 기초지식 미술경매의 현장들 역사에 남은, 역사에 남을 컬렉터들 역사에 남은, 역사에 남을 딜러들 경매의 스타 작가들에게는 다 이유가 있다 컬렉터 되어 보기",
      price: 5000,
      original_book_id: "",
    },
    _id: "60739c45ad7ba776d9cd73d1",
  },
  {
    book_info: {
      bookcover: {
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618189789343xxlarge.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618189789343xxlarge.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618189789343xxlarge.png",
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618189789343xxlarge.png",
      },
      promotion: {
        period: {
          from: "2021-04-07T00:00:00.000Z",
          to: "2021-05-05T00:00:00.000Z",
        },
        name: "봄맞이이벤트",
        gap: "undefined",
      },
      category: ["worker", "english"],
      hashtag: ["한국사", "한국사능력검정시험", "1위", "김선", "공무원시험", "소설", "쉬어가는 시간", "잔잔한 이야기", "삶"],
      title: "흐르는 강물처럼 오르는 연어",
      author: "김현진",
      publisher: "프시케의숲",
      intro_book:
        "하지현 정신과 전문의 추천 우울함을 폴짝 뛰어넘는 웃음과 인연들  다른 이들에게 큰 웃음을 주는 사람이 실은 마음의 병을 앓고 있다고 할 때, 우리는 깜짝 놀라곤 한다. 너무 뜻밖이기 때문이다. 하지만 마음의 병은 누구에게나 찾아올 수 있다. 아니, 어쩌면 마음이 아픈 사람일수록 그의 회색빛 세상에서 치열하게 웃음을 찾고 있는 것일지도 모르겠다.  김현진 작가는 그간 웃음을 자아내는 수작 에세이를 다수 써왔다. 하지만 작가는 이 책에서 자신이 오랫동안 우울증과 불면에 시달려왔음을 진솔하게 고백한다. 폭식이나, 심하면 손목을 그어 자신을 망가뜨리기도 했다. 그녀는 자신의 아픈 경험을 담담하게 서술하는 한편, 이런 삶을 꿋꿋이 통과하게 해준 것이 결국은 ‘웃음’이라는 듯 다시 한 번 독자들을 크게 웃게 만든다. 회사나 알바 일터에서 겪은 황당한 일은 물론 어릴 적 학대 경험마저 작가는 농담으로 승화시킨다. 또한 흐뭇한 미소를 짓게 하는 따뜻한 사람들과의 일화를 소개하며 웃음의 다양한 결을 펼쳐 보인다. 이 책에서 작가는 “삶이 구차하고 남루할수록 농담은 힘이 세다”는 것을 모자람 없이 보여준다.  “깊은 우울의 늪에 빠진다 해도 유머와 낙관을 놓치지만 않는다면, 세상은 살아갈 만한 곳이 된다는 걸 깨닫게 해준다.” _하지현 (정신건강의학과 전문의)  경기도 우수출판물 제작지원 사업, 문학 1등작  만약 한국에 웃기는 에세이를 위한 상이 있었다면, 김현진 작가가 여러 차례 수상자가 되었을 거예요. 그만큼 유머러스하고 글에 잔재미가 있는 작가예요. 그런데 이 책의 주요 키워드는 뜻밖에도 ‘우울증’ ‘가정폭력’ 등이랍니다. 무슨 일일까요?  사실 작가는 그동안 극단적인 시도를 여러 차례 할 정도로 우울증과 불면증이 깊었다고 해요. 정말 오랜 기간 고생했고, 지금은 많이 나아졌지만 여전히 통원 치료를 하고 있죠. 이 책은 그런 그녀가 어떤 삶을 살고, 어떻게 이를 극복해나갔는지 진솔하게 들려줍니다.  아, 물론 작가 특유의 유머러스한 톤은 여전해요. 때론 진지하지만, 그마저도 어느 순간 사람을 풋, 웃어버리게 만들죠. 부모님에게 맞고, 어린 시절에 상처를 받고, 또 우울증으로 고생하고, 자신의 몸을 방치하다시피 하는 등, 참 힘든 상황들이 많이 나와요. 그런데 신기하게도 이런 이야기들이 작가 특유의 유머러스함으로 유쾌함을 자아냅니다.  책을 읽다 보면 갑자기 눈물이 찔끔 나오기도 해요. 힘든 상황 속에서 만난 다정한 사람들에 관한 이야기들이 그렇고요. 또 자기 자신을 용기 있게 자각해나가는 이야기들이 그렇죠. 감동으로 먹먹해지는 대목들을 분명 발견하실 수 있을 거예요. 웃거나 울컥하다 보면, 어느새 독자 분들의 마음도 조금은 말랑말랑해져 있지 않을까 싶어요.  “나를 조금만 더 사랑하길 간절히 바라는 독자라면 김현진의 글이 고마울 수밖에 없다.” _노지양 (번역가)  이 책은 모두 4부로 이루어져 있어요. 1부에서는 작가의 심각한 자해 사건으로부터 시작해요. 결국 작가는 정신병동에 입원하게 되는데, 의사로부터 우울증 진단을 받죠. 그 후 몇 년간 우울증과 불면증, 대인기피증, 비만 등으로 고통을 겪은 이야기들이 펼쳐집니다. 작가는 이를 이겨내기 위해 어떤 노력들을 했는지 담담하게 풀어냅니다. 마음의 병을 앓는 사람, 그리고 그런 사람들을 대하는 이들에게 도움이 될 만한 내용들이 담겨 있어요.  2부에서는 분위기가 확 바뀌어요. 작가가 회사와 알바 일터에서 겪은, 폭소를 자아내는 일화들이 소개됩니다. 게임회사, 카페 등에서 일하면서 만난 사람과 사건들이 재미있게 그려져요. 작가는 때로는 신랄하게, 때로는 따뜻하게 삶의 왁자지껄한 모습들을 바라봅니다. 아무리 힘들어도 늘 웃을 일은 있으며, “삶이 구차하고 남루할수록 농담은 힘이 세다”고 말하는 듯해요.  3부는 아버지와의 관계를 중심으로 이야기가 펼쳐집니다. 작가의 정신적 고통은 무엇보다 뇌와 심리의 문제에서 기인했지만, 불행한 가정환경도 무시할 수 없었거든요. 일단 부모로부터 어린 시절 심각한 학대와 폭력을 당했고요. 작가는 매우 솔직하게 어린 시절에 입은 상처들을 풀어놓습니다. 암담한 상황에서도 따뜻하고 유머러스한 작가의 태도가 반짝반짝 빛납니다.  4부는 작가가 살면서 만난 ‘좋은 관계’에 대해 다뤄요. 아무런 이해관계가 없음에도 불구하고 상냥하게 선의를 베푼 사람들, 독자 분들도 그런 사람 몇 번쯤은 마주친 적 있지 않나요? 작가는 흐뭇한 미소를 짓게 하는 그런 따뜻한 사람들과의 일화를 펼쳐 보입니다. 어쩌면 작가는 행간에서 이렇게 조용히 말하고 있는지도 모르겠어요. ‘좋은 관계가 저를 살렸습니다. 고맙습니다.’  * 추천글 만일 빨간머리 앤이 크리스마스 선물을 주지 않으려 산타클로스 같은 건 없다고 선언한 경상도 출신 목사 딸로 태어난다면 김현진 작가같이 자라나지 않았을까? 어떻게 저런 일을 겪었을까 싶게 가난과 구타 속에 자랐고, 어른이 된 다음에도 힘든 일의 연속이었다. 그럼에도 김현진 작가는 유머와 낙관을 잃지 않는다. 억울하고 황당한 일을 겪거나 불합리한 일에 화가 폭발할 상황에도 시무룩해하며 받아들이거나, 특유의 궁시렁거림만은 놓치지 않는다. 미주알고주알 세밀하게 궁시렁거리고 불평은 하되 그녀를 힘들게 한 사람들에게 저주를 퍼붓거나 운명을 한탄하지 않는다. 깊은 우울의 늪에 빠진다 해도 좋은 관계를 만난다면, 유머와 낙관과 궁시렁거림을 놓치지만 않는다면 세상은 살아갈 만한 곳이 된다는 걸 깨닫게 해준다. KTX를 타고 읽었다. 마스크 안에서 낄낄거리는 웃음이 솟아올라 주변에 민망할 정도였다. 웃을 일 별로 없는 시절에 뜻밖의 선물이 될 책이다. - 하지현 (건국대학교 의과대학 정신의학과 교수, 『대한민국 마음 보고서』 저자)  어쩌면 이런 작가가 있지? 도서관 검색창에서 ‘김현진’을 검색한 다음 비치된 책을 몽땅 빌리고 없는 책은 구입했다. 미안하지만 다른 사람의 불운과 일탈과 벌건 상처와 짠 눈물이 단비처럼 절실했던 시절이었다. 또 하나 내가 매료된 건 신랄하면서도 지적이고 대담하면서 섬세한, 그녀의 유창하고 탄력적인 한국어 문장이었다. 김현진의 모든 칼럼과 단행본을 빠짐없이 읽어온 골수팬으로서, 이 책은 작가 특유의 유머와 해학이 여전하지만 이전 책들과는 시선이 달라졌음을 느낀다. 자신과 적당한 거리를 두고 감정을 자제하면서 좌절과 회복의 여정을 더욱 정직하고 정확하게 묘사하려 안간힘을 쓴다. 그래야 일어날 수 있으니까. 세상 곳곳의 슬픔이 눈에 밟히고 사는 건 여전히 고단하지만 내일은 1미터라도 더 나아가길, 나를 조금만 더 사랑하길 간절히 바라는 독자라면 김현진의 글이 고마울 수밖에 없다. - 노지양 (《나쁜 페미니스트》 《헝거》 번역가)",
      intro_author:
        "한국예술종합학교에서 영화와 서사창작을 공부했다. 삶이 구차하고 남루할수록 농담은 힘이 세다고 믿는다. 〈한겨레〉 〈경향신문〉 〈조선일보〉 〈시사IN〉 등 여러 매체에 글을 실었고, 에세이 《네 멋대로 해라》 《뜨겁게 안녕》, 소설 《정아에 대해 말하자면》 등을 썼다. 줄곧 글 쓰는 삶을 살아왔고 계속 쓸 것이다.",
      indexes:
        "프롤로그  1부 우울과 불면 속에서 그 누구의 잘못도 아닌 베로나의 약제사 달리기 무거운 여자의 삶 여성의 몸은 함부로 삶에 대한 실감  2부 왜 사냐건 그냥 웃지요 심어 세일즈와 연애 거절의 극기 훈련 회사로부터의 추억 당신의 깨끗한 피 안 마셔욧 어떤 남자의 이메일  3부 아버지와 나 장례식 풍경 작별의 맛 수상한 실장 서러운 날의 꿈 크리스마스와 산타 그날의 생일케이크 어떤 대화 울 아빠는 말야 그렇게 어른이 되어간다  4부 나의 아름다운 사람들 부부의 세계 속으로 걱정 마, 우린 가족이야 니드 포 스피드 그 사람에게 잘해주세요 자기만의 방  나가는 말",
      price: 9100,
      original_book_id: "",
    },
    _id: "60739e56ad7ba776d9cd73d2",
  },
  {
    book_info: {
      bookcover: {
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618200069172onedayKoreanhistory.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618200069172onedayKoreanhistory.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618200069172onedayKoreanhistory.png",
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618200069172onedayKoreanhistory.png",
      },
      promotion: {
        period: {
          from: "1970-01-01T00:00:00.000Z",
          to: "1970-01-01T00:00:00.000Z",
        },
        name: "",
        gap: "undefined",
      },
      category: ["elementaryschool", "middleschool", "highschool", "worker"],
      hashtag: ["영어단어", "수능특강", "수능영어", "넥서스", "노노", "개발자", "디자이너", "인문학", "역사", "한국사", "한국사"],
      title: "하룻밤에 읽는 한국사",
      author: "최용범",
      publisher: "콕북출판",
      intro_book:
        "50만 독자가 선택한 한국사의 결정판 18년 연속 한국사 부문 베스트셀러 “과거를 직시하여 미래의 길을 찾는다!”  방대한 한국사를 한눈에 볼 수 있도록 구성한 역사서. 선사 시대부터 문재인 정부까지, 한국사의 흐름을 흥미로운 주제를 통해 간결하게 정리하였다. 각각의 주제들을 통해 전체적인 시대상을 아우르는 형식을 취하고 있다. 이해를 돕는 그림과 사진을 곁들여, 연도와 사건을 암기하는 대신 역사의 흐름을 자연스럽게 이해할 수 있도록 구성하였고, 역사 이해에 도움이 될 핵심 키워드를 간결하게 정리했다.",
      intro_author:
        "1968년 서울에서 태어나 성균관 대학교 동양철학과를 졸업하고, 같은 대학원에서 석사 과정을 마쳤다. 월간 『사회평론 길』에서 취재 기자로 일하다, 2000년 『월간중앙』에 「역사인물 가상 인터뷰」를 연재하면서 역사 작가의 길에 들어섰다. 50만 독자가 선택한 한국사의 결정판 『하룻밤에 읽는 한국사』 『하룻밤에 읽는 근현대사』(공저)를 비롯, 『역사 인물 인터뷰』 『하룻밤에 읽는 고려사』 『만약에 한국사』 『난세에 간신 춤춘다』 『대학문예운동의 이론과 실천』(공저) 『너희가 대학을 아느냐』(공저) 등 역사와 사회 전반에 관한 다수의 책을 집필했다.",
      indexes:
        "추천의 글 재미있으면서도 의미 있는 역사책 4 책머리에 한국사 서문 개정증보판 머리말을 대신해 7 들어가며 역사를 의심하면 역사가 보인다 9  1장 선사문화와 고대 국가 건설 _ 고조선의 성립과 삼국시대의 전개 훈족이 한반도 출신이라고? 19 그 많은 고인돌이 말해주는 것 22 단군신화, 어떻게 볼 것인가? 26 승리한 장군 모두 처형해버린 고조선-한 전쟁 30 삼국의 건국설화에 숨어 있는 세 가지 이야기 34 경제는 일류, 정치는 삼류였던 가야 40 광개토대왕은 어떻게 대제국을 건설할 수 있었을까? 44 한반도 역사를 바꾼 평양 천도 47 고대사 최대의 수출국 백제 51 고구려 삼국통일의 기회를 망친 운명적 수도이전 54 법흥왕대의 친위쿠데타, 이차돈 순교 58 왜 신라에만 여왕이 있었을까? 63 동북아시아 두 강국의 결전, 고구려-수나라 전쟁 66 의자왕의 향락 때문에 백제가 망했다? 70 연개소문 일가의 빛과 그림자 73 신라가 최후의 승자로 남은 이유 77 신라에 왔던 아랍인들 81  2장 통일신라와 발해 _ 삼국통일을 거쳐 남북국시대로 대조영, 고구려 계승을 선언하다 85 발해를 한국사에 포함시킬 수 있는가? 88 발해의 목줄이 달린 해외무역 92 원효가 해골에서 본 것은? 95 호족 세력의 불교, 선종 98 장보고는 청해진에서 무엇을 꿈꾸었나? 102 골품제 사회 6두품 지식인의 좌절 106 효녀 지은설화에서 통일신라의 붕괴를 본다 110 궁예가 몰락한 진짜 이유 113 통일전쟁 승리 직전에 패배한 견훤 116 왕건의 쿠데타는 계획적이었다 119 고대사 최초의 사회복지제도 진대법과 을파소 123 연을 이용한 상징조작으로 내란을 진압한 김유신 124 매춘녀가 없었던 발해 125  3장 고려시대 _ 후삼국 통일에서 위화도 회군까지 왕건, 혈연네트워크로 후삼국을 다스리다 129 「훈요 10조」, 전라도 사람은 절대 기용하지 말라고? 133 본관제는 고려에서 시작됐다 137 천하의 중심은 고려다 140 ‘광종의 개혁’ 절반의 고시, 과거제의 도입 143 전시과 도입, 정권의 성격이 경제제도도 결정한다 147 너무나도 판박이인 왕비들의 꿈 150 대 거란 전쟁 제1라운드, 외교전에서 완승을 거둔 서희 155 대 거란 전쟁 제2라운드, 군사력의 승리 158 최고 권력자 이자겸의 반란 161 ‘묘청의 난’ 자주적 민족 운동인가, 불만 세력의 반란인가? 164 고려청자 아름다움의 비밀 167 금속활자, ‘세계 최초’란 딱지가 부끄러운 보물 170 한국이 코리아로 불리게 된 이유 173 사대주의냐, 냉엄한 춘추필법이냐? 『삼국사기』와 『삼국유사』 177 무신정권, 군사쿠데타로 정권을 잡았지만 181 우리나라 최초의 천민해방운동, 만적의 난 185 대몽 항쟁기의 거대 프로젝트, 팔만대장경 188 반외세 항쟁이냐, 수구세력의 마지막 저항이냐? 192 어디서 감히 첩 제도 운운하나 197 친일파가 있었듯 부원파도 있었다 201 공민왕의 개혁, 신돈은 요승이었나? 205 열 개의 목화씨로 남은 사나이, 문익점 210 끝을 모르는 권문세족의 탐욕 214 거북선의 원형, 고려 군선 218 송나라 대시인 소동파가 고려와의 무역을 반대했던 이유 219  4장 조선시대 _ 근세의 태평시대를 거쳐 민중반란까지 500년 조선왕조를 연 요동 정벌군의 회군 223 역성혁명의 기획자, 정도전 227 고려 말 권문세족의 토지문서를 불태우다 231 정말 신문고만 치면 됐나? 234 세종대왕, 그토록 조화로운 인간에게 불행의 그림자가 238 15세기 세계 최고 수준의 자동시계 242 한글을 만든 진짜 이유 세 가지 246 세조의 쿠데타 ‘왕권 강화냐, 명분 없는 권력욕이냐?’ 250 속치마 폭까지 규정한 조선 최고의 법전 경국대전 254 조선의 네로 황제 연산군의 최후, 중종반정 257 조광조, 어느 깐깐한 개혁주의자의 죽음 261 누가, 왜, 무엇 때문에 싸웠는가? 265 임진왜란은 무역 전쟁이었다! 269 불패의 게릴라 부대, 의병 272 이순신이 넬슨보다 위대한 이유 275 세계로 수출된 지식상품, 『동의보감』 279 광해군, 조선시대 최고의 외교정책가 283 인조반정, 성공한 쿠데타는 역사도 처벌 못한다? 287 병자호란, 그날 인조는 무슨 생각을 했을까 289 소현세자 독살설의 진상 292 영조, 정쟁의 한복판에서 중흥 시대를 열다 296 정조가 수원에 열두 번 간 까닭은 301 조선에도 장사로 큰돈을 번 여자가 있었다 305 전봉준은 정말 정약용의 개혁론을 만났을까? 308 검찰이 구속한 신윤복의 춘화 312 세도정치, 2만 냥 주고 고을 수령을 산다? 317 용병을 고용한 평안도 농민전쟁 320 〈대동여지도〉, 김정호는 정말 옥사했는가? 325 세도가의 가랑이 사이를 기어나간 흥선대원군 330 조선시대 이혼 이야기 334 봉급 한 푼 없었던 조선시대의 향리 335  5장 근대의 전개와 현대사회의 성립_제국주의 침략에서 민주국가 수립까지 자주적 근대화의 발목을 잡은 병인양요와 신미양요 339 강화도조약, 새끼 제국주의 국가 일본에 일격을 당하다 343 임오군란 후 외국군이 주둔하다 347 노터치No-Touch가 노다지의 어원이라니! 351 김옥균의 삼일천하, 갑신정변 355 동학의 창시와 농민혁명의 전개 359 녹두장군 전봉준의 꿈 363 이완용이 독립협회의 초대위원장이었다 368 평민에게 넘어간 의병투쟁의 지도권 372 을사조약, 불법조약 체결을 강요하다니! 375 3·1운동, ‘동방의 등불’이 된 코리아 ! 378 ‘대한민국임시정부’ 신채호, 이승만에게 일갈하다 383 홍범도, 봉오동·청산리전투를 승리로 이끌다 387 일제와의 야합 속에 진행된 예비 친일파의 자치운동 390 일제하 최대 규모의 독립운동조직, 신간회 394 김일성은 가짜였다? 398 잔혹한 수탈과 억압을 자행한 일제 401 아직도 청산되지 않은 반역의 역사, 친일파 문제 404 8·15해방과 건국준비위원회, 반쪽짜리 독립 411 찬탁은 재식민화의 길이었나? 414 식민잔재 청산, 그 통한의 좌절 418 비전쟁기간에 일어난 최대의 학살극, 4 ·3항쟁 422 남침이냐, 북침이냐? 425 한국 민중, 최초의 승리를 거두다 ·‘419혁명’ 428 박정희 개발독재의 빛과 그림자 428 광주민주화항쟁에서 촛불항쟁까지 431  참고문헌 435",
      price: 11760,
      original_book_id: "",
    },
    _id: "6073c62ce46f627b2516ebfa",
  },
  {
    book_info: {
      bookcover: {
        url_original: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/original/1618190225524business.png",
        url_small: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/small/1618190225524business.png",
        url_medium: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/medium/1618190225524business.png",
        url_large: "https://bookcoverofcogbook.s3.ap-northeast-2.amazonaws.com/large/1618190225524business.png",
      },
      promotion: {
        period: {
          from: "2021-04-07T00:00:00.000Z",
          to: "2021-05-05T00:00:00.000Z",
        },
        name: "봄맞이이벤트",
        gap: "1500",
      },
      category: ["worker", "coding"],
      hashtag: [],
      title: "한 권으로 읽는 비지니스 명저 100",
      author: "김민주, 구자룡 외 5명",
      publisher: "좋은습관연구소 출판",
      intro_book:
        "위기를 극복하는 지혜를 얻다!! 이 책은 지난 2000년부터 지금까지, 최근 20년 동안 국내에 출간된 경제경영서 중 우리 사회에 큰 파장을 주었거나 지금 다시 읽어도 그 의미가 각별하다고 판단되는 도서 100권을 선정하고 리뷰한 서평집입니다. 경영 컨설턴트부터 경영학과 교수, 비즈니스 코치 그리고 전현직 CEO 등 총 7분의 비즈니스 전문가가 참여했습니다. 혁신 전략, 미래 전략, 마케팅 전략, CEO와 리더십, 성공과 행복, 행동과 심리, 경제, 인문 사회, 정치 사회 등으로 책을 분류하고 몇 차례 토론 끝에 총 100권을 엄선했습니다. 이 책들은 지금 다시 읽어도 그 의미가 퇴색되지 않는 경영학의 고전들입니다. 변화무쌍하고 위기가 난무하는 세상, 무엇이 본질이고 무엇이 지켜야 할 가치인지, 다시 한번 점검해볼 수 있는 지혜를 제공해주는 책입니다.  이런 분들에게 추천합니다.  1) 책 읽을 시간이 없어서 짧게 핵심만 통찰하고 싶은 분들 2) 책을 읽긴 했지만, 머릿속에 정리가 안 돼, 기억으로 남는 게 없는 분들 3) 비즈니스 전문가로부터 압축된 식견을 얻고 싶은 분들 4) 어떤 책을 읽으면 좋을지 가이드를 얻고 싶은 분들 5) 경영학 서적을 잘 읽는 법과 이를 내 사업에 적용하는 방법을 알고 싶은 분들  총 7분의 비즈니스 전문가들이 모였다.  이들은 모두 현직 시절 최고의 위치에까지 오른 분들이다. 지금은 컨설턴트로 코치로 활동하며 후배 비즈니스 맨들을 돕고 있다. 이들이 뽑은 비즈니스 명저 100권이 있다. 이 책들은 지난 20년 동안 우리 사회를 뜨겁게 달궜던 책이고, 수많은 분들로부터 격찬을 받은 책이다. 그리고 내용의 독창성과 충실성에도 불구하고 대중성이 약해 주목을 받지 못한 책도 있다.  철 지난 도서라고 생각한다면 대단한 오해!  이미 읽은 책이고, 다 아는 것 같다고? 상당수가 읽었던 책들이고, 지금 다시 본다는 게 너무 뻔하지 않을까 하는 생각을 했다. 하지만 서평을 하나씩 읽어가다 보면 그 생각이 틀렸음을 확인할 수 있었다. 명저란 시대에 따라 달리 해석될 수 있고, 주목할 포인트는 새롭게 정의된다는 사실을 다시금 실감하게 된다.  다시 읽고 다시 정리했다.  4차 산업 혁명에서부터 코로나까지 수많은 우여곡절이 지금의 비즈니스 현장이다. 그럼에도 불구하고 비즈니스의 기본은 쉽게 바뀌지 않는다. 여기 책들은 바로 그 속에서 살아남은 비즈니스의 본질과 같은 책이다. 감히 말씀드리자면 여기 100권은 독자들을 성공으로 이끄는 씨앗 역할을 할 것이다.  이 책을 편집하다가 재미있는 한 가지를 발견했다.  100권의 책, 100개의 생각. 각 권이 모두 다른 책이지만 신기하게도 대가들이 말하는 것에는 일맥상통하는 무엇이 있다. 그것은 바로 성공에 관한 진리, 행복에 관한 진리 같은 것들이다. 수많은 경영자 그리고 학자들이 밝혀낸 정석 같은 그 무엇. 그것이 무엇인지 독자들이 직접 읽고 찾아보면 좋겠다.",
      intro_author:
        "김민주 서울대학교와 미국 시카고대학교에서 경제학을 전공하였고 한국은행, SK그룹을 거쳐 경영컨설팅사 리드앤리더 대표로 있다. 금융, 기업, 비즈니스 경험을 바탕으로 역사, 문화, 경제 분야를 아우르는 폴리매스(Polymath, 박식가)로 활동하고 있다. 세계 문학 독서 클럽을 운영하고 있으며 걷기 여행을 즐긴다. 저서로는 『경제법칙 101』 『하인리히 법칙』 『자본주의 이야기』 『시티노믹스』 『트렌드로 읽는 세계사』 『다크 투어』 『북유럽 이야기』 『나는 도서관에서 교양을 읽는다』 등이 있다. 번역서로는 『노벨경제학 강의』 『클라우스 슈밥의 제4차 산업혁명』 『깨진 유리창 법칙』 『지식경제학 미스터리』가 있다.  구자룡 현재 밸류바인 대표 컨설턴트. 상명대학교에서 경영학 박사학위를 받았다. 칼슨마케팅그룹코리아 마케팅전략실장, 한국능률협회 상임교수, 상명대학교 겸임교수, 서울브랜드위원회 위원 등을 역임했다. 현대자동차, 삼성전자, 코레일, 한샘, 한일시멘트, JDC공항면세점 등 주요 기업 대상으로 마케팅과 브랜딩 컨설팅을 했다. 국가공무원 인재개발원, 한국생산성본부, 한국금융연수원, 멀티캠퍼스, 한국야쿠르트, 상명대학교 등에서 강의하고 있다. 저서로는 『데이터를 다루는 습관을 길러라』 『지금 당장 마케팅 공부하라』 『마케팅 리서치』 『경영의 최전선을 가다』 『한국형 포지셔닝』 등이 있다.  한근태 한스컨설팅 대표. 서울대학교 섬유공학과를 졸업하고 미국 애크런 대학교에서 고분자 공학 박사 학위를 받았다. 39세에 대우자동차 최연소 이사로 임명돼 화제가 되기도 했다. 40대 초반 사직서를 제출하고 IBS 컨설팅 그룹에 입사, 경영 컨설턴트의 길을 걷기 시작했다. 오랫동안 삼성경제연구소 SERI CEO의 북리뷰 칼럼을 쓰고 있으며 그 외 《DBR》과 《머니 투데이》 등에 고정 서평과 칼럼을 연재하고 있다. 주요 저서로는 『한근태의 재정의 사전』 『한근태의 독서일기』 『누가 미래를 주도하는가』 『고수와의 대화, 생산성을 말하다』 『일생에 한번은 고수를 만나라』 『잠들기 전 10분이 나의 내일을 결정한다』 『경영의 최전선을 가다』 등이 있다.  고현숙 한국의 대표적인 경영자 코치. 리더십과 코칭 분야 전문가로 현재 국민대 경영학과 교수로 재직중이다. 서울대학교 소비자아동 학과를 졸업하고 헬싱키경제대학교에서 MBA를 서울과학종합대학원에서 경영학 박사학위를 취득했다. 한국의 CEO와 임원들이 ‘가장 조언을 듣고 싶어 하는 코치’로 날카로운 통찰력과 따뜻한 지지를 겸비한 코칭 스타일로 유명하다. 삼성, 현대자동차, 포스코, 아모레퍼시픽 등 대기업과 듀폰, 화이자, 세계 은행 등 글로벌 기업 및 기관의 고위 리더를 코칭했다. 저서로는 『결정적 순간의 리더십』 『유쾌하게 자극하라』 『티칭하지 말고 코칭하라』 『최고의 조직을 만드는 집단지성의 힘, 그룹 코칭』(공저) 등이 있다.   허보희 서울대학교 경제학과 학사, 미국 스탠퍼드 대학교 MBA, 전 가이저 사장, 쉐퍼드멀린 미국 로펌 고문, 뱅크오브아메리카 본부장/전무(미국 본사 근무 4년)로 근무했다. 한국 최초로 미국계 투자 은행의 여성 임원이 되면서 유리 천장을 깼다는 평가를 받으며 화제가 되었다. 현재는 교보악사자산운용의 사외 이사, 쿼드자산운용의 비상임 감사로 있으며 코칭 경영원의 경영자 코치로 임원 코칭 활동을 활발히 하고 있다.  홍재화 중앙대 무역학과를 졸업하고 대한무역진흥공사(KOTRA)에 다니다가 무역 회사를 설립, 운영하고 있다. 대학시절부터 지금까지 35년 가까이 무역 분야에서만 일하고 있다. 저서로 『박람회와 마케팅』 『무역&오퍼상 무작정 따라하기』 『결국 사장이 문제다』 『해외무역 첫걸음 당신도 수출 쉽게 할 수 있다』 『글로벌 시장은 어떻게 움직이는가?』 등이 있다.  이엽 미국 위스콘신대학교 매디슨에서 경제학과 국제 관계학, 아시아학을 전공했다. 졸업 후 공군 통역 장교로 입대해 군복무를 마쳤고, 한국금융연구원에서 연구원으로 근무한 뒤 조선비즈에서 근무했고, 현재는 한국 딜로이트 그룹에서 근무하고 있다. 옮긴 책으로 『창조적 학습사회』 『마켓4.0 시대 이기는 마케팅』 『성장의 문화』가 있다.",
      indexes:
        "경제경영서 읽는 습관  김민주의 경제경영서 읽는 습관 구자룡의 경제경영서 읽는 습관 한근태의 경제경영서 읽는 습관 고현숙의 경제경영서 읽는 습관 허보희의 경제경영서 읽는 습관 홍재화의 경제경영서 읽는 습관 이엽의 경제경영서 읽는 습관  1부. 혁신 전략  1. 좋은 기업을 넘어 위대한 기업으로 2. 디테일의 힘 3. 깨진 유리창 법칙 4. 히든 챔피언 5. 디퍼런트 6. 린스타트업 7. 당신은 전략가입니까 8. 제로투원 9. 돈, 착하게 벌 수는 없는가 10. 지적자본론 11. 생산성 12. 축적의 길 13. 블루오션 시프트 14. 파괴적 혁신 4.0 15. 디커플링  2부. 마케팅 전략  16. 판매의 심리학 17. STICK 스틱! 18. 트렌드 코리아 19. 모든 비즈니스는 브랜딩이다 20. 프레임 21. 필립 코틀러의 마켓 4.0 22. 뇌, 욕망의 비밀을 풀다 23. 진정성 마케팅  3부. 미래 전략  24. 롱테일 경제학 25. 트렌드를 읽는 기술 26. 뉴 노멀 27. 클라우스 슈밥의 제4차 산업 혁명 28. 일의 미래 29. 기하급수 시대가 온다 30. 모두 거짓말을 한다 31. 머신 플랫폼 크라우드 32. 신뢰 이동 33. 포노 사피엔스 34. 직장이 없는 시대가 온다 35. 구독과 좋아요의 경제학  4부. CEO와 리더십  36. 사장으로 산다는 것 37. 스티브 잡스 38. 린 인 Lean In 39. 나와 마주서는 용기 40. 워런 버핏과의 점심 식사 41. 사람을 남겨라 42. 슈독 43. 위대한 나의 발견 강점혁명 44. 히트 리프레시 45. 결정적 순간의 리더십 46. 초격차 47. 멀티플라이어  5부. 성공과 행복  48. WHO 후 49. 왜 일하는가? 50. 창의성의 발견 51. 삶의 정도 52. 너의 내면을 검색하라 53. 나는 왜 이 일을 하는가? 54. 관찰의 힘 55. 브리프 56. 1만 시간의 재발견 57. 오리지널스 58. 딥워크 59. 순간의 힘 60. 평균의 종말 61. 관점을 디자인하라 62. 그릿 63. 아웃라이어  6부. 행동과 심리  64. 몰입 Flow 65. 생각의 탄생 66. 넛지 67. 긍정심리학 68. 통찰, 평범에서 비범으로 69. 마인드셋 70. 생각에 관한 생각  7부. 경제  71. 나쁜 사마리아인들 72. THE BOX 더 박스 73. 화폐 전쟁 74. 죽은 경제학자의 살아있는 아이디어 75. 도시의 승리 76. 폴트라인 77. 안티프래질 78. 빚으로 지은 집 79. 21세기 자본 80. 불황의 경제학 81. 정해진 미래  8부. 인문 사회  82. 경주 최부잣집 300년 부의 비밀 83. 88만원 세대 84. 냉정한 이타주의자 85. 가난한 사람이 더 합리적이다 86. 돈으로 살 수 없는 것들 87. 유대인 이야기 88. 사피엔스 89. 이것이 모든 것을 바꾼다 90. 미래는 누구의 것인가 91. 기후 카지노 92. 수축사회 93. 스킨 인 더 게임 94. 팩트풀니스  9부. 정치 사회  95. 유러피언 드림 96. 왜 국가는 실패하는가 97. 미국의 세기는 끝났는가 98. 아시아의 힘 99. 패권의 비밀 100. 예정된 전쟁  부록 부록1. 노벨 경제학상 수상자와 그들의 책 부록2. 싱커스50 재단이 선정한 경영 사상가 부록3. 빌게이츠 선정 올해의 책",
      price: 19800,
      original_book_id: "",
    },
    _id: "6073a01cad7ba776d9cd73d3",
  },
];

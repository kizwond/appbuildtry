/* eslint-disable react/no-unescaped-entities */
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import Head from "next/head";
import { useMemo, useState } from "react";

import M_Layout from "../../../components/layout/M_Layout";

const Faq = () => {
  const [openedContentId, setOpenedContentId] = useState("");
  const content = useMemo(() => {
    return [
      {
        id: "1",
        title: "읽어주기 기능이 작동하지 않습니다.",
        description:
          "읽어주기' 기능은 브라우저에서 제공하는 기능을 기반으로 작동합니다. 사용하고 계시는 브라우저가 TTS 기능을 제공하지 않는 경우, 다른 브라우저를 사용해보시길 권해드립니다. 가령 '네이버' 앱으로 cogbook 사이트에 들어오신 경우, '읽어주기' 기능이 정상적으로 작동하지 않습니다.",
      },
      {
        id: "2",
        title: "크롬 브라우저 사용 시, 브라우저가 콕북의 메뉴를 가립니다.",
        description: (
          <>
            <div>
              크롬 브라우저에서는 화면을 길게 누르면 Touch To Search가
              실행되도록 되어있는데요. 이 기능을 꺼주셔야 합니다.
            </div>
            <div>1. 우측 상단의 점 3개 버튼 클릭</div>
            <div>2. 설정(Settings) 클릭</div>
            <div>3. Google 서비스 클릭</div>
            <div>4. 터치하여 검색(Touch To Search) 클릭</div>
            <div>5. 사용 안함 선택</div>
          </>
        ),
      },
      {
        id: "3",
        title: "학습 기록을 리셋하고 싶습니다.",
        description: (
          <>
            <div>
              학습을 하다보면 나의 학습 기록을 초기화하고 싶은 경우가 있습니다.
              이 경우, 학습 기록을 리셋할 수 있습니다.
            </div>
            <div>1. 마이북에서 해당 책 우측 끝의 꺽쇠 두 개 클릭</div>
            <div>2. 생성된 메뉴 중 우측 끝 설정(톱니 모양) 버튼 클릭</div>
            <div>3. 학습 상태 관리 메뉴 클릭</div>
            <div>4. '초기화 적용' 클릭</div>
            <div>
              이 경우, 해당 책의 학습 이력 모두 삭제되니 신중하게 선택하시기
              바랍니다.
            </div>
          </>
        ),
      },
    ];
  }, []);
  return (
    <>
      <Head>
        <title>FAQ - Cogbook</title>
      </Head>
      <M_Layout>
        <div className="relative top-[40px] h-[calc(100vh_-_60px)] overflow-auto px-[8px] flex flex-col gap-3 ">
          <div className="flex items-center justify-center py-12 text-5xl font-bold">
            FAQ
          </div>
          <div>
            <div className="py-2 text-[18px] font-bold ">자주 묻는 질문</div>
            <div>
              {content.map(({ title, description, id }) => (
                <div
                  key={id}
                  className="p-2 border-b border-b-gray-200 first-of-type:border-t first-of-type:border-t-gray-200"
                >
                  <div
                    className="flex justify-between"
                    onClick={() => {
                      if (openedContentId === id) {
                        setOpenedContentId("");
                      } else {
                        setOpenedContentId(id);
                      }
                    }}
                  >
                    <div className="text-[16px] font-medium">{title}</div>
                    <div className="min-w-[40px] flex justify-center pt-[5px] text-gray-600">
                      {openedContentId === id ? (
                        <UpOutlined className="text-[17px]" />
                      ) : (
                        <DownOutlined className="text-[17px]" />
                      )}
                    </div>
                  </div>
                  {openedContentId === id && (
                    <div className="p-2">{description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </M_Layout>
    </>
  );
};

export default Faq;

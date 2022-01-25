import Head from "next/head";
import M_Layout from "../../../../components/layout/M_Layout";
const ExamResult = () => {
  const cards =
    typeof window === "undefined"
      ? []
      : JSON.parse(sessionStorage.getItem("examLog"));
  console.log({ cards });
  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          <div className="w-full flex flex-col gap-[8px]">
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="text-[14px] font-semibold">학습 결과</div>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-collapse border-y border-y-gray-200">
                    <th className="text-[1rem] bg-slate-100 w-[20%]">앞면</th>
                    <th className="text-[1rem] bg-slate-100 w-[20%]">입력값</th>
                    <th className="text-[1rem] bg-slate-100 w-[20%]">정답</th>
                    <th className="text-[1rem] bg-slate-100 w-[20%]">결과</th>
                    <th className="text-[1rem] bg-slate-100 w-[20%]">더보기</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-collapse border-y border-y-gray-200">
                    <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                      동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리
                      나라 만세
                    </td>
                    <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                      동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리
                      나라 만세
                    </td>
                    <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                      동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리
                      나라 만세
                    </td>
                    <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center px-[8px] truncate">
                      ○
                    </td>
                    <td className="text-[1rem] py-[4px] text-center">○</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-2 border border-gray-300 border-solid rounded">
              <div className="flex items-end gap-5">
                <span className="text-[14px] font-semibold">n번째 카드</span>{" "}
                <a className="text-base text-blue-500">더보기</a>
              </div>
              <div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">앞면 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">입력 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">정답 :</div>
                  <div className="truncate">
                    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라
                    만세
                  </div>
                </div>
                <div className="text-base font-[500] flex gap-3">
                  <div className="flex-none">결과 :</div>
                  <div>○</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </M_Layout>
    </>
  );
};

export default ExamResult;

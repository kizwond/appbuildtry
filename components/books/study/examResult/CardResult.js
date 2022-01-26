import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import stringSimilarity from "string-similarity";

const CardResult = ({ seq, face1, answer, face2, cardId }) => {
  const result = answer === " " ? false : face2.indexOf(answer) > -1;
  const similarirty = stringSimilarity.compareTwoStrings(face2, answer);

  console.log({ similarirty });
  return (
    <div
      className={`flex border border-gray-300 border-solid rounded  ${
        result && "bg-gray-100 text-gray-700"
      }`}
      onClick={() => {
        console.log("카드 더보기 // 팝업으로 카드 시험 관련 내용 전달");
      }}
    >
      <div className="flex items-center justify-center border-r grow-0 shrink-0 basis-14 border-r-gray-300">
        {seq}
      </div>

      <div className="flex-auto min-w-0 p-2 border-r border-r-gray-300">
        <div className="flex text-base">
          <div className="flex-none w-12">앞면 :</div>
          <div className="truncate">{face1}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">입력 :</div>
          <div className="truncate">{answer}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">정답 :</div>
          <div className="truncate">{face2}</div>
        </div>
      </div>

      <div className="flex items-center justify-center grow-0 shrink-0 basis-16">
        {result ? (
          <CheckOutlined className="text-[2.5rem]" />
        ) : (
          <CloseOutlined className="text-[2.5rem]" />
        )}
      </div>
    </div>
  );
};

export default CardResult;

const CardResult2 = ({ seq, face1, answer, face2, cardId }) => {
  const similarirty = stringSimilarity.compareTwoStrings(face2, answer);
  const result = similarirty > 0.5;

  console.log({ similarirty });
  return (
    <div
      className={`flex border border-gray-300 border-solid rounded  ${
        result && "bg-gray-100 text-gray-700"
      }`}
      onClick={() => {
        console.log("카드 더보기 // 팝업으로 카드 시험 관련 내용 전달");
      }}
    >
      <div className="flex items-center justify-center border-r grow-0 shrink-0 basis-14 border-r-gray-300">
        {seq}
      </div>

      <div className="flex-auto min-w-0 p-2 border-r border-r-gray-300">
        <div className="flex text-base">
          <div className="flex-none w-12">앞면 :</div>
          <div className="truncate">{face1}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">입력 :</div>
          <div className="truncate">{answer}</div>
        </div>
        <div className="flex text-base">
          <div className="flex-none w-12">정답 :</div>
          <div className="truncate">{face2}</div>
        </div>
        {similarirty}
      </div>

      <div className="flex items-center justify-center grow-0 shrink-0 basis-16">
        {result ? (
          <CheckOutlined className="text-[2.5rem]" />
        ) : (
          <CloseOutlined className="text-[2.5rem]" />
        )}
      </div>
    </div>
  );
};

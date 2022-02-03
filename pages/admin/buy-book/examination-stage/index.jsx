import { useMutation, useQuery } from "@apollo/client";
import { Button, message } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import SectionForResult from "../../../../components/books/study/result/SectionForResult";
import { StyledFlexSpaceBetween } from "../../../../components/common/styledComponent/page";
import M_Layout from "../../../../components/layout/M_Layout.js";
import { MUTATION_UPDATE_CANDIDATE_BOOK_STATUS } from "../../../../graphql/mutation/candidateBook";
import { QUERY_ALL_CANIDIDATE_BOOKS } from "../../../../graphql/query/allQuery";

const ExaminationStageForPreRegistrationBuyBook = () => {
  const router = useRouter();

  const { loading, error, data } = useQuery(QUERY_ALL_CANIDIDATE_BOOKS, {
    onCompleted: (received_data) => {
      if (received_data.candibook_getAllCandibook.status === "200") {
        console.log("판매 신청 책 데이터 받기", received_data);
      } else if (received_data.candibook_getAllCandibook.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
    fetchPolicy: "network-only",
  });

  const [updateCandiateBook] = useMutation(
    MUTATION_UPDATE_CANDIDATE_BOOK_STATUS
  );

  const approveCanidateBook = async ({
    candibook_id,
    bookTitle,
    newStatus,
  }) => {
    updateCandiateBook({
      variables: {
        forUpdateStatus: {
          candibook_id,
          newStatus,
        },
      },
    }).then((result) => {
      if (result.data.candibook_updateStatus.status === "200") {
        message.success(
          `${bookTitle}을 판매책으로 ${
            newStatus === "underReview"
              ? "검토 중"
              : newStatus === "approved"
              ? "승인완료"
              : newStatus === "rejected"
              ? "거절"
              : "처리하지 못"
          }하였습니다`,
          0.7
        );
        console.log("변경 성공", result);
      }
    });
  };

  return (
    <M_Layout>
      <div className="relative top-[40px] h-[calc(100vh_-_60px)] overflow-auto px-[8px] flex flex-col gap-3 ">
        <SectionForResult
          title={
            <StyledFlexSpaceBetween className="mt-2">
              <div className="text-[1.16667rem] font-[500]">
                판매책 신청 내역
              </div>
              <div>
                <div className="flex gap-2">
                  <Button className="!text-base" size="small">
                    검토중
                  </Button>
                  <Button className="!text-base" size="small">
                    거절
                  </Button>
                  <Button className="!text-base" size="small">
                    승인완료
                  </Button>
                </div>
              </div>
            </StyledFlexSpaceBetween>
          }
          content={
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-collapse border-y border-y-gray-200">
                  <th className="text-[1rem] bg-slate-100">책 제목</th>
                  <th className="text-[1rem] bg-slate-100 w-[13%]">신청일</th>
                  <th className="text-[1rem] bg-slate-100 w-[13%]">승인일</th>
                  <th className="text-[1rem] bg-slate-100 w-[13%]">코멘트</th>
                  <th className="text-[1rem] bg-slate-100 w-[15%]">상태</th>
                  <th className="text-[1rem] bg-slate-100 w-[10%]">승인</th>
                  <th className="text-[1rem] bg-slate-100 w-[10%]">거절</th>
                </tr>
              </thead>
              <tbody>
                {data?.candibook_getAllCandibook?.candibooks.length > 0 &&
                  data?.candibook_getAllCandibook?.candibooks.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b border-collapse border-b-gray-200"
                    >
                      <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200  text-left px-[8px] truncate">
                        {book.title}
                      </td>
                      <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                        {moment(book.timeCreated).format("M/D")}
                      </td>

                      <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                        {book.timeApproved &&
                          moment(book.timeApproved).format("M/D")}
                      </td>

                      <td
                        className={`text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center${
                          book.amedReq && book.amedReq.length > 0
                            ? " cursor-pointer"
                            : ""
                        }`}
                      >
                        {book.amedReq &&
                          book.amedReq.length > 0 &&
                          book.amedReq.length + "개"}
                      </td>

                      <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                        {book.status === "underReview" && "검토 중"}
                        {book.status === "approved" && "승인완료"}
                        {book.status === "rejected" && "거절"}
                      </td>
                      <td
                        className={`text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center${
                          book.status !== "approved" ? " cursor-pointer" : ""
                        }`}
                        onClick={() => {
                          if (book.status !== "approved") {
                            approveCanidateBook({
                              candibook_id: book._id,
                              bookTitle: book.title,
                              newStatus: "approved",
                            });
                          }
                        }}
                      >
                        {book.status !== "approved" && "승인"}
                      </td>
                      <td
                        className={`text-[1rem] py-[4px] text-center${
                          book.status !== "rejected" ? " cursor-pointer" : ""
                        }`}
                        onClick={() => {
                          if (book.status !== "rejected") {
                            approveCanidateBook({
                              candibook_id: book._id,
                              bookTitle: book.title,
                              newStatus: "rejected",
                            });
                          }
                        }}
                      >
                        {book.status !== "rejected" && "거절"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          }
        />

        <div></div>
      </div>
    </M_Layout>
  );
};

export default ExaminationStageForPreRegistrationBuyBook;

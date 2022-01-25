import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { ResetToekn } from "../graphql/query/account";

const useResetLogin = ({ reRequeset, variables }) => {
  const router = useRouter();

  const [resetToken] = useMutation(ResetToekn, { onCompleted: showdata });

  const reset = useCallback(() => {
    console.log("유즈리셋 로그인 실행됨");
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      var refreshToken = localStorage.getItem("refreshToken");
      console.log("토큰 다시 받기");
      try {
        resetToken({
          variables: {
            refreshToken: refreshToken,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showdata(data) {
    console.log("data", data);
    if (data.resetToken.status === "200") {
      if (variables ?? false) {
        console.log("서버에 재요청하기 with variables", { variables });
        console.log(reRequeset);
        reRequeset(variables);
      } else {
        console.log("서버에 재요청하기");
        reRequeset();
      }
      if (data.resetToken.token !== null) {
        localStorage.setItem("accessToken", data.resetToken.token.accessToken);
        localStorage.setItem(
          "refreshToken",
          data.resetToken.token.refreshToken
        );
      }
    } else {
      router.push("/m/account/login");
    }
  }

  return reset;
};

export default useResetLogin;

export const reset = (resetToken) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var refreshToken = localStorage.getItem("refreshToken");
    console.log(refreshToken);
    console.log("reset ing...")
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
  return;
};


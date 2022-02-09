const decodeHtMLEntities = (function () {
  const ISSEVER = typeof window === "undefined";

  if (!ISSEVER) {
    // this prevents any overhead from creating the object each time
    let element = document.createElement("div");
    function decodeHTMLEntities(str) {
      if (str && typeof str === "string") {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = "";
      }

      return str;
    }
    return decodeHTMLEntities;
  }
})();

export default decodeHtMLEntities;

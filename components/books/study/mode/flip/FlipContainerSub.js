const calculateNormalStudy = (selection, thisCardElapsedTime, studyStatus) => {};

const calculateKnowCase = (selection, thisCardElapsedTime, studyStatus) => {};

exports.calculateStat = async (selection, levelConfig, thisCardElapsedTime, studyStatus) => {
  // selection이 들어왔다.
  switch (selection) {
    case "diffi1":
      console.log(selection);
      break;
    case "diffi2":
    case "diffi3":
    case "diffi4":
      studyStatus = calculateNormalStudy(selection, thisCardElapsedTime, studyStatus);
    case "diifi5":
      studyStatus = calculateKnowCase(selection, thisCardElapsedTime, studyStatus);
    case "hold":
    case "completed":
    // studyStatus = calculateholcomCase(selection, thisCardElapsedTime, studyStatus)
    case "restore":
    case "pass":
    case "move":
    case "finish":
  }

  return { studyStatus };
};

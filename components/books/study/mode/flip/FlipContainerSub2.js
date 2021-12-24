


exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs) => {
    
    console.log(recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs)
    const {levelChanageSensitivity, reStudyRatio} = levelConfigs.restudy
    const initialMaxLevel = 5
    const lev10StudyTimes = 10
    const levelCoverWidth = 5
    const studyTimesCoeff = Math.round(lev10StudyTimes / Math.pow(levelCoverWidth, 0.5)*1000)/1000
    const weightFromLevelCurrent = Math.round(Math.pow(Math.max(1-levelCurrent/100, 0), 2)/4 *1000)/1000
    const averageElapsedTime = Math.round (currentLevElapsedTime / currentLevStudyTimes / 24 / 3600000 *1000 ) /1000
    const gapBetweenLevelCurrentAndElapsedTime = Math.abs(levelCurrent - averageElapsedTime)
    const factorAppliedGap = gapBetweenLevelCurrentAndElapsedTime * (1000-Math.pow(11-currentLevStudyTimes, 3)/1000)
    const maxElapsedTime = Math.max(levelCurrent,averageElapsedTime )
    let baseElapsedTime
    if (currentLevStudyTimes == 1){
        baseElapsedTime = Math.round(maxElapsedTime * ( 1+ weightFromLevelCurrent * levelChanageSensitivity) * 1000)/1000
    } else {
        baseElapsedTime = Math.round((maxElapsedTime-factorAppliedGap) * ( 1+ weightFromLevelCurrent * levelChanageSensitivity) * 1000)/1000
    }

    // const calculate

    let newLevel, needStudyTime
    if (recentKnowTime == null){
        newLevel = Math.round(initialMaxLevel / currentLevStudyTimes * 1000) / 1000
        needStudyTime =  Date.now() + Math.round(levelCurrent* (Math.pow(reStudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000 *1000 )/1000
        return {newLevel, needStudyTime}
    } else {
        newLevel = Math.round((Math.pow(studyTimesCoeff,2)*baseElapsedTime)/(Math.pow(currentLevStudyTimes,2)+Math.pow(studyTimesCoeff,2))*1000)/1000
        needStudyTime =  Date.now() + Math.round(levelCurrent* (Math.pow(reStudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000 *1000 )/1000
        return {newLevel, needStudyTime}
    }

}
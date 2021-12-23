


exports.calculateNeedStudyTime = (recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs) => {
    
    console.log(recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs)
    const lev10StudyTimes = 10
    const levelCoverWidth = 5
    const studyTimesCoeff = Math.round(lev10StudyTimes / Math.pow(levelCoverWidth, 0.5)*1000)/1000
    const {levelChanageSensitivity, reStudyRatio} = levelConfigs.restudy

    if (recentKnowTime == null){
        return {
            levelCurrent : 1, 
            needStudyTime : new Date()
        }
    }


    return

    // const thisTurnElapsedTime = new Date() - recentKnowTime
    // const averageElapsedTimeByDay = Math.round((currentLevElapsedTime+thisTurnElapsedTime) / (currentLevStudyTimes+1) /3600000 *10000) /10000    

    // const averageElapsedTimeStandardized = Math.round((Math.log2(averageElapsedTimeByDay/periodCoeff)+1)*100)/100    

    // let retentionRate = Math.round((15+averageElapsedTimeStandardized*1-currentLevStudyTimes*1)/30*10000)/10000
    // if (retentionRate < 0.001) { retentionRate = 0.001}
    // if (retentionRate > 0.999) { retentionRate = 0.999}    

    // let newLevel = Math.round((Math.log2(Math.log(0.8)*averageElapsedTimeByDay/periodCoeff/Math.log(retentionRate))+1)*10000)/10000
    // // 한번에 알겠음 했는데 오히려 레벨이 떨어지는 경우
    // if (currentLevStudyTimes == 1){
    //     if (newLevel < levelCurrent){newLevel = levelCurrent}
    // }
    // if (newLevel < 0.1) { newLevel = 0.1}
    // if (newLevel > 10) { newLevel = 10}    

    // const pendingPeriod = Math.round(periodCoeff * Math.pow(2, newLevel-1) * Math.log(restudyRatio) / Math.log(0.8) * 3600000)    

    // const needStudyTime = new Date (Date.now() + pendingPeriod)    

    // return {newLevel, needStudyTime}



}
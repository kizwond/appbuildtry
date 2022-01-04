


exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs) => {
    
    try{
        console.log(recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs)
        const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
        const initialMaxLevel = 5
        const lev10StudyTimes = 10
        const levelCoverWidth = 5
        const studyTimesCoeff = Math.round(lev10StudyTimes / Math.pow(levelCoverWidth, 0.5)*1000)/1000

        //여기
        const weightFromLevelCurrent = Math.round(Math.pow(Math.max(1-levelCurrent/100, 0), 2)/4 *1000)/1000
        console.log('currentLevElapsedHour', currentLevElapsedHour)

        const averageElapsedTime = Math.round (currentLevElapsedHour / currentLevStudyTimes / 24 / 3600000 *1000 ) /1000
        const gapBetweenLevelCurrentAndElapsedTime = Math.abs(levelCurrent - averageElapsedTime)
        const factorAppliedGap = gapBetweenLevelCurrentAndElapsedTime * ((1000-Math.pow(11-currentLevStudyTimes, 3))/1000)

        // const maxElapsedTime = Math.max(levelCurrent,averageElapsedTime )

        let newLevel, needStudyTime
        if (recentKnowTime == null){
            newLevel = Math.round(initialMaxLevel / currentLevStudyTimes * 1000) / 1000;
            needStudyTime =  new Date(Date.now() + Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000)
            return {newLevel, needStudyTime}
        }
            
        let baseElapsedTime
        if (recentKnowTime != null && currentLevStudyTimes == 1){
            const maxElapsedTime = levelCurrent
            baseElapsedTime = Math.round(maxElapsedTime * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
        }
        if (recentKnowTime != null && currentLevStudyTimes != 1){
            const maxElapsedTime = Math.max(levelCurrent,averageElapsedTime )
            baseElapsedTime = Math.round((maxElapsedTime-factorAppliedGap) * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
        }

        newLevel = Math.round((Math.pow(studyTimesCoeff,2)*baseElapsedTime)/(Math.pow(currentLevStudyTimes,2)+Math.pow(studyTimesCoeff,2))*1000)/1000
        needStudyTime =  new Date(Date.now() + Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000)
        return {newLevel, needStudyTime}
        
    }catch(err){
        console.log(err)
    }

}
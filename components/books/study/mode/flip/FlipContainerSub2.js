


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

exports.updateSessionResult = (singleResult) => {

    const {card_info, studyStatus} = singleResult.studyStatus
    const {mybook_id} = card_info
    const {
        selection, 
        statusOriginal, 
        statusPrev, 
        levelOriginal, 
        levelPrev, 
        levelCurrent, 
        clickTimesInSession 
    } = studyStatus
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));
    const mybookPosition = resultByBook.findIndex(result => result.mybook_id == mybook_id)
    
    if (['diffi1','diffi2','diffi3','diffi4','diffi5','hold','completed'].includes(selection)){
        resultOfSession.clicks[selection] +=1
        resultByBook[mybookPosition].clicks[selection] +=1
    } else {
        resultOfSession.clicks.etc +=1
        resultByBook[mybookPosition].clicks.etc +=1
    }
    
    if (selection == 'diffi5'){  
        if (levelPrev < levelCurrent){
            resultByBook[mybookPosition].total.count += -1
            resultByBook[mybookPosition].total.gap = levelCurrent - levelOriginal
            resultByBook[mybookPosition].up.count += -1
            resultByBook[mybookPosition].up.gap = levelCurrent - levelOriginal
            resultOfSession.total.count += -1
            resultOfSession.total.gap = levelCurrent - levelOriginal
            resultOfSession.up.count += -1
            resultOfSession.up.gap = levelCurrent - levelOriginal            
        } else {
            resultByBook[mybookPosition].total.count += -1
            resultByBook[mybookPosition].total.gap = levelCurrent - levelOriginal
            resultByBook[mybookPosition].down.count += -1
            resultByBook[mybookPosition].down.gap = levelCurrent - levelOriginal
            resultOfSession.total.count += -1
            resultOfSession.total.gap = levelCurrent - levelOriginal
            resultOfSession.down.count += -1
            resultOfSession.down.gap = levelCurrent - levelOriginal                        
        }
    }

    if (clickTimesInSession == 1){
        resultOfSession.numCards[statusOriginal].started += 1
    }
    if (['diffi5', 'pass', 'hold', 'completed'].includes(selection)){
        resultOfSession.numCards[statusOriginal].finished += 1
    }
    if (selection == 'restore' && clickTimesInSession > 1){
        resultOfSession.numCards[statusOriginal].finished += -1
    }



    if (statusOriginal != statusPrev){
        resultOfSession.statusChange[statusOriginal][statusPrev] += -1
        resultOfSession.statusChange[statusOriginal][statusCurrent] += 1
        resultByBook[mybookPosition].statusChange[statusOriginal][statusPrev] += -1
        resultByBook[mybookPosition].statusChange[statusOriginal][statusCurrent] += 1
    } else {
        resultOfSession.statusChange[statusOriginal][statusCurrent] += 1
        resultByBook[mybookPosition].statusChange[statusOriginal][statusCurrent] += 1        
    }
    
    


}
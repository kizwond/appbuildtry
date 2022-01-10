


exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs) => {
    
    try{
        let newLevel, needStudyTime, needStudyTimeGap
        
        // console.log(recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs) 
        // console.log('recentKnowTime', recentKnowTime)       
        // console.log('currentLevElapsedHour', currentLevElapsedHour)
        // console.log('currentLevStudyTimes', currentLevStudyTimes)
        const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
        // console.log('levelchangeSensitivity, restudyRatio', levelchangeSensitivity, restudyRatio)
        const initialMaxLevel = 5
        const lev10StudyTimes = 10
        const levelCoverWidth = 5
        const studyTimesCoeff = Math.round(lev10StudyTimes / Math.pow(levelCoverWidth, 0.5)*1000)/1000
        
        if (recentKnowTime == null){
            newLevel = Math.round(initialMaxLevel / currentLevStudyTimes * 1000) / 1000;
            needStudyTimeGap = Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000
            needStudyTime =  new Date(Date.now() + needStudyTimeGap)
            console.log('newLevel', levelCurrent, newLevel)
            return {newLevel, needStudyTime}
        }

        //여기
        const weightFromLevelCurrent = Math.round(Math.pow(Math.max(1-levelCurrent/100, 0), 2)/4 *1000)/1000
        // console.log('weightFromLevelCurrent', weightFromLevelCurrent)
        const averageElapsedHour = Math.round (currentLevElapsedHour / currentLevStudyTimes / 24 / 3600000 *1000 ) /1000
        // console.log('averageElapsedHour', averageElapsedHour)
        const gapBetweenLevelCurrentAndElapsedTime = Math.abs(levelCurrent - averageElapsedHour)
        // console.log('gapBetweenLevelCurrentAndElapsedTime', gapBetweenLevelCurrentAndElapsedTime)
        const factorAppliedGap = gapBetweenLevelCurrentAndElapsedTime * ((1000-Math.pow(11-currentLevStudyTimes, 3))/1000)
        // console.log('factorAppliedGap', factorAppliedGap)
            
        let baseElapsedTime
        if (recentKnowTime != null && currentLevStudyTimes == 1){
            const maxElapsedTime = levelCurrent
            baseElapsedTime = Math.round(maxElapsedTime * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
            // console.log('baseElapsedTime1', baseElapsedTime)
        }
        if (recentKnowTime != null && currentLevStudyTimes != 1){
            const maxElapsedTime = Math.max(levelCurrent,averageElapsedHour )
            baseElapsedTime = Math.round((maxElapsedTime-factorAppliedGap) * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
            // console.log('baseElapsedTime2', baseElapsedTime)
        }

        newLevel = Math.round((Math.pow(studyTimesCoeff,2)*baseElapsedTime)/(Math.pow(currentLevStudyTimes,2)+Math.pow(studyTimesCoeff,2))*1000)/1000
        // console.log('newLevel', levelCurrent, newLevel)
        needStudyTimeGap = Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000
        needStudyTime =  new Date(Date.now() + needStudyTimeGap)
        return {newLevel, needStudyTime, needStudyTimeGap}
        
    }catch(err){
        console.log(err)
    }

}

exports.updateSessionResult = (singleResult) => {

    const {card_info, content, studyStatus} = singleResult
    const {mybook_id} = card_info    
    const {
        recentSelection, 
        recentStudyHour,
        statusOriginal, 
        statusPrev, 
        statusCurrent,
        levelOriginal, 
        // levelPrev, 
        levelCurrent, 
        clickTimesInSession,
        userFlagPrev,
        userFlagOriginal
    } = studyStatus
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));    
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));
    
    const mybookPosition = resultByBook.findIndex(result => result.mybook_id == mybook_id)
    
    // 스터디아워
    resultOfSession.studyHour += recentStudyHour
    resultByBook[mybookPosition].studyHour += recentStudyHour

    console.log('어라 이거 몇 번?')
    // 클릭수
    if (['diffi1','diffi2','diffi3','diffi4','diffi5','hold','completed'].includes(recentSelection)){
        resultOfSession.clicks[recentSelection] +=1
        resultOfSession.clicks.total +=1
        resultByBook[mybookPosition].clicks[recentSelection] +=1
        resultByBook[mybookPosition].clicks.total +=1
    } else {
        resultOfSession.clicks.etc +=1
        resultOfSession.clicks.total +=1
        resultByBook[mybookPosition].clicks.etc +=1
        resultByBook[mybookPosition].clicks.total +=1
    }
    
    // 스테이터스 변경
    if (statusPrev != statusCurrent){
        if (statusPrev == statusOriginal){
            resultOfSession.statusChange[statusOriginal][statusCurrent] += 1
            resultByBook[mybookPosition].statusChange[statusOriginal][statusCurrent] += 1             
        } else {
            resultOfSession.statusChange[statusOriginal][statusPrev] += -1
            resultOfSession.statusChange[statusOriginal][statusCurrent] += 1
            resultByBook[mybookPosition].statusChange[statusOriginal][statusPrev] += -1
            resultByBook[mybookPosition].statusChange[statusOriginal][statusCurrent] += 1
        }
    }

    // 레벨 변동
    console.log('levelOriginal', levelOriginal)
    console.log('levelCurrent', levelCurrent)
    console.log(recentSelection)
    if (recentSelection == 'diffi5'){  
        if (levelOriginal < levelCurrent){
            console.log('1111111')
            resultByBook[mybookPosition].levelChange.total.count += 1
            resultByBook[mybookPosition].levelChange.total.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultByBook[mybookPosition].levelChange.up.count += 1
            resultByBook[mybookPosition].levelChange.up.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultOfSession.levelChange.total.count += 1
            resultOfSession.levelChange.total.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultOfSession.levelChange.up.count += 1
            resultOfSession.levelChange.up.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000            
        } else {
            console.log('22222222')
            resultByBook[mybookPosition].levelChange.total.count += 1
            resultByBook[mybookPosition].levelChange.total.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultByBook[mybookPosition].levelChange.down.count += 1
            resultByBook[mybookPosition].levelChange.down.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultOfSession.levelChange.total.count += 1
            resultOfSession.levelChange.total.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
            resultOfSession.levelChange.down.count += 1
            resultOfSession.levelChange.down.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000                        
        }
    }

    // Mybook에 업데이트 해줄 꺼
    if  (recentSelection == 'diffi5'){
        resultOfSession.nonCompletedLevelChange.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
        resultByBook[mybookPosition].nonCompletedLevelChange.gap += Math.round((levelCurrent - levelOriginal)*1000)/1000
    }
    if  (recentSelection == 'restore' && statusPrev == 'completed'){
        resultOfSession.nonCompletedLevelChange.count += 1
        resultOfSession.nonCompletedLevelChange.gap += levelCurrent
        resultByBook[mybookPosition].nonCompletedLevelChange.count += 1
        resultByBook[mybookPosition].nonCompletedLevelChange.gap += levelCurrent
    }
    if  (recentSelection == 'completed'){
        resultOfSession.nonCompletedLevelChange.count += -1
        resultOfSession.nonCompletedLevelChange.gap += -levelCurrent
        resultByBook[mybookPosition].nonCompletedLevelChange.count += -1
        resultByBook[mybookPosition].nonCompletedLevelChange.gap += -levelCurrent
    }

    // 스테이터스 별 카드 갯수
    if (clickTimesInSession == 1){
        resultOfSession.numCards[statusOriginal].started += 1
        resultByBook[mybookPosition].numCards[statusOriginal].started += 1
    }
    if (['diffi5', 'pass', 'hold', 'completed'].includes(recentSelection)){
        resultOfSession.numCards[statusOriginal].finished += 1
        resultByBook[mybookPosition].numCards[statusOriginal].finished += 1
    }
    if (recentSelection == 'restore' && clickTimesInSession > 1){
        resultOfSession.numCards[statusOriginal].finished += -1
        resultByBook[mybookPosition].numCards[statusOriginal].finished += -1
    }

    // 플래그 변동
    if (userFlagPrev != content.userFlag){
        if (userFlagPrev == userFlagOriginal){
            resultOfSession.userFlagChange['flag'+ userFlagOriginal] += 1
            resultByBook[mybookPosition].userFlagChange['flag'+ userFlagOriginal] += 1
        } else {
            resultOfSession.userFlagChange['flag'+ userFlagPrev] += -1
            resultOfSession.userFlagChange['flag'+ userFlagOriginal] += 1
            resultByBook[mybookPosition].userFlagChange['flag'+ userFlagPrev] += -1
            resultByBook[mybookPosition].userFlagChange['flag'+ userFlagOriginal] += 1
        }
    }

    // if (recentSelection == 'finish'){
    //     const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));    
    //     const cardListRemained = JSON.parse(sessionStorage.getItem("cardListRemained"));

    //     for (i=0; i<resultByBook.length; i++){
    //         for (const statusOriginal of ['ing', 'yet', 'hold', 'completed']){
    //             resultByBook[mybookPosition].numCards[statusOriginal].inserted += cardListStudying.filter(card => card.studyStatus.statusOrigianl == statusOriginal && card.card_info.mybook_id == resultByBook[i].mybook_id).length
    //             resultByBook[mybookPosition].numCards[statusOriginal].selected += resultByBook[mybookPosition].numCards[statusOriginal].inserted + cardListStudying.filter(card => card.studyStatus.statusOrigianl == statusOriginal && card.card_info.mybook_id == resultByBook[i].mybook_id).length
    //             resultOfSession.numCards[statusOriginal].inserted += resultByBook[mybookPosition].numCards[statusOriginal].inserted
    //             resultOfSession.numCards[statusOriginal].selected += resultByBook[mybookPosition].numCards[statusOriginal].selected
    //         }
    //     }
    // }

    // console.log('result', resultOfSession)
    
    sessionStorage.setItem("resultOfSession", JSON.stringify(resultOfSession))
    sessionStorage.setItem("resultByBook", JSON.stringify(resultByBook))

}
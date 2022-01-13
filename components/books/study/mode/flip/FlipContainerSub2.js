exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentStudyTime, recentStudyResult, studyRatio, studyTimesInSession, levelConfigs) => {
    
    const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
    const KnowStudyRatio = 95
    const initialElapsedTime = 1
    const minRestudyMin = 5
    const restudyCoeffForSession = 6 / 100

    let newLevel
    let needStudyTime, needStudyTimeGap, needStudyTimeTmp
    try{
        
        console.log('잘 들어왔당가?', levelCurrent, recentStudyTime,studyRatio, studyTimesInSession )
        
        // 세션 첫 학습인 경우
        if (studyTimesInSession != 1){
            newLevel = levelCurrent
        } else if (studyTimesInSession == 1){
            if (levelCurrent == 0){
                newLevel = Math.round(initialElapsedTime * Math.log(0.8) / Math.log(studyRatio/100) * 1000) / 1000;
                console.log('newLevel1', newLevel)
            } else {
                const levelOfLastSession = levelCurrent
                const lastRatioOfLastSession = recentStudyResult
                const estimatedElapsedTimeOfLastSession = Math.round(levelOfLastSession * Math.log(lastRatioOfLastSession/100) / Math.log(0.8)*1000)/1000
                const elapsedTimeFromLastSession = Math.round((Date.now() - Date.parse(recentStudyTime))/24/3600000 *1000)/1000
                const totalElapsedTime = estimatedElapsedTimeOfLastSession + elapsedTimeFromLastSession
    
                newLevel = Math.round(totalElapsedTime * Math.log(0.8) / Math.log(studyRatio/100)*1000)/1000
                console.log('newLevel2', newLevel)
            }
        }

        // 반올림해서 레벨이 0이 되어버리는 것을 막아준다.
        newLevel = (newLevel <=0) ? 0.001 : newLevel

        needStudyTimeTmp = (studyRatio == KnowStudyRatio) ? null : new Date(Date.now() + minRestudyMin * 60000 * (restudyCoeffForSession*studyRatio+1))            
        needStudyTimeGap = Math.round(newLevel * (Math.log(restudyRatio/100)-Math.log(studyRatio/100)) / Math.log(0.8) * 24 * 3600000)            
        needStudyTime = new Date(Date.now() + needStudyTimeGap)
        needStudyTime = (needStudyTime < needStudyTimeTmp )? needStudyTimeTmp : needStudyTime        
        console.log('needStudyTime1',needStudyTime)

        return {newLevel, needStudyTime, needStudyTimeTmp}
    }catch (err){
        console.log(err)
    }


}

exports.estimateNextLevelAndNeedStudyTime = (levelCurrent, recentStudyTime, recentStudyResult, studyRatio, studyTimesInSession, levelConfigs) => {
    
    const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
    const KnowStudyRatio = 95
    const initialElapsedTime = 1
    const minRestudyMin = 5
    const restudyCoeffForSession = 6 / 100

    let newLevel
    let needStudyTimeGap
    try{       
        // 세션 첫 학습인 경우
        if (studyTimesInSession == 0){
            if (levelCurrent == 0){
                newLevel = Math.round(initialElapsedTime * Math.log(0.8) / Math.log(KnowStudyRatio/100) * 1000) / 1000;                
            } else {
                const levelOfLastSession = levelCurrent
                const lastRatioOfLastSession = recentStudyResult
                const estimatedElapsedTimeOfLastSession = Math.round(levelOfLastSession * Math.log(lastRatioOfLastSession/100) / Math.log(0.8)*1000)/1000
                const elapsedTimeFromLastSession = Math.round((Date.now() - Date.parse(recentStudyTime))/24/3600000 *1000)/1000
                const totalElapsedTime = estimatedElapsedTimeOfLastSession + elapsedTimeFromLastSession
    
                newLevel = Math.round(totalElapsedTime * Math.log(0.8) / Math.log(studyRatio/100)*1000)/1000
                console.log('newLevel2', newLevel)
            }            
        } else if (studyTimesInSession > 0){
            newLevel = levelCurrent            
        }
        needStudyTimeGap = Math.round(newLevel * (Math.log(restudyRatio/100)-Math.log(KnowStudyRatio/100)) / Math.log(0.8) * 24 * 3600000)
        
        return {needStudyTimeGap}
    }catch (err){
        console.log(err)
    }
}


// exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs) => {
    
//     try{
//         let newLevel, needStudyTime, needStudyTimeGap
        
//         // console.log(recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs) 
//         // console.log('recentKnowTime', recentKnowTime)       
//         // console.log('currentLevElapsedHour', currentLevElapsedHour)
//         // console.log('currentLevStudyTimes', currentLevStudyTimes)
//         const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
//         // console.log('levelchangeSensitivity, restudyRatio', levelchangeSensitivity, restudyRatio)
//         const initialMaxLevel = 5
//         const lev10StudyTimes = 10
//         const levelCoverWidth = 5
//         const studyTimesCoeff = Math.round(lev10StudyTimes / Math.pow(levelCoverWidth, 0.5)*1000)/1000
        
//         if (recentKnowTime == null){
//             newLevel = Math.round(initialMaxLevel / currentLevStudyTimes * 1000) / 1000;
//             needStudyTimeGap = Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000
//             needStudyTime =  new Date(Date.now() + needStudyTimeGap)
//             // console.log('newLevel', levelCurrent, newLevel)
//             return {newLevel, needStudyTime, needStudyTimeGap}
//         }

//         //여기
//         const weightFromLevelCurrent = Math.round(Math.pow(Math.max(1-levelCurrent/100, 0), 2)/4 *1000)/1000
//         // console.log('weightFromLevelCurrent', weightFromLevelCurrent)
//         const averageElapsedHour = Math.round (currentLevElapsedHour / currentLevStudyTimes / 24 / 3600000 *1000 ) /1000
//         // console.log('averageElapsedHour', averageElapsedHour)
//         const gapBetweenLevelCurrentAndElapsedTime = Math.abs(levelCurrent - averageElapsedHour)
//         // console.log('gapBetweenLevelCurrentAndElapsedTime', gapBetweenLevelCurrentAndElapsedTime)
//         const factorAppliedGap = gapBetweenLevelCurrentAndElapsedTime * ((1000-Math.pow(11-currentLevStudyTimes, 3))/1000)
//         // console.log('factorAppliedGap', factorAppliedGap)
            
//         let baseElapsedTime
//         if (recentKnowTime != null && currentLevStudyTimes == 1){
//             const maxElapsedTime = levelCurrent
//             baseElapsedTime = Math.round(maxElapsedTime * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
//             // console.log('baseElapsedTime1', baseElapsedTime)
//         }
//         if (recentKnowTime != null && currentLevStudyTimes != 1){
//             const maxElapsedTime = Math.max(levelCurrent,averageElapsedHour )
//             baseElapsedTime = Math.round((maxElapsedTime-factorAppliedGap) * ( 1+ weightFromLevelCurrent * levelchangeSensitivity/100) * 1000)/1000
//             // console.log('baseElapsedTime2', baseElapsedTime)
//         }

//         newLevel = Math.round((Math.pow(studyTimesCoeff,2)*baseElapsedTime)/(Math.pow(currentLevStudyTimes,2)+Math.pow(studyTimesCoeff,2))*1000)/1000
//         // console.log('newLevel', levelCurrent, newLevel)
//         needStudyTimeGap = Math.round(newLevel* (Math.pow(restudyRatio,2) + Math.pow(studyTimesCoeff, 2)) / (Math.pow(studyTimesCoeff, 2) + 1) * 24 *3600000)/1000
//         needStudyTime =  new Date(Date.now() + needStudyTimeGap)
//         return {newLevel, needStudyTime, needStudyTimeGap}
        
//     }catch(err){
//         console.log(err)
//     }

// }

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
        recentStudyResult,
        levelCurrent, 
        clickTimesInSession,
        studyTimesInSession,
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
    let clicksField
    if (['difficulty'].includes(recentSelection)){
        const diffiLevelLow = Math.floor(recentStudyResult / 20)+1
        const diffiLevelHigh = Math.floor(recentStudyResult / 10) -3
        if (diffiLevelLow<5){
            clicksField = 'diffi'+diffiLevelLow            
        } else {
            clicksField = 'diffi'+diffiLevelHigh            
        }       
    } else if(['hold','completed'].includes(recentSelection)){
        clicksField = recentSelection               
    } else {
        clicksField = 'etc'        
    }
    resultOfSession.clicks[clicksField] +=1
    resultOfSession.clicks.total +=1
    resultByBook[mybookPosition].clicks[clicksField] +=1
    resultByBook[mybookPosition].clicks.total +=1
    
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
    if (recentSelection=='difficulty' && studyTimesInSession == 1){  
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
    if (recentSelection=='difficulty' && studyTimesInSession == 1){  
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
    if (['pass', 'hold', 'completed'].includes(recentSelection)){
        resultOfSession.numCards[statusOriginal].finished += 1
        resultByBook[mybookPosition].numCards[statusOriginal].finished += 1
    }
    if (recentSelection == 'difficulty' && recentStudyResult == 95){
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
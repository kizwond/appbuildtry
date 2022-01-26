exports.calculateNextLevelAndNeedStudyTime = (levelCurrent, recentStudyTime, recentStudyRatio, studyRatio, studyTimesInSession, levelConfigs, levelUpdated) => {
    
    const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
    const KnowStudyRatio = 95
    const initialElapsedHour = 1
    const minRestudyMin = 5
    const restudyCoeffForSession = 6 / 100

    let newLevel
    let needStudyTime, needStudyTimeGap, needStudyTimeTmp
    try{
        
        console.log('잘 들어왔당가?', levelCurrent, recentStudyTime,studyRatio, studyTimesInSession )
        console.log('levelUpdated', levelUpdated)

        // 세션 첫 학습인 경우
        if (levelUpdated == true){
            console.log('1111111111111111111111111111111111111')
            newLevel = levelCurrent
        } else if (levelUpdated == false){
            console.log('22222222222222222222222222222222')
            if (levelCurrent == 0){
                newLevel = Math.round(initialElapsedHour * Math.log(0.8) / Math.log(studyRatio/100) * 1000) / 1000;
                console.log('newLevel1', newLevel)
            } else {
                const levelOfLastSession = levelCurrent
                const lastRatioOfLastSession = recentStudyRatio
                const estimatedElapsedHourOfLastSession = Math.round(levelOfLastSession * Math.log(lastRatioOfLastSession/100) / Math.log(0.8)*1000)/1000
                const elapsedHourFromLastSession = Math.round((Date.now() - Date.parse(recentStudyTime))/24/3600000 *1000)/1000
                const totalElapsedHour = estimatedElapsedHourOfLastSession + elapsedHourFromLastSession
    
                newLevel = Math.round(totalElapsedHour * Math.log(0.8) / Math.log(studyRatio/100)*1000)/1000
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

exports.estimateNextLevelAndNeedStudyTime = (levelCurrent, recentStudyTime, recentStudyRatio, studyRatio, studyTimesInSession, levelConfigs, levelUpdated) => {
    
    const {levelchangeSensitivity, restudyRatio} = levelConfigs.restudy
    const KnowStudyRatio = 95
    const initialElapsedHour = 1
    const minRestudyMin = 5
    const restudyCoeffForSession = 6 / 100

    let newLevel
    let needStudyTimeGap
    try{       
        // 세션 첫 학습인 경우
        // console.log('studyTimesInSession', studyTimesInSession)
        if (levelUpdated == false){
            // console.log('levelCurrent', levelCurrent)
            if (levelCurrent == 0){
                newLevel = Math.round(initialElapsedHour * Math.log(0.8) / Math.log(KnowStudyRatio/100) * 1000) / 1000;                
                // console.log('newLevel1',newLevel)
            } else {
                const levelOfLastSession = levelCurrent
                const lastRatioOfLastSession = recentStudyRatio
                const estimatedElapsedHourOfLastSession = Math.round(levelOfLastSession * Math.log(lastRatioOfLastSession/100) / Math.log(0.8)*1000)/1000
                const elapsedHourFromLastSession = Math.round((Date.now() - Date.parse(recentStudyTime))/24/3600000 *1000)/1000
                const totalElapsedHour = estimatedElapsedHourOfLastSession + elapsedHourFromLastSession
    
                newLevel = Math.round(totalElapsedHour * Math.log(0.8) / Math.log(KnowStudyRatio/100)*1000)/1000
                // console.log('newLevel2',newLevel)
            }            
        } else if (levelUpdated == true){
            newLevel = levelCurrent            
        }
        needStudyTimeGap = Math.round(newLevel * (Math.log(restudyRatio/100)-Math.log(KnowStudyRatio/100)) / Math.log(0.8) * 24 * 3600000)
        // console.log('needStudyTimeGap',needStudyTimeGap)
        // console.log('needStudyTimeGap', needStudyTimeGap)
        return {needStudyTimeGap}
    }catch (err){
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
        recentStudyRatio,
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
        const diffiLevelLow = Math.floor(recentStudyRatio / 20)+1
        const diffiLevelHigh = Math.floor(recentStudyRatio / 10) -3
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
    if (levelOriginal != levelCurrent){  
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
    console.log(levelOriginal)
    console.log(levelCurrent)
    if (levelOriginal != levelCurrent){  
        resultOfSession.levelChangeByStatus.nonCompleted += Math.round((levelCurrent - levelOriginal)*1000)/1000
        resultByBook[mybookPosition].levelChangeByStatus.nonCompleted += Math.round((levelCurrent - levelOriginal)*1000)/1000
    }
    if  (recentSelection == 'restore' && statusPrev == 'completed'){
        resultOfSession.levelChangeByStatus.nonCompleted += levelCurrent
        resultOfSession.levelChangeByStatus.completed += -levelCurrent
        resultByBook[mybookPosition].levelChangeByStatus.nonCompleted += levelCurrent
        resultByBook[mybookPosition].levelChangeByStatus.completed += -levelCurrent
    }
    if  (recentSelection == 'completed'){
        resultOfSession.levelChangeByStatus.nonCompleted += -levelCurrent
        resultOfSession.levelChangeByStatus.completed += levelCurrent
        resultByBook[mybookPosition].levelChangeByStatus.nonCompleted += -levelCurrent
        resultByBook[mybookPosition].levelChangeByStatus.completed += levelCurrent
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
    if (recentSelection == 'difficulty' && recentStudyRatio == 95){
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
    
    sessionStorage.setItem("resultOfSession", JSON.stringify(resultOfSession))
    sessionStorage.setItem("resultByBook", JSON.stringify(resultByBook))

}
exports.updateSessionResult = (singleResult) => {

    const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));    
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));    
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));    

    const uniqueIDs = []
    const uniqueIDsPosition = []
    for (let i=cardlist_to_send.length-1; i>=0; i--){
        if (processedIDs.includes(cardlist_to_send[i]._id)) continue;
        processedIDs.push(cardlist_to_send[i]._id)
        uniqueIDsPosition.push(i)
    }
    
    const filtered = []
    for (let i=0; i<uniqueIDsPosition.length; i++){
        filtered.push(cardlist_to_send[uniqueIDsPosition[i]])
    }
    
    for (let i=0; i<filtered.length; i++){
        const bookPosition = resultByBook.findIndex(result => result.mybook_id == filtered.card_info.mybook_id)

        // 플래그 변경 감지
        if (filtered[i].content.userFlag != filtered[i].studyStatus.userFlagOriginal){
            resultOfSession.userFlagChange['flag'+filtered[i].studyStatus.userFlagOriginal] -= 1
            resultOfSession.userFlagChange['flag'+filtered[i].content.userFlag] += 1
            resultByBook[bookPosition].userFlagChange['flag'+filtered[i].studyStatus.userFlagOriginal] -= 1
            resultByBook[bookPosition].userFlagChange['flag'+filtered[i].content.userFlag] += 1
        }
        // 스테이터스 변경 감지
        if (filtered[i].studyStatus.statusOriginal != filtered[i].studyStatus.statusCurrent){
            resultOfSession.statusChange[statusOriginal][statusCurrent] += 1
            resultByBook[bookPosition].statusChange[statusOriginal][statusCurrent] += 1
        }
    }

    sessionStorage.setItem("cardlist_to_send", JSON.stringify(filtered))
    // 이녀석이 cardlistUpdated라는 이름으로 날라가면 된다.
    // 날라가기 전에 statusOriginal과 userFlagOriginal은 삭제 필요함
    sessionStorage.setItem("resultOfSession", JSON.stringify(resultOfSession))
    sessionStorage.setItem("resultByBook", JSON.stringify(resultByBook))

    return
}
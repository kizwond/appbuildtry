
exports.calculateExamStatus = () => {  
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));    
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));

    for(i=0; i<cardListStudying.length; i++){
        console.log('i',i)
        
        const {recentExamAnswer, rightAnswer} = cardListStudying[i].studyStatus
        const {mybook_id} = cardListStudying[i].card_info
        const mybookPosition = resultByBook.findIndex(result => result.mybook_id == mybook_id)
        
        cardListStudying[i].studyStatus.totalExamTimes += 1
        cardListStudying[i].studyStatus.recentExamTime = new Date()

        if (recentExamAnswer==null || recentExamAnswer=='' || rightAnswer.indexOf(recentExamAnswer)==-1){
            cardListStudying[i].studyStatus.recentExamResult = 'X'
            resultOfSession.examResult.numFalse +=1
            resultByBook[mybookPosition].examResult.numFalse += 1
        } else if (rightAnswer.indexOf(recentExamAnswer) >-1) {
            cardListStudying[i].studyStatus.recentExamResult = 'O'
            resultOfSession.examResult.numTrue +=1
            resultByBook[mybookPosition].examResult.numTrue += 1
        } else {
            console.log('뭔가 이상함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        }
    }

    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying))    
    sessionStorage.setItem("resultOfSession", JSON.stringify(resultOfSession))    
    sessionStorage.setItem("resultByBook", JSON.stringify(resultByBook))    
};
  
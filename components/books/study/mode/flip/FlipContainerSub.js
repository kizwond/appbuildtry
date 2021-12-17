

// const calculateNormalStudy = function (selection, thisCardElapsedTime, studyStatus) {

// }

// const calculateNormalStudy = function (selection, thisCardElapsedTime, studyStatus) {

// }

exports.calculateStudyStatus = async (selection, levelConfig, thisCardElapsedTime, studyStatus) => {

    
    // selection이 들어왔다.
    switch (selection) {
        case 'diffi1' : 
        case 'diffi2' : 
        case 'diffi3' : 
        case 'diffi4' : 
            // studyStatus = calculateNormalStudy(selection, thisCardElapsedTime, studyStatus)
        case 'diifi5' : 
            // studyStatus = calculateKnowCase(selection, thisCardElapsedTime, studyStatus)
        case 'hold' : 
        case 'completed' : 
            // studyStatus = calculateholcomCase(selection, thisCardElapsedTime, studyStatus)
        case 'restore' : 
        case 'pass' : 
        case 'move' : 
        case 'finish' : 

    }

    return {studyStatus}
}

// oo 경우의 코드
    // const timer = this.state.time;
    // const now = new Date();

    // const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    // console.log("card_details_session", card_details_session);

    // const current_card_info_index = card_details_session.findIndex((item) => item._id === current_card_id);
    // console.log(current_card_info_index);

    // //학습정보 업데이트
    // card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
    // card_details_session[current_card_info_index].studyStatus.statusCurrent = selection;
    // card_details_session[current_card_info_index].studyStatus.needStudyTime = null;
    // card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
    // card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
    // card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
    // if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
    //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
    // } else {
    //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
    //     Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
    //   );


// oo 경우의 코드
    // const timer = this.state.time;
    // const now = new Date();

    // const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    // console.log("card_details_session", card_details_session);

    // const current_card_info_index = card_details_session.findIndex((item) => item._id === current_card_id);
    // console.log(current_card_info_index);

    // //학습정보 업데이트
    // card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
    // card_details_session[current_card_info_index].studyStatus.statusCurrent = selection;
    // card_details_session[current_card_info_index].studyStatus.needStudyTime = null;
    // card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
    // card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
    // card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
    // if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
    //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
    // } else {
    //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
    //     Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
    //   );

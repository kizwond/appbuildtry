export const logIn = (status) => {
    return {
        type:'SIGN_IN',
        payload : status
    }
}

export const logOut = (status) => {
    return {
        type:'SIGN_OUT',
        payload : status
    }
}
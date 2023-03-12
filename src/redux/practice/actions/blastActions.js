export const SET_BLAST_MESSAGE = "SET_BLAST_MESSAGE";
export const CLEAR_BLAST_MESSAGE = "CLEAR_BLAST_MESSAGE";

export const setBlastMessage = (message) => {
    return {
        type: SET_BLAST_MESSAGE,
        payload: message,
    };
};

export const clearBlastMessage = () => {
    return {
        type: CLEAR_BLAST_MESSAGE,
        payload: "",
    };
};

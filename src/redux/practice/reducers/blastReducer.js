import { SET_BLAST_MESSAGE, CLEAR_BLAST_MESSAGE } from "../actions/blastActions";

const initialState = {
    message: null,
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BLAST_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        case CLEAR_BLAST_MESSAGE:
            return {
                ...state,
                message: null,
            };

        default:
            return state;
    }
};

export default messageReducer;

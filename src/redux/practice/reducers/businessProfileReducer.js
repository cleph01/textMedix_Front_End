import {
    SET_BUSINESS_ID,
    SET_BUSINESS,
    SET_BUSINESS_INITIATED,
} from "../actions/businessProfileActions";

const initialState = {
    business: null,
};

const businessProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BUSINESS_INITIATED:
            return {
                ...state,
                isLoading: true,
            };
        case SET_BUSINESS:
            return {
                ...state,
                business: action.payload,
                isLoading: false,
            };
        case SET_BUSINESS_ID:
            return {
                ...state,
                businessId: action.payload,
            };

        default:
            return state;
    }
};

export default businessProfileReducer;

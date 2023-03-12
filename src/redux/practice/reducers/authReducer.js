import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_USER,
} from "../actions/authActions";

const initialState = {
    user: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer;

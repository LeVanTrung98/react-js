import * as types from '../types/index.js';

var intinialState = { 
    filter : [ {type : []},  {category : {}}, {brand : []}, {star : ""}, {price : ""}]
    , curentPage : 1
    , statusSort : 1
    , numberProducts : 0
    , preProducts : []
    , products : []
    , types : []
    , brands : []
    , allTypes : []
    , valueSearch : ""
};

export const HOME = (state = intinialState, actions) => {
    switch(actions.type){

        case types.SET_CURENT_PAGE : {
            return {
                ...state,
                curentPage : actions.payload
            }
        }

        case types.GET_ALL_TYPES : {
            return {
                ...state,
                allTypes : actions.payload
            }
        }

        case types.SEARCH_PRODUCTS : {
            return {
                ...state,
                valueSearch : actions.payload
            }
        }

        case types.BRANDS : {
            return {
                ...state,
                brands : actions.payload
            }
        }

        case types.CLICK_CHANGE_PAGE : {
            return {
                ...state,
                products : actions.payload,
                preProducts : actions.payload
            }
        } 

        case types.SORT : {
            return {
                ...state,
                statusSort : actions.payload
            }
        }

        case types.UPDATE_PRODUCTS : {
            return {
                ...state,
                products : actions.payload
            }
        }

        case types.PRODUCTS : {
            return {
                ...state,
                numberProducts : parseInt(actions.total),
                products : actions.payload,
                preProducts : actions.payload
            };
        }

        case types.CATEGORIES : {
            return {
                ...state,
                categories : actions.payload 
            }
        }

        case types.TYPES : {
            return {
                ...state,
                types : actions.payload 
            }
        }

        case types.CLICK_FILTER : {
            return {
                ...state,
                products : actions.products,
                numberProducts : actions.totalProducts,
                filter : actions.valFilter
            }
        }

        default : return {...state};
    }
}
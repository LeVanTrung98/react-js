import * as types from "../types/index";
import { FeatchData, FetchData } from "../../Commons/Api";
import { getValInFilter, GetURL, sortProducts } from "../../Commons/Function";

export const loadPagesRequest = (...urls) => {
    return (dispatch) => {
        urls.forEach(item => {
            let oldItem = item;

            if (item == "products") {
                item = "products?_page=1&_limit=16";
            } else if(item == "type") {
                item = "type?_limit=5";
            } else if(item == "brand") {
                item = "brand?_limit=5";
            }

            try {
                FetchData(item)().then(res => {
                    let total = res.headers["x-total-count"];
                    total ? dispatch(loadPages(oldItem, res.data, total)) : dispatch(loadPages(item, res.data))
                });
            } catch (error) {
                console.log(error);
            }
        });
    }
}

export const loadPages = (type, value, total = 0) => {
    return {
        type,
        payload: value,
        total
    }
}

export const searchProducts = (value) => {
    return {
        type : types.SEARCH_PRODUCTS,
        payload : value
    }
}

export const loadUrlRequest = (type, url) => {
    return (dispatch) => {
        try {
            FetchData(url)().then(res => {
                dispatch({
                    type,
                    payload : res.data
                });
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const sort = (value) => {
    return {
        type: types.SORT,
        payload: value
    }
}

export const updateProducts = (value) => {
    return {
        type: types.UPDATE_PRODUCTS,
        payload: value
    }
}

export const fetchProductsRequest = (values) => {
    return (dispatch) => {
        return FetchData()
    }
}

export const ClickChangePage = (page, url) => {
    return (dispatch, getstate) => {
        let statusSort = getstate().HOME.statusSort;
        try {
            FetchData(url)().then(res => {
                let sort = sortProducts(statusSort, res.data, res.data);
                dispatch({
                    type: types.CLICK_CHANGE_PAGE,
                    payload: sort
                });
                dispatch({
                    type: types.SET_CURENT_PAGE,
                    payload: page
                });
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const clickFilterRequest = (value, type) => {
    return (dispatch, getState) => {
        let valFilter = [...getState().HOME.filter];
        let valSearch = getState().HOME.valueSearch;
        let curentPage = getState().HOME.curentPage;
        let statusSort = getState().HOME.statusSort;
        let values = getValInFilter(valFilter);
        let url = "";
        switch (type) {
            case "category": {
                valFilter[0].type = [];
                valFilter[2].brand = [];
                valFilter[3].star = "";
                valFilter[1].category = value;
                url = GetURL(curentPage, value, values.type, values.brand, values.star, values.price, valSearch);
                break;
            }

            case "brand": {
                let brand = valFilter[2].brand;
                let check = brand.findIndex(item => item.brand == value.brand);

                if (check === -1) {
                    valFilter[2].brand = [...brand, value]
                } else {
                    valFilter[2].brand.splice(check, 1);
                }

                url = GetURL(curentPage, values.category, values.type, valFilter[2].brand, values.star, values.price, valSearch);
                break;
            }

            case "type": {
                let type = valFilter[0].type;
                let check = type.findIndex(item => item.type == value.type);

                if (check === -1) {
                    valFilter[0].type = [...type, value]
                } else {
                    valFilter[0].type.splice(check, 1);
                }

                url = GetURL(curentPage, values.category, valFilter[0].type, values.brand, values.star, values.price, valSearch);
                break;
            }

            case "price": {
                valFilter[4].price = value;
                url = GetURL(curentPage, values.category, values.type, values.brand, values.star, valFilter[4].price, valSearch);
                break;
            }

            case "star": {
                valFilter[3].star = value;
                url = GetURL(curentPage, values.category, values.type, values.brand, valFilter[3].star, values.price, valSearch);
                break;
            }
            
            case "search" : {
                url = GetURL(curentPage, values.category, values.type, values.brand, valFilter[3].star, values.price, value);
                break;
            }

            default: {
                url = '';
                break;
            };
        }
        try {
            FetchData(url)().then(res => {
                let sort = sortProducts(statusSort, res.data, res.data);
                let totalProducts = parseInt(res.headers["x-total-count"]);

                dispatch({
                    type: types.CLICK_FILTER,
                    products: sort,
                    totalProducts,
                    valFilter
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}


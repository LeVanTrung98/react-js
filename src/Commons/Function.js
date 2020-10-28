export const convertValueCategories = (data) => {
    let convertArr = Object.values(data);
    let sortRootID = convertArr.sort((a, b) => (a.root_id - b.root_id));
    let rootId = convertArr.map(item => item.root_id);
    let set = new Set();
    let map = new Map();

    for (const item of rootId) {
        set.add(item);
    }
    let idRoot;
    sortRootID.reduce((result, curent) => {
        if (curent.root_id == curent.id) {
            idRoot = curent.id;
            let value = { id: curent.id, name: curent.name };
            map.set(curent.id, value);
        } else {
            if (curent.parent_id == idRoot && curent.id !== idRoot) {
                let key = curent.root_id;
                let preVal = map.get(key)?.children?.[0];
                let value;
                let valTemp = {};
                if (preVal) {
                    valTemp = [...(map.get(key)?.children), { id: curent.id, name: curent.name }]
                    value = { ...map.get(key), children: [...valTemp] };
                } else {
                    valTemp = { id: curent.id, name: curent.name };
                    value = { ...map.get(key), children: [{ id: curent.id, name: curent.name }] };
                }
                map.set(key, value);
            } else {
                let key = curent.root_id;
                let value = map.get(key);
                let valueChild = value.children;
                for (let i = 0; i < valueChild.length; i++) {
                    if (valueChild[i].id === curent.parent_id) {
                        let value = valueChild[i].children && { ...valueChild[i].children?.[1] };
                        valueChild[i] = Object.assign({}, valueChild[i], { children: [value, { id: curent.id, name: curent.name }] });
                    }
                }
            }
        }
        return result = curent;
    }, {});

    let value = [];

    for (let [item, val] of map) {
        value.push(val);
    }

    return value;
}

export const getChildCateClick = (data, nodes) => {
    let rootId = new Set();
    data.map(item => rootId.add(item.root_id));
    let getChildId;
    if (rootId.has(parseInt(nodes))) {
        getChildId = data.reduce((result, item) => {
            if (item.root_id == nodes) {
                result.push(item.id);
            }
            return result;
        }, []);
    } else {
        getChildId = data.reduce((result, item) => {
            if (item.parent_id == nodes) {
                result.push(item.id);
            }
            return result;
        }, [parseInt(nodes)]);
    }
    return getChildId;
}

export const GetURL = (curentPage, cate, types, brands, stars, prices, valueSearch) => {
    let url = '';
    let type = types.length > 0 ? types.reduce((result, item) => {
        return result += `&type=${parseInt(item)}`;
    }, "") : "";
    let brand = brands.length > 0 ? brands.reduce((result, item) => {
        return result += `&brand=${parseInt(item)}`;
    }, "") : "";
    let star = stars ? `&rate=${stars}` : "";
    let [price1, price2] = prices ? prices.split(",") : '';
    let price;
    if(price1 == "1" && !price2){
        price = `&price_lte=${price1 ? price1 : []}`;
    } else if (price1 == "4981" && !price2){
        price = `&price_gte=${price1 ? price1 : []}`;
    } else if (!price1 && !price2){
        price = "";
    }else {
        price = `&price_gte=${price1 ? price1 : []}${price2 ? `&price_lte=${price2}` : []}`;
    }
    let category_id ="?category_id=";
    if(cate.length) {
        category_id += cate.join("&category_id=");
    } else {
        category_id = "";
    }

    let searchProduct = valueSearch ? `&name_like=${valueSearch}` : "";
    // url = `products${category_id}${category_id ? type : type.replace("&", "?")}${ (category_id || type) ? brand : brand.replace("&", "?")}${(category_id  || type || brand) ? star : star.replace("&", "?")}${(category_id  || type || brand || star) ? price : price.replace("&", "?")}${ (category_id || type || brand || star || price) ? "&" : "?"}_page=${curentPage}&_limit=16`;
    url = `products${category_id}${category_id ? type : type.replace("&", "?")}${ (category_id || type) ? brand : brand.replace("&", "?")}${(category_id  || type || brand) ? star : star.replace("&", "?")}${(category_id  || type || brand || star) ? price : price.replace("&", "?")}${(category_id  || type || brand || star || price) ? searchProduct : searchProduct.replace("&", "?") }${ (category_id || type || brand || star || price || searchProduct) ? "&" : "?"}_page=${curentPage}&_limit=16`;
    return url;
}

export const getValInFilter = (filter) => {
    let category = filter[1]['category'];
    let type = filter[0]['type'];
    let brand = filter[2]['brand'];
    let star = filter[3]['star']?.star;
    let price = filter[4]['price']?.price;
    
    return {category, type, brand, star, price};
}

export const sortProducts = (keySort, arr, preProducts) => {
    if(keySort == 2){
        return arr.sort((a,b) => { return a.price - b.price});
    }
    if(keySort == 3){
       return arr.sort((a,b) => { return b.price - a.price});
    }
    if(keySort == 1){
       return arr = preProducts;
    }
}
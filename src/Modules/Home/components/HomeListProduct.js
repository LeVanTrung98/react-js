import { render } from '@testing-library/react';
import React from 'react'
import { useEffect, useState } from "react";
import { FetchData } from "../../../Commons/Api";
import Pagination  from './Pagination';

export default function HomeListProduct(props) {
    const [filter, setFilter] = useState([]);
    const [products, setProducts] = useState([]);
    const [brands, setBrand] = useState([]);
    const [preProducts, setPreProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState("");
    const [curentPage, setCurentPage] = useState(1);
    const [typeSort, setTypeSort] = useState(3);
    const [cateSelect, setCateSelect] = useState([{type : []}, {category : {}}, {brand : []}]);

    const GetURL = (curentPage, cate, types, brands, stars, prices) => {
        let url = '';
        let type = types.length > 0 ? types.reduce((result, item) => {
            return result += `&type=${parseInt(item.type)}`;
        }, "") : "";
        let brand = brands.length > 0 ? brands.reduce((result, item) => {
            return result += `&brand=${parseInt(item.brand)}`;
        }, "") : "";
        let star = stars ? `&rate=${stars}` : "";
        let [price1, price2] = prices ? prices.split(",") : '';
        let price;
        if(price1 == "1" && !price2){
            price = `&price_lte=${price1 ? price1 : []}`;
        } else if (price1 == "4981" && !price2){
            price = `&price_gte=${price1 ? price1 : []}`;
        }else {
            price = `&price_gte=${price1 ? price1 : []}${price2 ? `&price_lte=${price2}` : []}`;
        }
        let category_id ="?category_id=";
        if(cate.length) {
            category_id += cate.join("&category_id=");
        } else {
            category_id = "";
        }
        url = `products${category_id}${category_id ? type : type.replace("&", "?")}${ (category_id || type) ? brand : brand.replace("&", "?")}${(category_id  || type || brand) ? star : star.replace("&", "?")}${(category_id  || type || brand || star) ? price : price.replace("&", "?")}${ (category_id || type || brand || star || price) ? "&" : "?"}_page=${curentPage}&_limit=16`;
                               
        return url;
    }
    
    useEffect(() => {
        if(props.cateChange) {
            let category = props.cateChange[1]['category'];
            let type = props.cateChange[0]['type'];
            let brand = props.cateChange[2]['brand'];
            let star = props.cateChange[3]['star']?.star;
            let price = props.cateChange[4]['price']?.price;
            setCateSelect([ type, category, brand ]);

            let url = GetURL(curentPage, category, type, brand, star, price);
            ( 
                async () => {
                    try {
                        await FetchData(url)().then(res => {
                            let sort = sortProducts(typeSort, res.data);
                            setProducts(sort);
                            setTotalProducts(parseInt(res.headers["x-total-count"]));
                        });
                        await FetchData(`type`)().then(res => setBrand(res.data));
                    } catch (error) {
                        console.log(error);                    
                    }
                }
            )()
        }
        
    }, [props.cateChange]);

    const sortProducts = (keySort, arr) => {
        if(!preProducts || preProducts.length == 0){
           setPreProducts([...products]);
        }
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

    const handleSelectSort = (event) => {
        event.preventDefault();
        let status = event.target.value;
        setTypeSort(status);
        let sortASC = [...products];
        let sort = sortProducts(status, sortASC);
        setProducts(sort);
    }
    const handleChangePage = async (value) => {
        // let idCategory = filter[filter.length - 1]["category"];
        let category = cateSelect[1]["category"];
        let type = cateSelect[0]["type"];
        let brand = cateSelect[2]["brand"];
        console.log(category, type, brand)
        let url='';
        if(!category){
            url = `products?_page=${value}&_limit=16`;
        }else{
            url = GetURL(value, category, type, brand);
        }
        try {
            await FetchData(url)().then(res => {
                setCurentPage(parseInt(value));
                let sort = sortProducts(typeSort, res.data);
                setProducts(sort);
            });
        } catch (error) {
            console.log(error);
        }   
    }

    useEffect(()=> {
        ( 
            async() => {
                try {
                    let url = "products?_page=1&_limit=16";
                    await FetchData(url)().then(res => {
                        let sort = sortProducts(typeSort, res.data);
                        setProducts(sort);
                        setTotalProducts(res.headers["x-total-count"]);
                    });
                    await FetchData(`type`)().then(res => setBrand(res.data));
                } catch (error) {
                    console.log(error);                    
                }
            }
        )()
    }, [])
    return (
        <div className="right">
            <section className="right__top">
                <p className="right__show-result">
                    { totalProducts && totalProducts } results found in 2ms
                    </p>
                <div className="right__filter">
                    <span className="right__title"> Sort by</span>
                    <select onChange={ handleSelectSort } name="filter">
                        <option value={1}>Featured</option>
                        <option value={2}>Price Asc</option>
                        <option value={3}>Price Desc</option>
                    </select>
                </div>
            </section>
            <section className="right__content">
                {
                    products.length > 0 ? products.map(item => (
                        <div className="product" key={item.id}>
                            <img src={item.img} alt="" alt={item.name} className="product__img" />
                            <h2>
                                <a href="true" className="product__name">{item.name}</a>
                            </h2>
                            <span className="product__type">{
                                brands.map(brandItem => {
                                    if(brandItem.id ===  item.type){
                                        return brandItem.name;
                                    }
                                })
                           }</span>
                            {
                                item.rate === 4 ? (
                                    <div className="product__rating">
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="far fa-star"></i>
                                    </div>
                                ) : item.rate === 3 ? (
                                    <div className="product__rating">
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="far fa-star"></i>
                                        <i className="far fa-star"></i>
                                    </div>
                                ) : (
                                    <div className="product__rating">
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="far fa-star"></i>
                                        <i className="far fa-star"></i>
                                        <i className="far fa-star"></i>
                                    </div>
                                )
                            }
                           
                            <span className="product__price">
                                ${item.price}
                            </span>
                        </div>
                    )) : <div className="no-product">không có sản phẩm phù hợp</div>
                    
                }
              
            </section>
            {
                (totalProducts ) ? (
                    <Pagination handleChangePages={ handleChangePage } numberProducts={ totalProducts } curentPage={ curentPage } />
                ) : null
            }
        </div>
    )
}

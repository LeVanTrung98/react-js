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

    // function Url(category, type, brand,curentPage){
    //     return `products/${category}&type=${type}&brand=${brand}&_page=${curentPage}&_limit=16`;
    // }

    // function GetUrl(fn, values){
    //     return function(...vals){
    //         return fn(values, ...vals);
    //     };
    // }
    const GetURL = (curentPage, cate, types, brands) => {
        let url = '';
        if(!types.length && !brands.length){
            url = `products/${parseInt(cate.category)}&_page=${curentPage}&_limit=16`;
        } else if(types.length && !brands.length) {
            let value = types.reduce((result, item) => {
                return result += `&type=${parseInt(item.type)}`;
            }, "");
            url = `products/${parseInt(cate.category)}${value}&_page=${curentPage}&_limit=16`;
        }  else if(!types.length && brands.length) {
            let value = brands.reduce((result, item) => {
                return result += `&brand=${parseInt(item.brand)}`;
            }, "");
            url = `products/${parseInt(cate.category)}${value}&_page=${curentPage}&_limit=16`;
        } else if(types.length && brands.length) {
            let value = types.reduce((result, item) => {
                return result += `&type=${parseInt(item.type)}`;
            }, ""); 
            let valueBrand = brands.reduce((result, item) => {
                return result += `&brand=${parseInt(item.brand)}`;
            }, ""); 
            url = `products/${parseInt(cate.category)}${value}${valueBrand}&_page=${curentPage}&_limit=16`;
        } 
        return url;
    }
    
    useEffect(() => {
        if(props.cateChange) {
            let category = props.cateChange[1]['category'];
            let type = props.cateChange[0]['type'];
            let brand = props.cateChange[2]['brand'];
            setCateSelect([ type, category, brand ]);
            let url = GetURL(curentPage, category, type, brand);
            ( 
                async () => {
                    try {
                        await FetchData(url)().then(res => {
                            setProducts(res.data);
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
        console.log(cateSelect)
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
                                        <i className="fas fa-star-half-alt" />
                                    </div>
                                ) : item.rate === 3 ? (
                                    <div className="product__rating">
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star-half-alt" />
                                        <i className="fas fa-star-half-alt" />
                                    </div>
                                ) : (
                                    <div className="product__rating">
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star" />
                                        <i className="fas fa-star-half-alt" />
                                        <i className="fas fa-star-half-alt" />
                                        <i className="fas fa-star-half-alt" />
                                    </div>
                                )
                            }
                           
                            <span className="product__price">
                                ${item.price}
                            </span>
                        </div>
                    )) : <div>không có sản phẩm phù hợp</div>
                    
                }
              
            </section>
            {
                (totalProducts ) && (
                    <Pagination handleChangePages={ handleChangePage } numberProducts={ totalProducts } curentPage={ curentPage } />
                ) 
            }
        </div>
    )
}

import React from 'react'
import Pagination  from './Pagination';
import { GetURL, sortProducts } from '../../../Commons/Function';
import { useSelector, useDispatch } from "react-redux";
import { sort, updateProducts, ClickChangePage } from '../../../Redux/actions/home';
export default function HomeListProduct(props) {

    let dispatch = useDispatch();
    const totalProducts = useSelector(state => state.HOME.numberProducts);
    const curentPage = useSelector(state => state.HOME.curentPage);
    const preProducts = useSelector(state => state.HOME.preProducts);
    const listProducts = useSelector(state => state.HOME.products);
    const types = useSelector(state => state.HOME.types);
    let valueFilter = useSelector(state => state.HOME.filter);
    let allTypes = useSelector(state => state.HOME.allTypes);

    const handleSelectSort = (event) => {
        event.preventDefault();
        let status = event.target.value;

        dispatch(sort(parseInt(status)));
        
        let sortASC = [...listProducts];
        let sortProduct = sortProducts(status, sortASC, preProducts);
        dispatch(updateProducts(sortProduct));
    }

    const handleChangePage = async (value) => {
        let category = valueFilter[1]["category"];
        let type = valueFilter[0]["type"];
        let brand = valueFilter[2]["brand"];
        let url='';
        if(!category){
            url = `products?_page=${value}&_limit=16`;
        }else{
            url = GetURL(value, category, type, brand);
        }

        dispatch(ClickChangePage(value, url));
    }

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
                    listProducts.length > 0 ? listProducts.map(item => (
                        <div className="product" key={item.id}>
                            <img src={item.img} alt="" alt={item.name} className="product__img" />
                            <h2>
                                <a href="true" className="product__name">{item.name}</a>
                            </h2>
                            <span className="product__type">{
                                allTypes.map(brandItem => {
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

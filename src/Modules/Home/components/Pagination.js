import React from 'react';
import {useEffect, useState} from "react";

export default function Pagination(props) {
    const [pages, setPages] = useState([]);
    const [numberOfPage, setNumberOfPages] = useState(0)
    useEffect(() => {
        let page = Math.ceil(props.numberProducts / 16);
        setNumberOfPages(page);
        let curentPage = props.curentPage;
        let value = [];
        for(let i = 1; i <= page; i++){
            if(i == curentPage){
                value.push(
                    <li className="pagination__item" key={i}>
                        <p className="pagination__link pagination__link--active">{i}</p>
                    </li>
                )
            }else{
                value.push(
                    <li className="pagination__item" key={i}>
                        <a href="true" data-id={ i } onClick={ handleChangePage } className="pagination__link">{i}</a>
                    </li>
                )
            }
        }
        setPages(value);
    },[props.curentPage , props.numberProducts]);

    const handleChangePage = (event) => {
        event.preventDefault();
        let page = event.target.getAttribute("data-id");
        props.handleChangePages(page);
    }
    return (
        <section className="pagination">
            <ul className="pagination__list">
                {
                    (props.curentPage == 1) ? (
                        <li className="pagination__item pagination__item-btn">
                            <span className="pagination__link pagination__link--active">
                                <i className="fas fa-chevron-left" />
                                    Previous page
                                </span>
                        </li>
                    ): (
                        <li className="pagination__item pagination__item-btn">
                            <a href="true" data-id={ props.curentPage - 1 } onClick={ handleChangePage } className="pagination__link">
                                <i className="fas fa-chevron-left" />
                                    Previous page
                                </a>
                        </li>
                    )
                }
                { pages }
                {
                    (props.curentPage == numberOfPage) ? (
                        <li className="pagination__item pagination__item-btn">
                            <span className="pagination__link pagination__link--active">
                                Next page
                                    <i className="fas fa-chevron-right" />
                            </span>
                        </li>

                    ) : (
                        <li className="pagination__item pagination__item-btn">
                            <a href="true" data-id={ props.curentPage + 1 } onClick={ handleChangePage } className="pagination__link">
                                Next page
                                    <i className="fas fa-chevron-right" />
                            </a>
                        </li>
                    )
                }
            </ul>
        </section>
    )
}

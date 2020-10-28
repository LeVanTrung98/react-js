import React from 'react';
import './App.css';
import HomeFilter from './Modules/Home/components/HomeFilter';
import HomeListProduct from './Modules/Home/components/HomeListProduct';
import { useEffect, useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { loadPagesRequest, searchProducts, clickFilterRequest, loadUrlRequest} from './Redux/actions/home';
function App() {
	const dispatch = useDispatch();
	let valueSearch = useSelector(state => state.HOME.valueSearch);
	const searchProductsRef = useRef(null);
	const handleSearch = (event) => {
		event.preventDefault();
		let data = event.target.value;
		dispatch(searchProducts(data));
		dispatch(clickFilterRequest(data,'search'));
	}

	useEffect(() => {
		dispatch(loadPagesRequest('categories', 'products', "type", "brand"));
		dispatch(loadUrlRequest('GET_ALL_TYPES', 'type'));
	}, [] );

	return (
		<>
			<header className="header">
				<div className="container">
					<a href="true" className="ic-logo">
						<img src="https://community.algolia.com/instantsearch.js/v1/examples/e-commerce/logo-is.png" alt="logo" />
					</a>
					<h1>
						<a href="true" className="logo">amzing</a>
					</h1>
					<div className="search">
						<form action="" className="form-search">
							<input type="search" ref={searchProductsRef} onChange={ handleSearch } value={ valueSearch } className="inp-search" placeholder="Search a product" />
							<button type="submit" className="btn-search"><i className="fas fa-search" /></button>
						</form>
					</div>
				</div>
			</header>
			<main>
				<HomeFilter />
				<HomeListProduct /> 
			</main>
		</>
	);
}
export default App;

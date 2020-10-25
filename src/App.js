import React from 'react';
import './App.css';
// import "..assets/formatTreeView.css";

import HomeFilter from './Modules/Home/components/HomeFilter';
import HomeListProduct from './Modules/Home/components/HomeListProduct';
import { FetchData } from "./Commons/Api";
import { useEffect, useState } from "react";

function App(props) {
	const [categories, setCategories] = useState("");
	const [brand, setBrand] = useState("");
	const [type, setType] = useState("");
	const [products, setProducts] = useState("");
	const [childCateHander, setChildCateHander] = useState([{type : []}, {category : {}}, {brand : []}]);
	
	useEffect(() => {
		(async () => {
			await Promise.all([
				FetchData('categories')(),
				FetchData('products')()
			]).then( response => {
				setCategories(JSON.stringify(response[0].data));
				setProducts(JSON.stringify(response[1].data));
			});	
		})();	

	}, [] );

	const handleChangeCate = (value)=>{
		let key = Object.keys(value)[0];
		let val = [...childCateHander];
		if(key === "type"){
			let type =val[0].type;
			let check = type.findIndex(item => item.type == value.type);
			if(check === -1 ) {
				val[0].type = [ ...type ,value] 
			} else {
				val[0].type.splice(check,1);
			}
		}else if(key === "category") {
			val[0].type = [];
			val[2].brand = [];
			val[1].category = value;
		}
		else if(key === "brand") {
			let brand =val[2].brand;
			let check = brand.findIndex(item => item.brand == value.brand);
			if(check === -1 ) {
				val[2].brand = [ ...brand ,value] 
			} else {
				val[2].brand.splice(check,1);
			}
		}
		setChildCateHander(val);

	}

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
							<input type="search" className="inp-search" placeholder="Search a product" />
							<button type="submit" className="btn-search"><i className="fas fa-search" /></button>
						</form>
					</div>
				</div>
			</header>
			<main>
				<HomeFilter categories={categories} hander={handleChangeCate} />
				<HomeListProduct cateChange={childCateHander} /> 
			</main>
		</>
	);
}
export default App;

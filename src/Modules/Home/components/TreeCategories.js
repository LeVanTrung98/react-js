import React from 'react'
import { useEffect, useState } from "react";
import renderHTML from 'react-render-html';
export default function TreeCategories(props) {
    const [valueTree, setValueTree] = useState();
    const [valueData, setValueData] = useState();
    function onclickCategory(event) {
        event.preventDefault();
        console.log(123)
    }
        // const TreCategories = ({arr}) => {
    //     let convertArr = Object.values(arr);
    //     // let sortRootID = convertArr.sort((a, b) => (a.root_id - b.root_id )); 
    //     let rootId = convertArr.map(item => item.root_id);
    //     let set = new Set();
    //     let html = [];
    //     for (const item of rootId) {
    //         set.add(item);
    //     }
    //     for (const item of set) {
    //         let arrs = arr.filter(element => {
    //             if (item == element.root_id) {
    //                 return element;
    //             }
    //         });
    
    //         if (arrs.length > 1) {
    //             let cateVSParentID = arrs.filter(itemParent => itemParent.parent_id == item);
    //             let renderHtml = '';
    //             renderHtml = '<li class="category__item">';
    //             for (const itemParenID of cateVSParentID) {
    //                 if(item === itemParenID.id) {
    //                     renderHtml += `<a  href="true" onclick={onclickCategory} data-id=${itemParenID.id} class="category__link">
    //                     <i class="fas fa-chevron-right"> </i>
    //                     ${itemParenID.name}
    //                     </a> <ul class="category__list category__list-sub-menu">`;
    //                 } 
    //                 // else {
    //                 //     renderHtml += `<li class="category__item">
    //                 //     <a href="true" window.onclick="widow.onclickCategory()" class="category__link" data-id=${itemParenID.id} >
    //                 //         <i class="fas fa-chevron-right"></i>
    //                 //         ${itemParenID.name}
    //                 //     </a> <ul class="category__list category__list-sub-menu">
    //                 //     `;
    //                 // }
    //                 // if(itemParenID.id !== itemParenID.parent_id){
    //                 //     arrs.filter(itemArr => {
    //                 //         if (itemParenID.id === itemArr.parent_id) {
    //                 //             renderHtml += `<li class="category__item">
    //                 //                 <span onclick="window.onclickCategory()" class="category__link" data-id=${itemArr.id}>
    //                 //                     <i class="fas fa-chevron-right" > </i> 
    //                 //                     ${itemArr.name}
    //                 //                 </span>
    //                 //             </li>`;
    //                 //         }
    //                 //     });
    //                 //     renderHtml += "</ul>";
    //                 // }
    //             }
    //             renderHtml += "</ul></li>";
               
    //             html.push(ReactHtmlParser(renderHtml));

    //         } else {
    //             html.push(<li key={arrs[0].id} className="category__item">
    //             <a href="true" onClick={window.onclickCategory} data-id={arrs[0].id}   className="category__link">
    //                 <i className="fas fa-chevron-right" > </i>
    //                { arrs[0].name }
    //             </a>
    //         </li>)
    //         }
    //     }
    //     return html;
    // }

    useEffect(() => {
        let set = new Set();
        // let data = props.data && JSON.parse(props.data);
        // let convertArr = Object.values(data);
        // let rootId = convertArr.map(item => item.root_id);
        // for (const item of rootId) {
        //     set.add(item);
        // }
        // setValueTree(set);
        // setValueData(data);
        console.log(props.data)
    }, [props.data]);
    return (
        <ul className="category__list">
       
        </ul>
    )
}

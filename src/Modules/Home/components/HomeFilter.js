import React, { Children } from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import "../assets/formatTreeView.css";
import { FetchData } from "../../../Commons/Api";
const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400,
    },
  });
export default function HomeFilter(props) {
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [clear, setClear] = useState(false);
    const [typeCheck, setTypeCheck] = useState([])
    const [brand, setBrand] = useState([]);
    const [types, setTypes] = useState([]);
    let map = new Map();

    useEffect(() => {
        let data = props.categories && JSON.parse(props.categories);
        let convertArr = Object.values(data);
        let sortRootID = convertArr.sort((a, b) => (a.root_id - b.root_id )); 
        let rootId = convertArr.map(item => item.root_id);
        let set = new Set();
        for (const item of rootId) {
            set.add(item);
        }
        let idRoot;
        sortRootID.reduce((result, curent) => {
            if(curent.root_id == curent.id){
                idRoot = curent.id;
                let value = { id : curent.id, name : curent.name};
                map.set(curent.id, value );
            }else{
                if(curent.parent_id == idRoot && curent.id !== idRoot){
                    let key = curent.root_id;
                    let preVal = map.get(key)?.children?.[0];
                    let value;
                    let valTemp = {};
                    if(preVal){
                        valTemp = [ ...(map.get(key)?.children), {id : curent.id, name : curent.name }]
                        value ={...map.get(key), children : [ ...valTemp ] };
                    }else{
                        valTemp = {id : curent.id, name : curent.name};
                        value ={...map.get(key), children : [ {id : curent.id, name : curent.name} ] };
                    }
                    map.set(key, value);
                }else{
                    let key = curent.root_id;
                    let value = map.get(key);
                    let valueChild = value.children;
                    for (let i = 0; i < valueChild.length; i++) {
                        if( valueChild[i].id === curent.parent_id){
                            let value = valueChild[i].children && {...valueChild[i].children?.[1]}; 
                            valueChild[i] =  Object.assign({}, valueChild[i],  {children : [ value, { id : curent.id, name : curent.name}]} );
                        }
                    }
                }
            }
            return result = curent;
        }, {});

        let value = [];

        for(let  [item, val] of map) {
            value.push(val);
        }

        setCategories(value)
         
    }, [props.categories]);
    
    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id.toString()} label={nodes.name}>
          {Array.isArray(nodes.children) ? nodes.children.map((node) => node && renderTree(node)) : null}
        </TreeItem>
    );
    const handleChange =( async (event, nodes) =>{
        let text = event.target.textContent;
        event.preventDefault();
        let idCategory = nodes;
        let dataBrand = FetchData(`brand/${idCategory}`);
        let dataType = FetchData(`type/${idCategory}`);
        await Promise.all([
            dataBrand(),
            dataType()
        ]).then( response => {
            setBrand(response[0].data);
            setTypes(response[1].data)
        })
        setClear(true);
        props.hander({'category' : nodes});
    })
    const handClickClear = ((event) => {
        event.preventDefault();
    });

    // let storeCheckType = new Set();
    const handleSelectType = (event) => {
        // event.preventDefault();  
        let type = event.target.value;
        let name = event.target.getAttribute("name");
        props.hander({[name] : type})
        // valueCheck = parseInt(valueCheck)
        // let check = storeCheckType.has(valueCheck);
        // check ? storeCheckType.delete(valueCheck) :  storeCheckType.add(valueCheck);

    }

    useEffect(() => {
        (async () => {
            await Promise.all([
                FetchData('type?_limit=5')(),
                FetchData('brand?_limit=5')()
            ]).then( response => {
                setBrand(response[1].data);
                setTypes(response[0].data);
            });	
        })();	

    }, [] );

    return (
        <div className="left">
            <div className="container">
                { 
                    clear && (<button type="submit" onClick={ handClickClear } className="clear">
                                <i className="fas fa-redo-alt" />
                                <p>Clear all filters</p>
                            </button>)  
                }
                <div className="category">
                    <span className="category__title" style={{marginBottom : "7px", display : "block"}}>Show results for</span>
                    <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={handleChange}
                        >
                            {
                                categories.map(item =>{
                                    if(item.length > 0 || item !== "undefined"){
                                        return renderTree(item)
                                    }
                                })
                               
                            }
                        </TreeView>
                </div>
                <div className="refine">
                    <span className="refine__title" style={{marginTop : "20px"}}>Show results for</span>
                    {
                        (types.length > 0) && (
                            <div className="refine__type">
                                <span className="refine__title refine__title--format">Type</span>
                                <form action="" className="refine__form">
                                    {
                                        types.map(item => (
                                            <div className="form-group" key={ item.id }>
                                                <input type="checkbox"  onChange={ handleSelectType } id={"types"+item.id} value={ item.id } name="type" />
                                                <label htmlFor={"types"+item.id}>{ item.name }<span className="refine__number"> (132)</span></label>
                                            </div>
                                        ))
                                    }
                                </form>
                            </div>
                        )
                    }
                    {
                        brand && (
                            <div className="refine__brand">
                                <span className="refine__title refine__title--format">Brand</span>
                                <form action="" className="refine__form">
                                    <div className="form-group form-group-format">
                                        <i className="fas fa-search" />
                                        <input type="search" className="refine__inp-search" placeholder="Search for other..." />
                                    </div>
                                    {
                                        brand.map(item => (
                                            <div className="form-group" key={item.id}>
                                                <input type="checkbox" onChange={ handleSelectType } id={"brand"+item.id} value={item.id} name="brand" />
                                                <label htmlFor={"brand"+item.id}>{item.name}<span className="refine__number"> (132)</span></label>
                                            </div>
                                        ))
                                    }
                                </form>
                            </div>
                        ) 
                    }
                    <div className="refine__rating">
                        <span className="refine__title refine__title--format">Ratings</span>
                        <div className="refine__rating-block">
                            <div className="rating">
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="far fa-star" />
                            </div>
                            <span>&amp; Up 16, 075</span>
                        </div>
                        <div className="refine__rating-block">
                            <div className="rating">
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                            </div>
                            <span>&amp; Up 16, 075</span>
                        </div>
                        <div className="refine__rating-block">
                            <div className="rating">
                                <i className="fas fa-star" />
                                <i className="fas fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                            </div>
                            <span>&amp; Up 16, 075</span>
                        </div>
                        <div className="refine__rating-block">
                            <div className="rating">
                                <i className="fas fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                                <i className="far fa-star" />
                            </div>
                            <span>&amp; Up 16, 075</span>
                        </div>
                    </div>
                    <div className="refine__price">
                        <span className="refine__title refine__title--format">Prices</span>
                        <span className="refine__price--format">≤ &nbsp; 1</span>
                        <span className="refine__price--format">$1 -80</span>
                        <span className="refine__price--format">$80 - 160</span>
                        <span className="refine__price--format">$160 - 240 </span>
                        <span className="refine__price--format">$240 - 1,820 </span>
                        <span className="refine__price--format">$1,820 - 3,400 </span>
                        <span className="refine__price--format">$3,400 - 4,980</span>
                        <span className="refine__price--format">≥  &nbsp; $4,980</span>
                        <div className="refine__price-group">
                            <form action="">
                                <div className="form-group">
                                    <label >$</label>
                                    <input type="number" className="refine__price-inp" />
                                </div>
                                <p>to</p>
                                <div className="form-group">
                                    <label >$</label>
                                    <input type="number" className="refine__price-inp" />
                                </div>
                                <div className="btn-submit">
                                    <input type="submit" defaultValue="go" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="coppy-right">
                    <p>Data courtesy of Best Buy</p>
                </div>
            </div>
        </div>

    )
}

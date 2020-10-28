import React from 'react';
import { useState, useEffect, useMemo} from "react";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import "../assets/formatTreeView.css";
import { useSelector, useDispatch, useStore } from "react-redux";
import { createSelector } from "reselect";
import { clickFilterRequest, loadUrlRequest } from "../../../Redux/actions/home";
import { convertValueCategories, getChildCateClick, } from '../../../Commons/Function';
const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export default function HomeFilter(props) {
    const classes = useStyles();
    const [clear, setClear] = useState(false);

    const dispatch = useDispatch();
    
    const getCategories = useSelector(state => state.HOME.categories);
    let categories = getCategories ? convertValueCategories(getCategories) : [];
    let brands = useSelector(state => state.HOME.brands);
    let types = useSelector(state => state.HOME.types)
    // let abc = useMemo(() => categories, [categories])
    console.log(categories)

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id.toString()} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => node && renderTree(node)) : null}
        </TreeItem>
    );
    const handleChange = (async (event, nodes) => {
        event.preventDefault();
        
        dispatch(loadUrlRequest('type', `type/${nodes}`));
        dispatch(loadUrlRequest('brand', `brand/${nodes}`));
        
        setClear(true);

        let data = getCategories;
        let getChildId = getChildCateClick(data, nodes);

        dispatch(clickFilterRequest(getChildId, "category"));
    })

    const handClickClear = ((event) => {
        event.preventDefault();
        window.location.reload();
    });

    const handleSelectType = (event) => {
        let type = event.target.value;
        let name = event.target.getAttribute("name");
        dispatch(clickFilterRequest(type, name));
    }

    const handleClickStar = (event) => {
        event.preventDefault();
        let data = event.target.getAttribute("data-id");
        dispatch(clickFilterRequest(data, "star"));
    }

    const handleClickPrice = (event) => {
        event.preventDefault();
        let data = event.target.getAttribute("data-id");
        dispatch(clickFilterRequest(data, "price"));
    }

    return (
        <div className="left">
            <div className="container">
                {
                    clear && (<button type="submit" onClick={handClickClear} className="clear">
                        <i className="fas fa-redo-alt" />
                        <p>Clear all filters</p>
                    </button>)
                }
                <div className="category">
                    <span className="category__title" style={{ marginBottom: "7px", display: "block" }}>Show results for</span>
                    <TreeView
                        className={classes.root}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpanded={['root']}
                        defaultExpandIcon={<ChevronRightIcon />}
                        onNodeSelect={handleChange}
                    >
                        {
                            categories.map(item => {
                                if (item.length > 0 || item !== "undefined") {
                                    return renderTree(item)
                                }
                            })

                        }
                    </TreeView>
                </div>
                <div className="refine">
                    <span className="refine__title" style={{ marginTop: "20px" }}>Show results for</span>
                    {
                        (types.length > 0) && (
                            <div className="refine__type">
                                <span className="refine__title refine__title--format">Type</span>
                                <form action="" className="refine__form">
                                    {
                                        types.map(item => (
                                            <div className="form-group" key={item.id}>
                                                <input type="checkbox" onChange={handleSelectType} id={"types" + item.id} value={item.id} name="type" />
                                                <label htmlFor={"types" + item.id}>{item.name}</label>
                                            </div>
                                        ))
                                    }
                                </form>
                            </div>
                        )
                    }
                    {
                        brands && (
                            <div className="refine__brand">
                                <span className="refine__title refine__title--format">Brand</span>
                                <form action="" className="refine__form">
                                    <div className="form-group form-group-format">
                                        <i className="fas fa-search" />
                                        <input type="search" className="refine__inp-search" placeholder="Search for other..." />
                                    </div>
                                    {
                                        brands.map(item => (
                                            <div className="form-group" key={item.id}>
                                                <input type="checkbox" onChange={handleSelectType} id={"brand" + item.id} value={item.id} name="brand" />
                                                <label htmlFor={"brand" + item.id}>{item.name}</label>
                                            </div>
                                        ))
                                    }
                                </form>
                            </div>
                        )
                    }
                    <div className="refine__rating">
                        <span className="refine__title refine__title--format">Ratings</span>
                        <div className="refine__rating-block" >
                            <a href="true" onClick={handleClickStar} data-id="4" className="rating">
                                <i className="fas fa-star" data-id="4" />
                                <i className="fas fa-star" data-id="4" />
                                <i className="fas fa-star" data-id="4" />
                                <i className="fas fa-star" data-id="4" />
                                <i className="far fa-star" data-id="4" />
                                &nbsp;
                                <span data-id="4">&amp; Up 16, 075</span>
                            </a>
                        </div>
                        <div className="refine__rating-block">
                            <a href="true" onClick={handleClickStar} data-id="3" className="rating">
                                <i className="fas fa-star" data-id="3" />
                                <i className="fas fa-star" data-id="3" />
                                <i className="fas fa-star" data-id="3" />
                                <i className="far fa-star" data-id="3" />
                                <i className="far fa-star" data-id="3" />
                                &nbsp;
                                <span data-id="3">&amp; Up 16, 075</span>
                            </a>
                        </div>
                        <div className="refine__rating-block">
                            <a href="true" onClick={handleClickStar} data-id="2" className="rating">
                                <i className="fas fa-star" data-id="2" />
                                <i className="fas fa-star" data-id="2" />
                                <i className="far fa-star" data-id="2" />
                                <i className="far fa-star" data-id="2" />
                                <i className="far fa-star" data-id="2" />
                                &nbsp;
                                <span data-id="2">&amp; Up 16, 075</span>
                            </a>
                        </div>
                        <div className="refine__rating-block">
                            <a href="true" onClick={handleClickStar} data-id="1" className="rating">
                                <i className="fas fa-star" data-id="1" />
                                <i className="far fa-star" data-id="1" />
                                <i className="far fa-star" data-id="1" />
                                <i className="far fa-star" data-id="1" />
                                <i className="far fa-star" data-id="1" />
                                &nbsp;
                                <span data-id="1">&amp; Up 16, 075</span>
                            </a>
                        </div>
                    </div>
                    <div className="refine__price">
                        <a href="true" className="refine__title refine__title--format">Prices</a>
                        <a href="true" onClick={handleClickPrice} data-id="1" className="refine__price--format">≤ &nbsp; 1</a>
                        <a href="true" onClick={handleClickPrice} data-id="2,80" className="refine__price--format">$1 - 80</a>
                        <a href="true" onClick={handleClickPrice} data-id="80,160" className="refine__price--format">$80 - 160</a>
                        <a href="true" onClick={handleClickPrice} data-id="160,240" className="refine__price--format">$160 - 240 </a>
                        <a href="true" onClick={handleClickPrice} data-id="240,1.820" className="refine__price--format">$240 - 1,820 </a>
                        <a href="true" onClick={handleClickPrice} data-id="1.820,3.400" className="refine__price--format">$1,820 - 3,400 </a>
                        <a href="true" onClick={handleClickPrice} data-id="3.400,4.980" className="refine__price--format">$3,400 - 4,980</a>
                        <a href="true" onClick={handleClickPrice} data-id="4981" className="refine__price--format">≥  &nbsp; $4,980</a>
                        <div className="refine__price-group">
                            <form action="">
                                <div className="form-group">
                                    <label >$</label>
                                    <input type="number" className="refine__price-inp" />
                                </div>
                                <p>&nbsp;to &nbsp;</p>
                                <div className="form-group">
                                    <label >$</label>
                                    <input type="number" className="refine__price-inp" />
                                </div>
                                <div className="btn-submit">
                                    <input type="submit" value="Go" />
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

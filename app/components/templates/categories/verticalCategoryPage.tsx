import React, { useState, useEffect } from 'react';
import { useDispatch, useStore, connect } from 'react-redux';
import ScrollingNavigation from '@module/topScrolleingNavigation';
import VerticalListing from "@module/verticalListing";
import Link from 'next/link';
// for Accordion starts
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Item from '@element/horizontalItem';
// for Accordion ends
function VerticalCategoryPage({ url_Segment, storeData, gender }) {

    const [activeGroup, setActiveGroup] = useState(null)
    const [activeCuratedCategory, setActiveCuratedCategory] = useState(null)

    useEffect(() => {
        storeData.curatedGroups.map((groupData) => {
            groupData.curatedCategories.map((categoryData) => {
                if (categoryData.name.toLowerCase() == url_Segment) {
                    categoryData.isSelected = true;
                    setActiveCuratedCategory(categoryData);
                    setActiveGroup({ ...groupData });
                }
            })
        })
    }, [url_Segment])

    const onClickTolScrollNav = (category) => {
        setActiveCuratedCategory(category);
        document.getElementById(category.name).scrollTop = 10;
    }

    return (
        <>
            {/* <div className="common-grey-boder"></div> */}
            {activeGroup ? <div className="categorypageContainer">
                {/* <ScrollingNavigation items={activeGroup.curatedCategories} config={{}} handleClick={(item) => onClickTolScrollNav(item)} activeCuratedCategory={activeCuratedCategory} /> */}
                {activeGroup.curatedCategories && activeGroup.curatedCategories.map((curetedCategoryData, curatedCatIndex) => {
                    const categoryData = curetedCategoryData?.curatedItems[0]?.categoryDetails;
                    return <div className="category-data-wrap clearfix" key={curatedCatIndex}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls=""
                                id={curetedCategoryData.name}>
                                <div className="category-name">{curetedCategoryData.name}</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                {curetedCategoryData.entityType == 'category' ?
                                    <div className="fullwidth">
                                        {categoryData?.hasSubcategory ?
                                            <div className="fullwidth">
                                                {categoryData?.categoryList.map((subCategoryData, subCatIndex) => {
                                                    return <div key={subCatIndex} className="sub-cat-wrap">
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls=""
                                                                id="">
                                                                <div className="category-name sub-category-name">{subCategoryData.name}</div>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {subCategoryData.hasSubcategory ? <div>
                                                                    {subCategoryData?.categoryList.map((subSubCategoryData, subSubCatIndex) => {
                                                                        return <div key={subSubCatIndex}>
                                                                            <div className="category-name sub-category-name">{subSubCategoryData.name}</div>
                                                                            {subSubCategoryData.hasSubcategory ? <div>
                                                                            </div> : <div className="list-block">
                                                                                    {
                                                                                        subSubCategoryData?.itemList.map((item, itemIndex) => {
                                                                                            return <div key={itemIndex}>
                                                                                                <Item item={item} config={{}} />
                                                                                            </div>
                                                                                        })
                                                                                    }
                                                                                </div>}
                                                                        </div>
                                                                    })}
                                                                </div> : <div className="list-block">
                                                                        {
                                                                            subCategoryData?.itemList.map((item, itemIndex) => {
                                                                                return <div key={itemIndex}>
                                                                                    <Item item={item} config={{}} />
                                                                                </div>
                                                                            })
                                                                        }
                                                                    </div>}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                })}
                                            </div> :
                                            <div className="fullwidth without-subcat-item">
                                                {
                                                    categoryData?.itemList.map((item, itemIndex) => {
                                                        return <div key={itemIndex}>
                                                            <Item item={item} config={{}} />
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }
                                    </div>
                                    : <>
                                        {activeCuratedCategory.entityType === 'items' && <div className="content-wrap">
                                            {curetedCategoryData?.curatedItems.map((item, itemIndex) => {
                                                return <div key={itemIndex}>
                                                    <Item item={item} config={{}} />
                                                </div>
                                            })}
                                            {/* <VerticalListing itemsList={curetedCategoryData?.curatedItems} type={activeCuratedCategory.type} /> */}
                                        </div>}
                                        <div className="common-grey-boder"></div>
                                    </>}
                            </AccordionDetails>
                        </Accordion>
                        {/* <div className="common-grey-boder"></div> */}
                    </div>
                })}
            </div> : null}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        storeData: state?.store?.storeData
    }
}

export default connect(mapStateToProps)(VerticalCategoryPage);

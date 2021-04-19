import React, { useState, useEffect } from 'react';
// for Accordion starts
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// for Accordion ends
import ScrollingNavigation from '@module/topScrolleingNavigation';
import SquareGrid from "@module/squareGrid";
import VerticalListing from "@module/verticalListing";
import { SUB_CAT_NO_IMAGE } from "@constant/noImage";
import Link from 'next/link';
import Item from '@element/horizontalItem';
import ImageGallery from 'react-image-gallery';
import router from 'next/router';

function AllCategoryPage({ url_Segment, storeData, gender, type }) {

    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [isThirdLevelCategoryAvl, setIsThirdLevelCategoryAvl] = useState(false);
    useEffect(() => {
        setActiveSubCategory(null);
        setIsThirdLevelCategoryAvl(null);
        setActiveCategory(null);
        let categoryDataFromUrl = null;
        storeData.categories.map((categoryData, categoryIndex) => {
            if (categoryData.name.toLowerCase() == url_Segment && categoryData.showOnUi) {
                categoryData.isSelected = true;
                categoryDataFromUrl = categoryData;
                setActiveCategory(categoryData);
                if (categoryData.hasSubcategory) {
                    const isAnySubCatWithSubCat = categoryData.categoryList.filter((cat) => cat.hasSubcategory);
                    if (isAnySubCatWithSubCat.length != 0) setIsThirdLevelCategoryAvl(true);
                    else setIsThirdLevelCategoryAvl(false)
                } else setIsThirdLevelCategoryAvl(false)
            }
            if (categoryIndex == storeData.categories.length - 1 && !categoryDataFromUrl) {
                // active category not found by url name
                // console.log('category not found');
                const avlActiveCat = storeData.categories.filter((cat) => cat.showOnUi && cat.type == type);
                if (avlActiveCat.length != 0) {
                    // console.log('first category set');
                    setActiveCategory(avlActiveCat[0]);
                } else router.push('/');
            }
        })
    }, [url_Segment])

    const getPromotionalBanner = (category) => {
        const categoriesPromotionBannerArray = [];
        if (category && category.hasSubcategory && category.categoryList) {
            let imagePathsArray = [];
            category.categoryList.map((catData, catIndex) => {
                imagePathsArray = [...imagePathsArray, ...catData.imagePaths];
                if (catIndex == category.categoryList.length - 1) {
                    imagePathsArray.map((imagObj) => {
                        categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
                    })
                }
            })
        } else {
            if (category && !category.hasSubcategory && category.itemList) {
                let imagePathsArray = [];
                category.itemList.map((itemData, catIndex) => {
                    imagePathsArray = [...imagePathsArray, ...itemData.imagePaths];
                    if (catIndex == category.itemList.length - 1) {
                        imagePathsArray.map((imagObj) => {
                            categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
                        })
                    }
                })
            }
        }
        const settings = {
            showThumbnails: false,
            showPlayButton: false,
            showBullets: (categoriesPromotionBannerArray && categoriesPromotionBannerArray.length) > 1 ? true : false,
            autoPlay: true,
            slideDuration: 800,
            slideInterval: 3000,
            startIndex: 0,
            showNav: false,
            showFullscreenButton: false
        }
        return <div className="promotional-banner">
            <ImageGallery items={categoriesPromotionBannerArray} {...settings} />
        </div>
    }
    return (
        <>
            <div className="categorypageContainer">
                <ScrollingNavigation items={storeData.categories} config={{ from: 'all', type }} handleClick={(item) => setActiveCategory(item)} activeCategory={activeCategory} />
                {activeCategory && <div>
                    {isThirdLevelCategoryAvl ?
                        <div className="fullwidth">
                            {activeSubCategory ?
                                <>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ArrowDropDownIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className="accor-title">{activeSubCategory.name}</div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="boxlayout">
                                                <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }} handleClick={(category) => setActiveSubCategory(category)} />
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                    <>

                                        {activeSubCategory.hasSubcategory ? <div>
                                            {getPromotionalBanner(activeSubCategory)}
                                            {activeSubCategory?.categoryList?.map((category, index) => {
                                                return <div key={index} className="service-list-cover">
                                                    <div className="list-block">
                                                        <div className="ser-list-title">{category.name}</div>
                                                        {category?.itemList?.map((item, itemIndex) => {
                                                            return <div key={itemIndex}>
                                                                <Item item={item} config={{}} />
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            })}
                                        </div> :
                                            <div className="fullwidth without-subcat-item">
                                                {getPromotionalBanner(activeSubCategory)}
                                                {
                                                    activeSubCategory?.itemList?.map((item, itemIndex) => {
                                                        return <div key={itemIndex} className="service-list-cover">
                                                            <Item item={item} config={{}} />
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        }
                                    </>

                                </>
                                :
                                <div className="subcat-cover clearfix">
                                    <div className="boxlayout">
                                        <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={activeCategory.categoryList} config={{ withShadow: false }} handleClick={(category) => setActiveSubCategory(category)} />
                                    </div>
                                </div>
                            }
                        </div> :
                        <>
                            {activeCategory.hasSubcategory ? <div>
                                {getPromotionalBanner(activeCategory)}
                                {activeCategory?.categoryList?.map((category, index) => {
                                    return <div key={index} className="service-list-cover">
                                        <div className="list-block">
                                            <div className="ser-list-title">{category.name}</div>
                                            {category?.itemList?.map((item, itemIndex) => {
                                                return <div key={itemIndex}>
                                                    <Item item={item} config={{}} />
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div> :
                                <div className="fullwidth without-subcat-item">
                                    {getPromotionalBanner(activeCategory)}
                                    <div className="service-list-cover">
                                        {
                                            activeCategory?.itemList?.map((item, itemIndex) => {
                                                return <div key={itemIndex}>
                                                    <Item item={item} config={{}} />
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>}
                {/* <div className="common-grey-boder"></div> */}
            </div>
        </>
    );
}

export default AllCategoryPage;

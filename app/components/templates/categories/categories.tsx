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
import { useRouter } from 'next/router';
import Item from "@element/horizontalItem";
import HeadMetaTags from "@module/headMetaTags";
import ImageGallery from 'react-image-gallery';

function CategoryPage({ url_Segment, storeData, gender }) {

  const router = useRouter()
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeCuratedCategory, setActiveCuratedCategory] = useState(null)
  const [mappedCategories, setMappedCategories] = useState(null);
  const [itemsWithoutCategoryList, setItemsWithoutCategoryList] = useState(null);
  const [baseSubCategories, setBaseSubCategories] = useState(null);
  const [categoriesWithItems, setCategoriesWithItems] = useState(null);
  const [categoriesPromotionBanner, setCategoriesPromotionBanner] = useState(null);
  const [subCuratedCategories, setSubCuratedCategories] = useState(null);
  const [activeBaseCategory, setActiveBaseCategory] = useState(null);
  const [activeSubCuratedCategory, setActiveSubCuratedCategory] = useState(null);
  const [curatedItemsList, setCuratedItemsList] = useState(null);

  const settings = {
    showThumbnails: false,
    showPlayButton: false,
    showBullets: (categoriesPromotionBanner && categoriesPromotionBanner.length) > 1 ? true : false,
    autoPlay: true,
    slideDuration: 800,
    slideInterval: 3000,
    startIndex: 0,
    showNav: false,
    showFullscreenButton: false
  }

  const getCategoryData = () => {
    let categoryDataFromUrl = null;
    let categoryGroupDataFromUrl = null;
    storeData.curatedGroups.map((groupData, groupDataIndex) => {
      if (!categoryDataFromUrl) {
        groupData.curatedCategories.map((categoryData) => {
          if (!categoryDataFromUrl) {
            if (categoryData.name.toLowerCase() == url_Segment) {
              categoryData.showOnUi && (categoryData.isSelected = true);
              categoryGroupDataFromUrl = groupData;
              categoryDataFromUrl = categoryData;
            }
          }
        })
      }
      if (groupDataIndex == storeData.curatedGroups.length - 1) {
        if (categoryDataFromUrl && categoryDataFromUrl.showOnUi) {
          categoryGroupDataFromUrl.curatedCategories.map((data) => (data.name == categoryDataFromUrl.name) && (data.isSelected = true));
          setActiveCuratedCategory(categoryDataFromUrl);
          setActiveGroup({ ...categoryGroupDataFromUrl });
        } else {
          // active category not found by url name
          // console.log('category not found');
          if (categoryGroupDataFromUrl) {
            const avlActiveCat = categoryGroupDataFromUrl.curatedCategories.filter((cat) => cat.showOnUi);
            if (avlActiveCat.length != 0) {
              // console.log('first category set');
              categoryGroupDataFromUrl.curatedCategories.map((data) => (data.name == avlActiveCat[0].name) && (data.isSelected = true));
              setActiveCuratedCategory(avlActiveCat[0]);
              setActiveGroup({ ...categoryGroupDataFromUrl });
            }
            // else router.push('/');
          }
          else router.push('/');
        }
      }
    })
  }
  useEffect(() => {
    getCategoryData();
  }, [url_Segment, gender, storeData])

  useEffect(() => {
    if (activeCuratedCategory && activeCuratedCategory.name) {
      if (activeCuratedCategory.entityType === 'category') {
        setMappedCategories(null);
        setItemsWithoutCategoryList(null);
        setCategoriesPromotionBanner(null);
        setCategoriesWithItems(null);
        setSubCuratedCategories(null);
        setActiveBaseCategory(null);
        setActiveSubCuratedCategory(null);
        const mappedCategories = activeCuratedCategory.curatedItems;
        mappedCategories.map((mappedCategory) => {
          storeData.categories.map((storeCategory) => {
            if (storeCategory.name === mappedCategory.name) {
              mappedCategory.categoryDetails = storeCategory;
            } else {
              if (storeCategory.hasSubcategory) {
                storeCategory.categoryList.map((subCategory) => {
                  if (subCategory.name === mappedCategory.name) {
                    mappedCategory.categoryDetails = subCategory;
                  } else {
                    if (subCategory.hasSubcategory) {
                      subCategory.categoryList.map((subSubCategory) => {
                        if (subSubCategory.name === mappedCategory.name) {
                          mappedCategory.categoryDetails = subSubCategory;
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        })
        setTimeout(() => {
          const categoryList = [];
          mappedCategories.map((catData) => {
            const category = { ...catData.categoryDetails, ...catData };
            delete category.categoryDetails;
            categoryList.push(category);
          })
          setMappedCategories(categoryList);
        }, 100);
      } else if (activeCuratedCategory.entityType === 'items') {
        setCuratedItemsList(activeCuratedCategory.curatedItems);
      }
    }
  }, [activeCuratedCategory])

  useEffect(() => {
    if (mappedCategories && mappedCategories.length == 1) {
      prepareActiveCategoryData(mappedCategories[0], 'Base', 'first-load');
    } else {
      setSubCuratedCategories(mappedCategories);
    }
  }, [mappedCategories]);

  const prepareActiveCategoryData = (category, from, status = null) => {
    setCategoriesWithItems(null);
    if (category.hasSubcategory) {
      const isAnySubSubCategoryAvl = category.categoryList.filter((catData) => catData.hasSubcategory);
      if (isAnySubSubCategoryAvl.length) {
        setBaseSubCategories(category.categoryList);
        setItemsWithoutCategoryList(null);
        setCategoriesPromotionBanner(null);
        // setCategoriesWithItems(null);
      } else {
        setItemsWithoutCategoryList(null);
        setCategoriesPromotionBanner(null);
        if (category.categoryList) {
          let imagePathsArray = [];
          category.categoryList.map((catData, catIndex) => {
            imagePathsArray = [...imagePathsArray, ...catData.imagePaths];
            if (catIndex == category.categoryList.length - 1) {
              const categoriesPromotionBannerArray = [];
              imagePathsArray.map((imagObj) => {
                categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
              })
              setCategoriesPromotionBanner(categoriesPromotionBannerArray);
            }
          })
        }
        setCategoriesWithItems(category.categoryList);
      }
    } else {
      //direct items list
      if (from === 'Curated') {
        setBaseSubCategories(null);
        setActiveBaseCategory(null);
      }
      if (category.itemList) {
        let imagePathsArray = [];
        category.itemList.map((itemData, catIndex) => {
          imagePathsArray = [...imagePathsArray, ...itemData.imagePaths];
          if (catIndex == category.itemList.length - 1) {
            const categoriesPromotionBannerArray = [];
            imagePathsArray.map((imagObj) => {
              categoriesPromotionBannerArray.push({ original: imagObj.imagePath, thumbnail: imagObj.imagePath, alt: 'Promotional', bulletClass: 'slider-bullet' })
            })
            setCategoriesPromotionBanner(categoriesPromotionBannerArray);
          }
        })
      }
      setItemsWithoutCategoryList(category.itemList);
    }
    if (from === 'Curated') {
      setActiveSubCuratedCategory(category);
      subCuratedCategories && subCuratedCategories.map((cat) => {
        if (cat.name === category.name) cat.isSelected = true;
        else cat.isSelected = false;
      })
      baseSubCategories && baseSubCategories.map((cat) => cat.isSelected = false)
    } else {
      status !== 'first-load' && setActiveBaseCategory(category);
      baseSubCategories && baseSubCategories.map((cat) => {
        if (cat.name === category.name) cat.isSelected = true;
        else cat.isSelected = false;
      })
    }
  }

  return (
    <>
      {activeGroup ? <div className="categorypageContainer">
        {activeCuratedCategory && <HeadMetaTags title={activeCuratedCategory.name} siteName='' description={activeCuratedCategory.description} image={activeCuratedCategory.imagePaths && activeCuratedCategory?.imagePath ? activeCuratedCategory.imagePath : ''} />}
        <ScrollingNavigation items={activeGroup.curatedCategories} config={{}} handleClick={(item) => setActiveCuratedCategory(item)} activeCategory={activeCuratedCategory} />
        {activeCuratedCategory?.entityType === 'category' && <div className="content-wrap clearfix">
          <>
            {subCuratedCategories && <div className="fullwidth">
              {activeSubCuratedCategory ?
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="accor-title">{activeSubCuratedCategory.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="boxlayout">
                      <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={subCuratedCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Curated')} />
                    </div>
                  </AccordionDetails>
                </Accordion> :
                <div className="subcat-cover clearfix">
                  <div className="boxlayout">
                    <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={subCuratedCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Curated')} />
                  </div>
                </div>
              }
            </div>}
          </>

          <>
            {(subCuratedCategories ? activeSubCuratedCategory : true && baseSubCategories) && <div className="fullwidth">
              {activeBaseCategory ?
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="accor-title">{activeBaseCategory.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="boxlayout">
                      <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={baseSubCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Base')} />
                    </div>
                  </AccordionDetails>
                </Accordion> :
                <div className="subcat-cover clearfix">
                  <div className="boxlayout">
                    <SquareGrid noImage={SUB_CAT_NO_IMAGE} items={baseSubCategories} config={{ withShadow: false }} handleClick={(category) => prepareActiveCategoryData(category, 'Base')} />
                  </div>
                </div>
              }
            </div>}
          </>

          {/* categoriesPromotionBanner */}
          {categoriesPromotionBanner &&
            <div className="promotional-banner">
              <ImageGallery items={categoriesPromotionBanner} {...settings} />
            </div>}

          {/* categoriesWithItems */}
          <div className="category-with-item">
            {categoriesWithItems &&
              categoriesWithItems.map((category, catIndex) => {
                return <div key={catIndex}>
                  {category.showOnUi && <div className="service-list-cover">
                    <div className="list-block">
                      <div className="ser-list-title">{category.name}</div>
                      {
                        category.itemList && category.itemList.map((item, itemIndex) => {
                          return <div key={itemIndex}>
                            <Item item={item} config={{}} />
                          </div>
                        })
                      }
                    </div>
                  </div>}
                </div>
              })
            }
          </div>

          {/* itemsWithoutCategoryList */}
          {itemsWithoutCategoryList && <div className="service-list-cover">
            {itemsWithoutCategoryList.map((item, itemIndex) => {
              return <div key={itemIndex}>
                <Item item={item} config={{}} />
              </div>
            })
            }
          </div>}

        </div>}

        {activeCuratedCategory.entityType === 'items' && <div className="content-wrap">
          {curatedItemsList.map((item, itemIndex) => {
            return <div key={itemIndex}>
              <Item item={item} config={{}} />
            </div>
          })}
          {/* <VerticalListing itemsList={curatedItemsList} type={activeCuratedCategory.type} /> */}
        </div>}
        {/* <div className="common-grey-boder"></div> */}
      </div> : null}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    storeData: state?.store?.storeData
  }
}

// export default connect(mapStateToProps)(CategoryPage);
export default CategoryPage;

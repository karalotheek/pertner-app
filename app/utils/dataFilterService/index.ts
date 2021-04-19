const validateItemDayDateTime = (item) => {
    let currentDate = new Date();
    let currentday = currentDate.toLocaleString('en-us', { weekday: 'long' }).substring(0, 3);
    let isValidtiming = false;
    let isValidDate = false;
    let isValidDay = false;

    if (item.fromTime && item.toTime) {

        let itemFromTimeDate = new Date();
        const [fhr, fmin] = item.fromTime.split(':');
        itemFromTimeDate.setHours(fhr);
        itemFromTimeDate.setMinutes(fmin);

        let itemToTimeDate = new Date();
        const [thr, tmin] = item.toTime.split(':');
        itemToTimeDate.setHours(thr);
        itemToTimeDate.setMinutes(tmin);

        if (itemFromTimeDate <= new Date() && new Date() <= itemToTimeDate) {
            isValidtiming = true;
        }
    } else isValidtiming = true;

    if (item.fromDate && item.toDate) {

        let itemFromDate = new Date(item.fromDate);
        let itemToDate = new Date(item.todate);

        if (itemFromDate <= new Date() && new Date() <= itemToDate) {
            isValidDate = true;
        }
    } else isValidDate = true;

    if (item.days) {
        if (item.days.toLowerCase() == 'all') isValidDay = true;
        else if (item.days.includes(currentday)) isValidDay = true;
    } else isValidDay = true;

    return new Promise((res, rej) => {
        if (isValidDate && isValidDay && isValidtiming) res(true);
        else res(false);
    })
}

const filterItemsList = (itemsList, categoryCheck, gender) => {
    return new Promise((res, rej) => {
        if (itemsList && itemsList.length != 0) {
            itemsList && itemsList.map(async (item, itemIndex) => {
                item.showOnUi = await validateItemDayDateTime(item);
                if (item.active && item.showOnUi && categoryCheck) {
                    if (item.variations) {
                        item.variations.map((variant, variantIndex) => {
                            if (variant.considerGroup && variant.group ? ((variant.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (variant.group.toLowerCase() === gender.toLowerCase())) : true) {
                                variant.showOnUi = true;
                            } else variant.showOnUi = false;
                            if (variant.variations && !variant.considerGroup) {

                                variant.variations.map((subVariant) => {
                                    if (subVariant.considerGroup && subVariant.group ? ((subVariant.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (subVariant.group.toLowerCase() === gender.toLowerCase())) : true) {
                                        subVariant.showOnUi = true;
                                    } else subVariant.showOnUi = false;

                                    if (subVariant.variations && !subVariant.considerGroup) {
                                        subVariant.variations.map((subSubVariant) => {
                                            if (subSubVariant.considerGroup && subSubVariant.group ? ((subSubVariant.group.toLowerCase() === 'all' || gender.toLowerCase() === 'all') ? true : (subSubVariant.group.toLowerCase() === gender.toLowerCase())) : true) {
                                                subSubVariant.showOnUi = true;
                                            } else subSubVariant.showOnUi = false;
                                        })
                                        const isAnySubSubVariantAvl = subVariant.variations.filter((variantItem) => variantItem.showOnUi);
                                        if (isAnySubSubVariantAvl.length == 0) subVariant.showOnUi = false;
                                        else subVariant.showOnUi = true;
                                    }
                                })
                                const isAnySubVariantAvl = variant.variations.filter((variantItem) => variantItem.showOnUi);
                                if (isAnySubVariantAvl.length == 0) variant.showOnUi = false;
                                else variant.showOnUi = true;
                            }
                            if (variantIndex == item.variations.length - 1) {
                                const isAnyVariantAvl = item.variations.filter((variantItem) => variantItem.showOnUi);
                                if (isAnyVariantAvl.length == 0) item.showOnUi = false;
                                else item.showOnUi = true;
                            }
                        })
                    } else {
                        //if variations not presents then do not apply gender filter
                        item.showOnUi = true;
                    }
                } else {
                    //if item inactive then do not show it on UI
                    item.showOnUi = false;
                }
                if (itemIndex == itemsList.length - 1) {
                    const isAnyItemAvl = itemsList.filter((itemData) => itemData.showOnUi);
                    if (isAnyItemAvl.length == 0) res(false);
                    else res(true);
                }
            })
        } else res(true) //if item not present in category
    })
}

const filterCategoriesList = async (storeData, gender) => {
    return new Promise((res, rej) => {
        const storeCategoriesCopy = storeData.categories;
        storeCategoriesCopy.map(async (storeCategory, storeCategoryIndex) => {
            storeCategory.showOnUi = storeCategory.active ? true : false;
            storeCategory.showOnUi = await validateItemDayDateTime(storeCategory);
            if (storeCategory.hasSubcategory) {
                storeCategory.categoryList.map(async (subCategory, subCategoryIndex) => {
                    subCategory.showOnUi = (subCategory.active && storeCategory.showOnUi) ? true : false;
                    subCategory.showOnUi = await validateItemDayDateTime(subCategory);
                    if (subCategory.hasSubcategory) {
                        subCategory.categoryList.map(async (subSubCategory, subSubCategoryIndex) => {
                            //if any parent category is inactive
                            subSubCategory.showOnUi = (subSubCategory.active && subCategory.showOnUi) ? true : false;
                            subSubCategory.showOnUi = await validateItemDayDateTime(subSubCategory);
                            filterItemsList(subSubCategory.itemList, subSubCategory.showOnUi, gender).then((result) => {
                                subSubCategory.showOnUi = subSubCategory.showOnUi ? result : false;
                                if (subSubCategoryIndex == subCategory.categoryList.length - 1) {
                                    const isAnySubSubCategoryAvl = subCategory.categoryList.filter((categoryItem) => categoryItem.showOnUi);
                                    if (isAnySubSubCategoryAvl.length == 0) subCategory.showOnUi = false;
                                    else if (subCategory.showOnUi) subCategory.showOnUi = true;

                                    const isAnySubCategoryAvl = storeCategory.categoryList.filter((categoryItem) => categoryItem.showOnUi);
                                    if (isAnySubCategoryAvl.length == 0) storeCategory.showOnUi = false;
                                    else if (storeCategory.showOnUi) storeCategory.showOnUi = true;
                                }
                            })
                        })
                    } else {
                        filterItemsList(subCategory.itemList, subCategory.showOnUi, gender).then((result) => {
                            subCategory.showOnUi = subCategory.showOnUi ? result : false;
                            if (subCategoryIndex == storeCategory.categoryList.length - 1) {
                                const isAnySubCategoryAvl = storeCategory.categoryList.filter((categoryItem) => categoryItem.showOnUi);
                                if (isAnySubCategoryAvl.length == 0) storeCategory.showOnUi = false;
                                else if (storeCategory.showOnUi) storeCategory.showOnUi = true;
                            }
                        })
                    }
                })
            } else {
                filterItemsList(storeCategory.itemList, storeCategory.showOnUi, gender).then((result) => {
                    storeCategory.showOnUi = result ? storeCategory.showOnUi : false;
                })
            }
            if (storeCategoryIndex == storeCategoriesCopy.length - 1) res(storeCategoriesCopy);
        })
    })
}

const getCategoryDetails = (filteredCategories, curatedItemData) => {
    return new Promise((res, rej) => {
        filteredCategories.map((storeCategory) => {
            if (storeCategory.name === curatedItemData.name) {
                curatedItemData.categoryDetails = storeCategory;
                res(curatedItemData);
            } else {
                if (storeCategory.hasSubcategory) {
                    storeCategory.categoryList.map((subCategory) => {
                        if (subCategory.name === curatedItemData.name) {
                            curatedItemData.categoryDetails = subCategory;
                            res(curatedItemData);
                        } else {
                            if (subCategory.hasSubcategory) {
                                subCategory.categoryList.map((subSubCategory) => {
                                    if (subSubCategory.name === curatedItemData.name) {
                                        curatedItemData.categoryDetails = subSubCategory;
                                        res(curatedItemData);
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    })
}

const getItemsList = (filteredCategories) => {
    let itemsList = [];
    filteredCategories.map((category) => {
        if (category.hasSubcategory) {
            category.categoryList.map((subCategory) => {
                if (subCategory.hasSubcategory) {
                    subCategory.categoryList.map((subSubCategory) => {
                        subSubCategory.itemList && (itemsList = [...itemsList, ...subSubCategory.itemList]);
                    })
                } else subCategory.itemList && (itemsList = [...itemsList, ...subCategory.itemList]);
            })
        } else category.itemList && (itemsList = [...itemsList, ...category.itemList]);
    })
    return itemsList;
}

//filter curated group on the basis of gender
export const prepareStoreData = (storeData, gender) => {
    return new Promise((res, rej) => {
        if (storeData && storeData.storeId && gender) {
            const storeCopy = storeData;
            filterCategoriesList(storeCopy, gender).then((filteredCategories) => {
                storeCopy.categories = filteredCategories;
                storeCopy.itemsList = getItemsList(filteredCategories);
                storeCopy.curatedGroups && storeCopy.curatedGroups.map((curatedGroupData, curatedGroupDataIndex) => {
                    curatedGroupData.curatedCategories && curatedGroupData.curatedCategories.map((curatedCategoryData, curatedCategoryDataIndex) => {
                        curatedCategoryData.curatedItems && curatedCategoryData.curatedItems.map((curatedItemData, curatedItemDataIndex) => {
                            if (curatedCategoryData.entityType === 'category') {
                                getCategoryDetails(filteredCategories, curatedItemData).then((data) => {
                                    curatedItemData = data;
                                    if (curatedItemData?.categoryDetails?.hasSubcategory) {
                                        curatedItemData.categoryDetails.categoryList && curatedItemData.categoryDetails.categoryList.map((subCategory) => {          //subCategory curatedItemData.categoryDetails 2nd level
                                            if (subCategory.hasSubcategory) {
                                                subCategory.categoryList && subCategory.categoryList.map((subSubCategory) => {          //subsubCategory curatedItemData.categoryDetails 3rd level
                                                    if (subSubCategory.hasSubcategory) {
                                                        // console.log()
                                                    } else {
                                                        curatedGroupData.showOnUi = curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi = subCategory.showOnUi = subSubCategory.showOnUi;
                                                    }
                                                })
                                            } else {
                                                curatedGroupData.showOnUi = curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi = subCategory.showOnUi;
                                            }
                                        })
                                    } else {
                                        curatedGroupData.showOnUi = curatedCategoryData.showOnUi = curatedItemData.categoryDetails.showOnUi;
                                    }
                                })
                            } else if (curatedCategoryData.entityType === 'items') {
                                const itemDataFromFilterItems = storeCopy.itemsList.filter((filterItem) => filterItem.name == curatedItemData.name);
                                curatedItemData.showOnUi = itemDataFromFilterItems.length != 0 ? itemDataFromFilterItems[0].showOnUi : false;
                            } else if (curatedCategoryData.entityType === 'images') {
                                curatedItemData.showOnUi = true;
                                curatedCategoryData.showOnUi = true;
                            }
                            if (curatedItemDataIndex == curatedCategoryData.curatedItems.length - 1) {
                                const isAnyCuratedItemAvl = curatedCategoryData.curatedItems && curatedCategoryData.curatedItems.filter((curatedItem) => curatedItem.showOnUi);
                                if (isAnyCuratedItemAvl && isAnyCuratedItemAvl.length != 0) curatedCategoryData.showOnUi = true;
                                else curatedCategoryData.showOnUi = false;
                            }
                        })
                        if (curatedCategoryDataIndex == curatedGroupData.curatedCategories.length - 1) {
                            const isAnyCuratedCatAvl = curatedGroupData.curatedCategories.filter((curatedCat) => curatedCat.showOnUi);
                            if (isAnyCuratedCatAvl && isAnyCuratedCatAvl.length != 0) curatedGroupData.showOnUi = true;
                            else curatedGroupData.showOnUi = false;
                        }
                    })
                })
            })
            setTimeout(() => {
                res(storeCopy);
            }, 100);
        }
    })
}

export const getMetaTagsData = async (storeData, urlQuery) => {
    return new Promise((res, rej) => {
        const metaTags = {
            title: '',
            description: '',
            image: '',
            siteName: '',
        }
        //get meta tags data
        let current_page_url: any = urlQuery.pagepath[0];  //single folder routing /category
        if (urlQuery.pagepath.length == 2) current_page_url = urlQuery.pagepath[1]; //multi folder routing /category/product
        if (current_page_url.includes('-grp')) { //for all pdp urls
            current_page_url = current_page_url.split('-grp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            if (storeData.curatedGroups) {
                const groupData = storeData?.curatedGroups?.filter((group) => group.name.toLowerCase() === current_page_url);
                if (groupData && groupData.length) {
                    metaTags.title = groupData[0].pTitle || groupData[0].name;
                    metaTags.siteName = groupData[0].siteName || null;
                    metaTags.description = groupData[0].pDescription || groupData[0].description;
                    metaTags.image = groupData[0].pImage || (groupData[0].imagePaths && groupData[0]?.imagePaths?.length != 0 ? groupData[0].imagePaths[0].imagePath : '');
                }
                res(metaTags);
            }
        } else if (current_page_url.includes('-pdp')) { //for all pdp urls
            current_page_url = current_page_url.split('-pdp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            if (storeData.itemsList) {
                const item = storeData?.itemsList?.filter((storeItem) => storeItem.name.toLowerCase() === current_page_url);
                if (item && item.length) {
                    metaTags.title = item[0].pTitle || item[0].name;
                    metaTags.siteName = item[0].siteName || null;
                    metaTags.description = item[0].pDescription || item[0].description;
                    metaTags.image = item[0].pImage || (item[0].imagePaths && item[0]?.imagePaths?.length != 0 ? item[0].imagePaths[0].imagePath : '');
                }
                res(metaTags);
            }
        } else if (current_page_url.includes('-prp') || current_page_url.includes('-srp')) {

            // for all/our services and all/our products urls
            current_page_url = current_page_url.split('-prp')[0];
            if (current_page_url.includes('-srp')) current_page_url = current_page_url.split('-srp')[0];
            current_page_url = current_page_url.split("-").join(" ");
            const category = storeData?.categories?.filter((storeCategory) => storeCategory.name.toLowerCase() === current_page_url);
            if (category && category.length) {
                metaTags.title = category[0].pTitle || category[0].name;
                metaTags.siteName = category[0].siteName || null;
                metaTags.description = category[0].pDescription || category[0].description;
                metaTags.image = category[0].pImage || (category[0].icon ? category[0].icon : category[0].imagePaths && category[0]?.imagePaths?.length != 0 ? category[0].imagePaths[0].imagePath : '');
            }
            res(metaTags);
        } else {
            current_page_url = current_page_url.split("-").join(" ");
            //for curated category urls
            let categoryDataFromUrl = null;
            let categoryGroupDataFromUrl = null;
            storeData.curatedGroups.map((groupData, groupDataIndex) => {
                if (!categoryDataFromUrl) {
                    groupData.curatedCategories.map((categoryData) => {
                        if (!categoryDataFromUrl) {
                            if (categoryData.name.toLowerCase() == current_page_url) {
                                categoryGroupDataFromUrl = groupData;
                                categoryDataFromUrl = categoryData;
                            }
                        }
                    })
                }
                if (groupDataIndex == storeData.curatedGroups.length - 1 || categoryDataFromUrl) {
                    // if (categoryDataFromUrl && categoryDataFromUrl.showOnUi) {
                    if (categoryDataFromUrl) {
                        const category = categoryDataFromUrl;
                        if (category) {
                            metaTags.title = category.pTitle || category.name;
                            metaTags.siteName = category.siteName || null;
                            metaTags.description = category.pDescription || category.description;
                            metaTags.image = category.pImage || (category.icon ? category.icon : category.imagePath);
                        }
                        res(metaTags);
                    } else {
                        // active category not found by url name
                        // console.log('category not found');
                        if (categoryGroupDataFromUrl) {
                            const avlActiveCat = categoryGroupDataFromUrl.curatedCategories.filter((cat) => cat.showOnUi);
                            if (avlActiveCat.length != 0) {
                                // console.log('first category set');
                                const category = avlActiveCat[0];
                                if (category) {
                                    metaTags.title = category.pTitle || category.name;
                                    metaTags.siteName = category.siteName || null;
                                    metaTags.description = category.pDescription || category.description;
                                    metaTags.image = category.pImage || (category.icon ? category.icon : category.imagePath);
                                }
                                res(metaTags);
                            }
                        }
                    }
                }
            })
        }
    })

}
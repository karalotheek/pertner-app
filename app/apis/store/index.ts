import data from "@constant/dummy";
import { GET_STORE_BY_STORE_ID } from "@constant/api";
import { prepareStoreData } from "@util/dataFilterService";

export const getStoreData = (gender) => {
    const STORE_ID = 1;

    //use data store from local file
    // return new Promise((res, rej) => {
    //     prepareStoreData(data, gender).then((response) => {
    //         res(response);
    //     })
    // })

    // use data store from mongo service
    return new Promise((res, rej) => {
        const fetchPromise = fetch(`${GET_STORE_BY_STORE_ID}/${STORE_ID}`);
        fetchPromise
            .then((response) => {
                const apiPromise = response.json();
                apiPromise.then((data) => {
                    prepareStoreData(data, gender).then((response) => {
                        res(response);
                    })
                })
                // res(data);
            }).catch(function (error) {
                rej(error);
                console.log("error");
            });
    });
};

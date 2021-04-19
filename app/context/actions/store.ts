import { UPDATE_STORE_DATA, UPDATE_STORE_ITEMS_LIST } from "@constant/store";

function updateStoreData(payload) {
    return { type: UPDATE_STORE_DATA, payload };
}

function updateStoreItems(payload) {
    return { type: UPDATE_STORE_ITEMS_LIST, payload };
}

export { updateStoreData, updateStoreItems };
import { UPDATE_STORE_DATA, REMOVE_STORE_DATA, UPDATE_STORE_ITEMS_LIST } from '@constant/store';

export function store(state: any = {}, action) {
    switch (action.type) {
        case UPDATE_STORE_DATA:
            return { ...state, storeData: action.payload };
        case REMOVE_STORE_DATA:
            return { ...state, storeData: null };
        case UPDATE_STORE_ITEMS_LIST:
            return { ...state, storeData: { ...state.storeData, itemsList: action.payload } };
        default:
            return state;
    }
}

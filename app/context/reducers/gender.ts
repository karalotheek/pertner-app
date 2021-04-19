import { UPDATE_GENDER_STATUS } from '@constant/gender';

export function gender(state: any = '', action) {
    switch (action.type) {
        case UPDATE_GENDER_STATUS:
            return (action.payload);
        default:
            return state;
    }
}

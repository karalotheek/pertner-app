import { UPDATE_GENDER_STATUS } from "@constant/gender";

function updateGenderStatus(payload) {
    return { type: UPDATE_GENDER_STATUS, payload };
}

export { updateGenderStatus };
/**
 * This function will detect the useragent is Mobile or not.
 */

import {isMobile} from 'react-device-detect';
export const DetectMob = () => {
    if (isMobile) {
        return true;
    } else {
        return false;
    }
}

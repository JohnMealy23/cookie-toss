import { IframeRouteEndpoint } from '../types'
import { setWithExpiry } from './localStorageUtils'
import { REQUEST_TYPE_RESPONSE } from '../constants'

export const setData: IframeRouteEndpoint = (config) => {
    const { cookieName, data } = config
    let expires
    if ('expires' in config) {
        expires = config.expires
    }

    const savedDate = setWithExpiry(cookieName, data, expires)

    return {
        type: REQUEST_TYPE_RESPONSE,
        cookie: config.cookieName,
        data: savedDate
    }
}

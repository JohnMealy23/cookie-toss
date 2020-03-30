import { IframeRouteEndpoint } from '../common/types'
import { setWithExpiry } from './localStorageUtils'
import { REQUEST_TYPE_RESPONSE } from '../common/constants'

export const setData: IframeRouteEndpoint = (config) => {
    if (!('data' in config)) {
        throw new Error(`Must include a data payload in calls to setData with ${config.dataKey} dataKey`)
    }
    const { dataKey, data } = config
    let expires
    if ('expires' in config) {
        expires = config.expires
    }

    const savedDate = setWithExpiry(dataKey, data, expires)

    return {
        type: REQUEST_TYPE_RESPONSE,
        dataKey: config.dataKey,
        data: savedDate
    }
}

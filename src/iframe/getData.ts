import { IframeRouteEndpoint, AppConfig } from '../types'
import { getWithExpiry } from './localStorageUtils'
import { REQUEST_TYPE_RESPONSE } from '../constants'

export const getData: IframeRouteEndpoint = ({ dataKey }: AppConfig) => {
    return {
        type: REQUEST_TYPE_RESPONSE,
        dataKey: dataKey,
        data: getWithExpiry(dataKey)
    }
}

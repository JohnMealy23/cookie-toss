import { IframeRouteEndpoint, AppConfig } from '../common/types'
import { getWithExpiry } from './localStorageUtils'
import { REQUEST_TYPE_RESPONSE } from '../common/constants'

export const getData: IframeRouteEndpoint = ({ dataKey }: AppConfig) => {
    return {
        type: REQUEST_TYPE_RESPONSE,
        dataKey: dataKey,
        data: getWithExpiry(dataKey)
    }
}

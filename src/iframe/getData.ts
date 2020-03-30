import { IframeRouteEndpoint, AppConfig } from "../types"
import { getWithExpiry } from "./localStorageUtils"
import { REQUEST_TYPE_RESPONSE } from "../constants"

export const getData: IframeRouteEndpoint = ({ cookieName }: AppConfig) => {
    return {
        type: REQUEST_TYPE_RESPONSE,
        cookie: cookieName,
        data: getWithExpiry(cookieName)
    }
}

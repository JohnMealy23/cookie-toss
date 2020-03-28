import * as cookie from 'js-cookie'
import { IframeRouteEndpoint } from '../types'
import { getResponseKey } from '../utils'

export const getCookie: IframeRouteEndpoint = async ({ cookieName }) => ({
    key: getResponseKey(cookieName),
    data: cookie.get(cookieName) || null
})

export const setCookie: IframeRouteEndpoint = async (config) => {

    const { cookieName, data } = config

    // Get expiration data if it was sent:
    let expires
    if ('expires' in config) {
        expires = config.expires
    }

    // Stringify the value if need be:
    let value
    try {
        value = JSON.stringify(data)
    } catch (e) {
        value = `${data}`
    }

    // Save the cookie and reply:
    cookie.set(cookieName, value, { expires })
    return {
        key: getResponseKey(cookieName),
        data: value
    }
}

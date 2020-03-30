import { IframeRouteEndpoint, CookieConfig, IframeResponse } from '../types';
import { getWithExpiry, setWithExpiry } from './localStorageUtils';
import { REQUEST_TYPE_RESPONSE } from '../constants';

/**
 * This factory wraps the user-defined data getter.  This wrapper
 * takes care of the cookie-ing/cookie retrieval, as well as calls
 * to the user-defined data getter.  One of these endpoints will
 * be created per cookie.
 */

export const iframeEndpointFactory = (
    { handler, cookieName, expires }: CookieConfig
) => {

    // Create the logic that sits at a particular endpoint within
    // the iframe:
    const endpoint: IframeRouteEndpoint = async (config) => {

        const type = REQUEST_TYPE_RESPONSE
        let response: IframeResponse

        try {
            let data

            if ('resetCookie' in config && config.resetCookie) {
                // Remove cookie if dictated by app request:
                localStorage.removeItem(cookieName)
            } else {
                // Attempt to get cached data:
                data = getWithExpiry(cookieName)
            }

            if (!data) {
                // If no cached data, retrieve it from the
                // user-defined getter and cache it:
                data = await handler(config.data);
                if (data) {
                    setWithExpiry(cookieName, data, expires)
                }
            }

            if (data) {
                // If we successfully retrieved the data, relay
                // it back to the requesting application:
                response = { type, cookie: cookieName, data }
            } else {
                // Uh-oh.  No data.  Report this to the
                // requesting application:
                const error = `Failed to retrieve the ${cookieName} cookie from the iframe. Please confirm the cookie getter returns a value in every case.`
                response = { type, cookie: cookieName, error }
            }

        } catch (error) {
            // Shit appears to have gone sideways. Report this
            // to the requesting application:
            response = { type, cookie: cookieName, error }
        }
        return response
    }

    return endpoint
}

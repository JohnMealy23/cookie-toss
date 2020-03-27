import { getResponseKey } from '../utils';
import { IframeRouteEndpoint, CookieConfig, IframeResponse } from '../types';
import * as cookie from 'js-cookie'

/**
 * This factory wraps the user-defined data getter.  This wrapper
 * takes care of the cookie-ing/cookie retrieval, as well as calls
 * to the user-defined data getter.  One of these endpoints will
 * be created per cookie.
 */

export const iframeEndpointFactory = (
    { dataGetter, cookieName, expires }: CookieConfig
) => {

    // Create the logic that sits at a particular endpoint within
    // the iframe:
    const endpoint: IframeRouteEndpoint = async (requestDataPayload) => {

        const key = getResponseKey(cookieName)
        let response: IframeResponse

        try {
            // Attempt to get cached data:
            let dataStr = cookie.get(cookieName)

            if (!dataStr) {
                // If no cached dataStr, retrieve it from the
                // user-defined getter and cache it:
                dataStr = await dataGetter(requestDataPayload);
                if (dataStr) {
                    cookie.set(cookieName, dataStr, { expires })
                }
            }

            if (dataStr) {
                // If we successfully retrieved the dataStr, relay
                // it back to the requesting application:
                response = { key, data: dataStr }
            } else {
                // Uh-oh.  No data.  Report this to the
                // requesting application:
                const error = `Failed to retrieve the ${cookieName} cookie from the iframe. Please confirm the cookie getter returns a value in every case.`
                response = { key, error }
            }

        } catch (error) {
            // Shit appears to have gone sideways. Report this
            // to the requesting application:
            response = { key, error }
        }
        return response
    }

    return endpoint
}

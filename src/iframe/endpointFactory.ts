import { IframeRouteEndpoint, DataConfig, IframeResponse } from '../common/types';
import { getWithExpiry, setWithExpiry } from './localStorageUtils';
import { REQUEST_TYPE_RESPONSE } from '../common/constants';

/**
 * This factory wraps the user-defined data getter.  This wrapper
 * takes care of the data localStorage management for each user-defined
 * `DataConfig` object passed into `createIframe`.
 *
 * One of these endpoints will be created per user-defined localStorage
 * value.  Each is added to the routes of the iframe, and await calls
 * from the application.
 */

export const iframeEndpointFactory = (
    { handler, dataKey, expires }: DataConfig
) => {

    // Create the logic that sits at a particular endpoint within
    // the iframe:
    const endpoint: IframeRouteEndpoint = async (config) => {
        let response: IframeResponse
        let data

        if ('resetData' in config && config.resetData) {
            // Remove value if dictated by app request:
            localStorage.removeItem(dataKey)
        } else {
            // Attempt to get cached data:
            data = getWithExpiry(dataKey)
        }

        if (!data) {
            // If no cached data, retrieve it from the
            // user-defined getter and cache it.

            // If the user relayed a handlerPayload from the
            // application, pass this along:
            let handlerPayload
            if ('handlerPayload' in config) {
                handlerPayload = config.handlerPayload
            }
            try {
                data = await handler(handlerPayload);
            } catch (e) {
                throw new Error(`Something went wrong in the custom handler for ${dataKey} data request: ${e.message}`)
            }
            if (data) {
                setWithExpiry(dataKey, data, expires)
            }
        }

        if (data) {
            // If we successfully retrieved the data, relay
            // it back to the requesting application:
            response = { type: REQUEST_TYPE_RESPONSE, dataKey, data }
        } else {
            // Uh-oh.  No data.  Report this to the
            // requesting application:
            throw new Error(`Failed to retrieve the ${dataKey} data from the iframe. Please confirm the DataConfig handler returns a value in every case.`)
        }

        return response
    }

    return endpoint
}

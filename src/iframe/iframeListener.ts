import {
    IframeRoutes,
    IframeListener,
    DependentDomains,
    AppRequest,
    IframeResponse,
    AppConfig,
    IframeRouteEndpoint
} from '../common/types';
import { getHostname } from '../common/urlUtils';
import { REQUEST_TYPE_SET, REQUEST_TYPE_GET, REQUEST_TYPE_RESPONSE } from '../common/constants';

/**
 * In this file we create the single listener for the iframe.
 * Once a message is posted to the iframe, this file receives
 * it, ensures the sender is on the list of dependent sites,
 * then routes the request to the proper data getter.
 */

export const setIframeListener = (
    routes: IframeRoutes,
    dependentDomains: DependentDomains
) => {
    const iframeListener: IframeListener = async ({ origin, data: appRequestPayload }) => {
        const requesterBaseDomain = getHostname(origin);

        // If this request came from one of our own, process it:
        if (dependentDomains.includes(requesterBaseDomain)) {
            let requestSpecs
            try {
                // Retrieve the key and data from the request:
                requestSpecs = JSON.parse(appRequestPayload) as AppRequest;
            } catch (e) {
                // Guess it wasn't one of ours.
                // Logging here might not be a bad idea, but also might get noisy
                // if ads and whatnot started emitting to this iframe.
                return
            }

            const { type, config } = requestSpecs

            // Determine the endpoint the request is destined for:
            let endpoint
            if (type === REQUEST_TYPE_SET) {
                // The app has requested to set a data value:
                endpoint = routes[config.dataKey] || routes[REQUEST_TYPE_SET]
            } else {
                // The app has requested to get a data value.
                // Check if there is a custom data getter for
                // this data, or use the generic getter, if not.
                endpoint = routes[config.dataKey] || routes[REQUEST_TYPE_GET]
            }

            // Execute the handler for the endpoint:
            const response = await executeRoute(endpoint, config)

            // Emit the result back to the host application:
            window.parent.postMessage(JSON.stringify(response), origin);

        }
    };
    window.addEventListener('message', iframeListener, false);
}

const executeRoute = async (endpoint: IframeRouteEndpoint, config: AppConfig): Promise<IframeResponse> => {
    let response
    try {
        response = await endpoint(config);
    } catch (e) {
        response = composeErrorResponse(config.dataKey, e.message)
    }
    return response
}

const composeErrorResponse = (dataKey: string, errorMessage: string) => ({
    type: REQUEST_TYPE_RESPONSE,
    dataKey: dataKey,
    error: errorMessage
})

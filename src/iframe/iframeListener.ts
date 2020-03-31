import {
    IframeRoutes,
    IframeListener,
    DependentDomains,
    AppRequest,
    IframeResponse,
    AppConfig,
    IframeRouteEndpoint,
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

        // This is the filter, to ensure only requests from white-listed domains
        // have access to the hub domain's data. If this request came from one of
        // the domains on the user-defined dependent list, allow it access.
        if (dependentDomains.includes(requesterBaseDomain)) {

            let type
            let config
            try {

                // Retrieve the key and data from the request:
                const requestSpecs: AppRequest = JSON.parse(appRequestPayload);
                config = requestSpecs.config
                type = requestSpecs.type

            } catch (e) {

                // Guess it wasn't one of ours.
                // Logging here might not be a bad idea, but also might get noisy
                // if ads and whatnot started emitting to this iframe.
                return

            }

            // Retrieve the proper handler:
            const handler = getEndpoint(type, config.dataKey, routes)
            if (!handler) {
                return
            }

            // Execute the handler for the handler:
            const response = await executeRoute(handler, config)

            // Emit the result back to the host application:
            window.parent.postMessage(JSON.stringify(response), origin);

        }
    };

    // Add the event listener to start tracking the calls:
    window.addEventListener('message', iframeListener, false);

}

// Determine the handler the request is destined for:
const getEndpoint = (
    requestType: string,
    dataKey: string,
    routes: IframeRoutes
): IframeRouteEndpoint | null => {

    let handler

    if (requestType === REQUEST_TYPE_SET) {

        // The app has requested to set a data value:
        handler = routes[REQUEST_TYPE_SET]

    } else if (routes[dataKey]) {

        // There is a custom handler set up for this `dataKey`.
        handler = routes[dataKey]

    } else if (requestType === REQUEST_TYPE_GET) {

        // This is a generic get request, without a custom handler.
        handler = routes[REQUEST_TYPE_GET]

    } else {

        // The `requestType` of this request wasn't valid.  The request wasn't
        // intended for us.
        handler = null

    }

    return handler
}

// Attempt to execute the handler for this request, and record the error
// for it if anything goes awry:
const executeRoute = async (handler: IframeRouteEndpoint, config: AppConfig): Promise<IframeResponse> => {

    let response

    try {
        response = await handler(config);
    } catch (e) {
        response = composeErrorResponse(config.dataKey, e.message)
    }

    return response
}

// Structure an error response:
const composeErrorResponse = (dataKey: string, errorMessage: string) => ({
    type: REQUEST_TYPE_RESPONSE,
    dataKey: dataKey,
    error: errorMessage
})

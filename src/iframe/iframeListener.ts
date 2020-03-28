import { IframeRoutes, IframeListener, DependentDomains, AppRequest, IframeResponse, RequestTypes } from '../types';
import { getBaseDomain } from '../utils';

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
        const requesterBaseDomain = getBaseDomain(origin);

        // If this request came from one of our own, process it:
        if (dependentDomains.includes(requesterBaseDomain)) {

            try {
                // Retrieve the key and data from the request:
                const { key, type, config } = JSON.parse(appRequestPayload) as AppRequest;

                let response: IframeResponse

                if (type === RequestTypes['REQUEST_TYPE_SET']) {

                    // The app has requested to set a cookie value:
                    const endpoint = routes[key] || routes[RequestTypes['REQUEST_TYPE_SET']]
                    response = await endpoint(config)

                } else {

                    // The app has requested to get a cookie value.
                    // Check if there is a custom data getter for
                    // this cookie, or use the generic getter, if not.
                    const endpoint = routes[key] || routes[RequestTypes['REQUEST_TYPE_GET']]
                    response = await endpoint(config);

                }

                // Emit the result back to the host application:
                window.parent.postMessage(JSON.stringify(response), origin);
            } catch (e) {
                // Guess it wasn't one of ours.
                // Logging here might not be a bad idea, but also might get noisey
                // if ads and whatnot started emitting to this iframe.
            }

        }
    };
    window.addEventListener('message', iframeListener, false);
}

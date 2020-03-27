import { IframeRoutes, IframeListener, DependentDomains, AppRequest, IframeResponse } from '../types';
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
        if (requesterBaseDomain in dependentDomains) {

            try {
                // Retrieve the key and data from the request:
                const { key, data } = JSON.parse(appRequestPayload) as AppRequest;

                // Use the key to determine which cookie endpoint the requester is
                // intending to call:
                const endpoint = routes[key]

                // Retrieve the cookie value:
                const response: IframeResponse = await endpoint(data);

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

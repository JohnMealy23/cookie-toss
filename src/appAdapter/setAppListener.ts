import { getBaseDomain, getResponseKey } from "../utils";
import { IframeResponse } from "types";

/**
 * Here we create the listening functions that will receive cookie-specific
 * requests within the iframe, retrieve the data via the user-defined data-
 * getter, cookie said data, then return it to the requesting application.
 */

interface ListenerSpecs {
    origin: string;
    data: string;
};

type Listener = (specs: ListenerSpecs) => void;

export const setAppListener = <Data>(
    cookieName: string,
    iframeUrl: string,
    resolve: (data: Data) => void,
    reject: (err: Error) => void,
): Listener => {

    // Create a listener, which will await iframe responses
    const listener: Listener = ({ origin, data: maybeIframePayload }) => {

        // Attempt to parse payload:
        let response
        try {
            response = JSON.parse(maybeIframePayload) as IframeResponse;
        } catch (e) {
            // Leaving this catch empty, as a log here can get bombarded with
            // errors from post requests made by ads, etc.
            return
        }

        const requesterBaseDomain = getBaseDomain(origin);
        const expectedBaseDomain = getBaseDomain(iframeUrl);

        if (
            // Ensure the caller is the main site's iframe
            requesterBaseDomain === expectedBaseDomain &&
            // and that the path is intended for this module
            response.key === getResponseKey(cookieName)
        ) {
            // Clean up:
            window.removeEventListener('message', listener);

            if ('error' in response) {
                // Uh-oh! Something went wrong! Relay error to caller:
                reject(new Error(`Error received from ${cookieName} cookie request! ${response.error}`))
            } else if (!('data' in response) || !response.data) {
                reject(new Error(`No data received from ${cookieName} cookie request!`))
            } else {
                // Success! Relay the data to the caller:
                let result
                try {
                    result = JSON.parse(response.data)
                } catch (e) {
                    result = response.data
                }
                resolve(result as Data);
            }
        }
    };

    // Set the listener a-listenin':
    window.addEventListener('message', listener, false);

    return listener
}

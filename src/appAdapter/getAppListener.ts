import { getBaseDomain, getResponseKey } from "../utils";

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

export const getAppListener = <Data>(
    cookieName: string,
    iframeUrl: string,
    resolve: (data: Data) => void,
    reject: (err: Error) => void,
): Listener => {

    // Create a listener, which will await iframe responses
    const listener: Listener = ({ origin, data: maybeIframePayload }) => {
        try {
            const { data, error, key } = JSON.parse(maybeIframePayload);
            const requesterBaseDomain = getBaseDomain(origin);
            const expectedBaseDomain = getBaseDomain(iframeUrl);
            if (
                // Ensure the caller is the main site's iframe
                requesterBaseDomain === expectedBaseDomain &&
                // and that the path is intended for this module
                key === getResponseKey(cookieName)
            ) {
                // Clean up:
                window.removeEventListener('message', listener);

                if (error || !data) {
                    // Uh-oh! Something went wrong! Relay error to caller:
                    reject(new Error(`No data received from ${cookieName} cookie request! ${error || 'No data in payload!'}`))
                } else {
                    // Success! Relay the data to the caller:
                    resolve(data as Data);
                }
            }
        } catch (e) {
            // Leaving this catch empty, as a log here can get bombarded with
            // errors from post requests made by ads, etc.
        }
    };

    return listener
}

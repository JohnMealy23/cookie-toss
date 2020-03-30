import { getDomainAndPath } from '../common/urlUtils';
import { IframeResponse, AppConfig } from '../common/types';

/**
 * Here we create the listening functions that will receive data-type specific
 * requests within the iframe, retrieve the data via the user-defined DataConfig
 * handler, cache said data in localStorage, then return it to the requesting
 * application.
 */

interface ListenerSpecs {
    origin: string;
    data: string;
};

type Listener = (specs: ListenerSpecs) => void;

const responseTypeName = 'response'

export const setAppListener = <Data>(
    { dataKey, iframeUrl }: AppConfig<Data>
): Promise<Data | null> => new Promise((resolve, reject) => {

    // // Cache the iframe's base domain for use in IDing requests from
    // // it later on.
    const iframeLocation = getDomainAndPath(iframeUrl);

    // Create a listener, which will await iframe responses
    const listener: Listener = ({ origin, data: maybeIframePayload }) => {

        // Attempt to parse payload:
        let response
        try {
            response = (JSON.parse(maybeIframePayload) || {}) as IframeResponse;
        } catch (e) {
            // Leaving this catch empty, as a log here can get bombarded with
            // errors from post requests made by ads, etc.
            return
        }

        if (
            // Ensure the caller is the main site's iframe
            iframeLocation === getDomainAndPath(origin) &&
            // and that this is a response from the iframe:
            response.type === responseTypeName &&
            // and that the response is intended for this data type
            response.dataKey === dataKey
        ) {
            // Clean up:
            window.removeEventListener('message', listener);

            if ('error' in response) {
                // Uh-oh! Something went wrong! Relay error to caller:
                reject(new Error(`Error received from ${dataKey} data request! ${response.error}`))
            } else {
                // Success! Relay the data to the caller:
                let result
                try {
                    result = typeof response.data === 'string' ?
                        JSON.parse(response.data) :
                        response.data
                } catch (e) {
                    result = response.data
                }
                resolve(result as Data);
            }
        }
    };

    // Set the listener a-listenin':
    window.addEventListener('message', listener, false);
})

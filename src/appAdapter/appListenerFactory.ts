import { getDomainAndPath } from '../common/urlUtils';
import { IframeResponse, AppConfig, AppListener } from '../common/types';

/**
 * Here we create the listening functions that will receive data-type specific
 * requests within the iframe, retrieve the data via the user-defined DataConfig
 * handler, cache said data in localStorage, then return it to the requesting
 * application.
 */

const responseTypeName = 'response'

export const appListenerFactory = <AppData>(
    { dataKey, iframeUrl }: AppConfig<AppData>
): Promise<AppData | null> => new Promise((resolve, reject) => {

    // // Cache the iframe's base domain for use in IDing requests from
    // // it later on.
    const iframeLocation = getDomainAndPath(iframeUrl);

    // Create a listener, which will await iframe responses
    const listener: AppListener = ({ origin, data: maybeIframePayload }) => {
        // Attempt to parse payload:
        let response: IframeResponse<AppData>
        let responseType
        let responseDataKey
        try {
            response = JSON.parse(maybeIframePayload);
            responseType = response.type
            responseDataKey = response.dataKey
        } catch (e) {
            // Guess it wasn't one of ours.
            // Logging here might not be a bad idea, but also might get noisy
            // if ads and whatnot started emitting to this iframe.
            return
        }

        if (
            // Ensure the caller is the main site's iframe
            iframeLocation === getDomainAndPath(origin) &&
            // and that this is a response from the iframe:
            responseType === responseTypeName &&
            // and that the response is intended for this data type
            responseDataKey === dataKey
        ) {
            // Clean up:
            window.removeEventListener('message', listener);

            if ('data' in response) {
                // Success! Relay the data to the caller:
                resolve(response.data);
            } else if ('error' in response) {
                // Uh-oh! Something went wrong! Relay error to caller:
                reject(new Error(`Error received from ${dataKey} data request! ${response.error}`))
            } else {
                reject(new Error(`No data or errors received in request for ${dataKey}.  Please submit a ticket to the project maintainers including the custom handler for ${dataKey}, should one exist. This should not be possible.`))
            }
        }
    };

    // Set the listener a-listenin':
    window.addEventListener('message', listener, false);
})

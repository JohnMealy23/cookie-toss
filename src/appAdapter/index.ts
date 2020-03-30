import { setAppListener } from './setAppListener';
import { sendRequest } from './sendRequest';
import {
    RequestTypes,
    AppConfigSetterOptions,
    AppConfigGetterOptions,
    AppConfig
} from '../types';
import { REQUEST_TYPE_GET, REQUEST_TYPE_SET } from '../constants';

/**
 * In this file we set up the listener for the application,
 * then send out the request for the cookie value to the iframe.
 *
 * The iframe will receive the request and check for a pre-existing
 * cookie value.  If that value does not exist, the iframe will
 * execute the user-defined data-getter, cookie-ing the response.
 *
 * Finally, the iframe will relay to recovered value back to the
 * application.
 */

export const get = <Data>(config: AppConfigGetterOptions<Data>): Promise<Data | null> => {
    const type = REQUEST_TYPE_GET
    return makeRequest<Data>(config, type)
}

export const set = <Data>(config: AppConfigSetterOptions<Data>): Promise<Data | null> => {
    const type = REQUEST_TYPE_SET
    return makeRequest<Data>(config, type)
}

const makeRequest = async <Data>(
    config: AppConfig<Data>, type: RequestTypes
): Promise<Data | null> => {
    // Create and attach listener, to await iframe responses, and
    // relay them back to the host app.
    const resultPromise = setAppListener<Data>(config)

    // Create the request for data, and send it into the iframe:
    sendRequest(type, config)

    return resultPromise
};

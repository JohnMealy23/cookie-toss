import { getRequestKey } from "../utils";
import { getAppListener } from "./getAppListener";
import { sendRequest } from "./sendRequest";
import { AppConfig } from "../types";

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

export const gimmeThatCookieGoodness = <Data>({
    cookieName,
    iframeUrl,
    data,
    resetCookie
}: AppConfig): Promise<Data> => new Promise((resolve, reject) => {

    // Create and attach listener, to await iframe responses, and
    // relay them back to the host app.
    const listener = getAppListener<Data>(cookieName, iframeUrl, resolve, reject)
    window.addEventListener('message', listener, false);

    // Create the request for data, and send it into the iframe:
    const request = {
        key: getRequestKey(cookieName),
        data,
        resetCookie
    };
    sendRequest(iframeUrl, request)
});

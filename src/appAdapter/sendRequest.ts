import { getIframe } from "./getIframe";
import { AppRequest, RequestTypes, AppConfig } from "../types";
import { getRequestKey } from "../utils";

/**
 * Here we inject or gather the cached iframe, then post the request to it.
 */

export const sendRequest = async <AppData>(type: RequestTypes, config: AppConfig<AppData>) => {

    const { cookieName, iframeUrl } = config

    // Get the iframe via injection or recovering the cached one:
    const iframe = await getIframe(iframeUrl)

    // The key is how the iframe accesses the user-defined data getter in the
    // iframe, if one exists.
    const key = getRequestKey(cookieName)

    // Form the request object to send to the iframe:
    const request: AppRequest<AppData> = { key, type, config };

    // Send the iframe the request upon load into the DOM:
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify(request), iframeUrl);
    } else {
        throw new Error('iframe contentWindow not present on window. Something has apparently removed it.')
    }

}

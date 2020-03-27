import { getIframe } from "./getIframe";
import { AppRequest } from "../types";

/**
 * Here we inject or gather the cached iframe, then post the request to it.
 */

export const sendRequest = async (iframeUrl: string, request: AppRequest) => {

    // Get the iframe via injection or recovering the cached one:
    const iframe = await getIframe(iframeUrl)

    // Send the iframe the request upon load into the DOM:
    if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify(request), iframeUrl);
    } else {
        throw new Error('iframe contentWindow not present on window. Something has apparently removed it.')
    }

}

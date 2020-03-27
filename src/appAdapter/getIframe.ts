import { getBaseDomain } from "../utils"

type IframeCache = { [domain: string]: Promise<HTMLIFrameElement> }
let cache: IframeCache = {}

/**
 * Create and cache the iframe.
 *
 * We're caching by domain, in case mutliple hub sites are referenced
 * from a single domain.
 *
 * We're returning a promise to avoid a race condition.  If two calls
 * go out for the same iframe, and the second happens before the iframe
 * has loaded, we want the second to also be beholden to the iframe's
 * loading.  The promise is what ensures the iframe has loaded, so we'll
 * need to return that for all subsequent calls.
 */

export const getIframe = async (iframeUrl: string): Promise<HTMLIFrameElement> => {
    const domain = getBaseDomain(iframeUrl)
    cache[domain] = cache[domain] || createIframe(iframeUrl)
    return cache[domain]
}

/**
 * Create an promise that resolves to a fully-loaded iframe:
 */

const createIframe = (iframeUrl: string): Promise<HTMLIFrameElement> => new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.onload = () => resolve(iframe)
    window.document.body.appendChild(iframe);
})

/**
 * For testing purposes:
 */

export const resetIframes = () => {
    cache = {}
}

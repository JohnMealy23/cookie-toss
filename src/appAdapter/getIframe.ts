let iframe: HTMLIFrameElement | undefined

/**
 * Create and cache the iframe.
 */

export const getIframe = (iframeUrl: string): Promise<HTMLIFrameElement> => new Promise((resolve) => {
    if (iframe) {
        return resolve(iframe)
    }
    // Create iframe
    iframe = document.createElement('iframe')
    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.onload = () => resolve(iframe)

    window.document.body.appendChild(iframe);
})

export const resetIframe = () => {
    iframe = undefined
}

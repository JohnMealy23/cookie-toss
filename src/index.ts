// Import `gimmeThatCookieGoodness` into the dependent application,
// and pass it the iframe's URL on the hub site and cookie name
// to retrieve the cookie value from the hub site:
export { gimmeThatCookieGoodness } from './appAdapter';

// Import `createIframe` into your project, and init it with the
// proper config.  The output of this should be placed in an iframe
// and hosted on the hub domain.  Check out the readme for further
// instructions!
export { createIframe } from './iframe';

export {
    CookieConfig,
    AppConfig,
    IframeConfig,
    SafeRequestData
} from './types'

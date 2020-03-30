// To retrieve and set the data values, import `get` and
// `set` into the dependent application,
// and pass them the iframe's URL and the dataKey under
// which the data lives.
export { get, set } from './appAdapter';

// Import `createIframe` into your project, and init it with the
// proper config.  The output of this should be placed in an iframe
// and hosted on the hub domain.  Check out the readme for further
// instructions!
export { createIframe } from './iframe';

export {
    AppConfigGetterOptions,
    AppConfigSetterOptions,
    DataConfig,
    IframeConfig,
    StringifiableRequestData
} from './common/types'

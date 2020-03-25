// This is the top-level file to be housed in the main site's iframe.
// It waits to be injected into its parent page, and then called upon to relay the main site's cookies outward.
import {
    paths as pathsTest,
    endpoint as endpointTest,
} from '../modules/example';

import { setReceiver } from './setReceiver';
import { Api } from '../types';

// Each index in `api` houses a different dataset to be stored on the main site, and shared across domains
const api: Api = {
    [pathsTest.request]: endpointTest
    // Add additional endpoints here - one per cookie to be shared.
};
setReceiver(api);

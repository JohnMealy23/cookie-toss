import { setIframeListener } from './iframeListener';
import { createIframeRoutes } from './createIframeRoutes';
import { IframeConfig } from '../types';
import { getBaseDomain } from '../utils';

export const createIframe = ({
    dependentDomains,
    dataConfigs = [],
}: IframeConfig) => {

    // Create routes for default and custom data getters.
    const routes = createIframeRoutes(dataConfigs)

    // Add the local domain to the whitelisted domains by default:
    dependentDomains.push(getBaseDomain(origin))

    // Create the listener, which picks up requests, filters
    // out non-whitelisted domains, and receives data based on
    // the dataKey of the response:
    setIframeListener(routes, dependentDomains);
}

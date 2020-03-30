import { setIframeListener } from './iframeListener';
import { createIframeRoutes } from './createIframeRoutes';
import { IframeConfig } from '../types';
import { getBaseDomain } from '../utils';

export const createIframe = ({
    dependentDomains,
    cookieConfigs = [],
}: IframeConfig) => {

    // Create routes for default and custom cookie getters.
    const routes = createIframeRoutes(cookieConfigs)

    // Add the local domain to the whitelisted domains by default:
    dependentDomains.push(getBaseDomain(origin))

    // Create the listener, which picks up requests, filters
    // out non-whitelisted domains, and retrieves cookie
    // data based on the cookie's route referenced in the request
    setIframeListener(routes, dependentDomains);
}
